/**
 * One-off: shrink large product / variant images already stored in the bucket.
 *
 * Old uploads were stored untouched (many are 2-7MB PNGs), which makes product cards slow and makes the
 * Next.js image optimizer time out. New uploads are compressed automatically; this script fixes old ones.
 *
 *   node scripts/compressExistingImages.js           # dry run: only lists what would change
 *   node scripts/compressExistingImages.js --apply   # uploads a compressed .webp copy and updates the DB row
 *
 * Originals are NOT deleted, so a change can be reverted by restoring the old `url` value in the DB.
 */
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3client from "../utils/s3client.js";
import { prisma } from "../config/db.js";
import { getFileUrl } from "../utils/deleteFromS3.js";

const APPLY = process.argv.includes("--apply");
const MIN_BYTES = 600 * 1024; // only touch images larger than this

const tables = [
  { name: "ProductImage", model: prisma.productImage },
  { name: "ProductVariantImage", model: prisma.productVariantImage },
];

const toKey = (url) => url.replace(/^https?:\/\/[^/]+\//, "");

let saved = 0;
let changed = 0;

for (const { name, model } of tables) {
  const rows = await model.findMany({ select: { id: true, url: true } });
  console.log(`\n${name}: ${rows.length} rows`);

  for (const row of rows) {
    if (!row.url || /\.gif$/i.test(row.url)) continue;

    try {
      const res = await fetch(getFileUrl(toKey(row.url)));
      if (!res.ok) {
        console.log(`  skip (HTTP ${res.status}): ${row.url}`);
        continue;
      }
      const original = Buffer.from(await res.arrayBuffer());
      if (original.length < MIN_BYTES) continue;

      const compressed = await sharp(original)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const oldKey = toKey(row.url);
      const dir = oldKey.substring(0, oldKey.lastIndexOf("/"));
      const base = oldKey.substring(oldKey.lastIndexOf("/") + 1).replace(/\.[a-z0-9]+$/i, "");
      const newKey = `${dir}/${base}.webp`;

      console.log(
        `  ${(original.length / 1024).toFixed(0)}KB -> ${(compressed.length / 1024).toFixed(0)}KB  ${oldKey}`
      );
      saved += original.length - compressed.length;
      changed++;

      if (APPLY) {
        await s3client.send(
          new PutObjectCommand({
            Bucket: process.env.SPACES_BUCKET,
            Key: newKey,
            Body: compressed,
            ACL: "public-read",
            ContentType: "image/webp",
          })
        );
        await model.update({ where: { id: row.id }, data: { url: newKey } });
      }
    } catch (err) {
      console.log(`  failed: ${row.url} (${err.message})`);
    }
  }
}

console.log(
  `\n${APPLY ? "Updated" : "Would update"} ${changed} images, saving ~${(saved / 1024 / 1024).toFixed(1)}MB.` +
    (APPLY ? "" : "  Re-run with --apply to do it.")
);
process.exit(0);

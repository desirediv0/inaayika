import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const DEFAULT_ANNOUNCEMENTS = [
  "Summer Sale - Extra 25% off on Orders above ₹5000",
  "Complimentary Free Doorstep Delivery Across India on Orders Above ₹5000",
  "Summer Sale - Extra 15% off on Orders above ₹1500 + 5% off on Prepaid Orders",
];

const getAnnouncementSettings = async () =>
  prisma.announcementSettings.findUnique({ where: { id: "global" } });

export const getPublicAnnouncements = asyncHandler(async (_req, res) => {
  const settings = await getAnnouncementSettings();
  const messages = settings?.messages.length
    ? settings.messages
    : DEFAULT_ANNOUNCEMENTS;

  res
    .status(200)
    .json(new ApiResponsive(200, { messages }, "Announcements fetched successfully"));
});

export const getAdminAnnouncements = asyncHandler(async (_req, res) => {
  const settings = await getAnnouncementSettings();
  const messages = settings?.messages.length
    ? settings.messages
    : DEFAULT_ANNOUNCEMENTS;

  res.status(200).json(
    new ApiResponsive(
      200,
      { messages, updatedAt: settings?.updatedAt ?? null },
      "Announcement settings fetched successfully"
    )
  );
});

export const updateAdminAnnouncements = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (
    !Array.isArray(messages) ||
    messages.length < 1 ||
    messages.length > 10 ||
    messages.some(
      (message) =>
        typeof message !== "string" ||
        !message.trim() ||
        message.trim().length > 180
    )
  ) {
    throw new ApiError(
      400,
      "Provide between 1 and 10 announcement messages, each no longer than 180 characters"
    );
  }

  const settings = await prisma.announcementSettings.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      messages: messages.map((message) => message.trim()),
      updatedBy: req.admin.id,
    },
    update: {
      messages: messages.map((message) => message.trim()),
      updatedBy: req.admin.id,
    },
  });

  res.status(200).json(
    new ApiResponsive(
      200,
      { messages: settings.messages, updatedAt: settings.updatedAt },
      "Announcement settings updated successfully"
    )
  );
});

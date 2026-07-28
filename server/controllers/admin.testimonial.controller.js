import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { deleteFromS3, getFileUrl } from "../utils/deleteFromS3.js";
import { processAndUploadImage } from "../middlewares/multer.middlerware.js";

// Get all testimonials (admin)
export const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, isActive, sort = "displayOrder", order = "asc" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filterConditions = {
    ...(isActive !== undefined && { isActive: isActive === "true" }),
  };

  const total = await prisma.testimonial.count({ where: filterConditions });

  const testimonials = await prisma.testimonial.findMany({
    where: filterConditions,
    orderBy: [{ [sort]: order }, { createdAt: "desc" }],
    skip,
    take: parseInt(limit),
  });

  const formatted = testimonials.map((t) => ({
    ...t,
    image: t.image ? getFileUrl(t.image) : null,
  }));

  res.status(200).json(
    new ApiResponsive(200, {
      testimonials: formatted,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, "Testimonials fetched successfully")
  );
});

// Get testimonial by ID (admin)
export const getTestimonialById = asyncHandler(async (req, res) => {
  const { testimonialId } = req.params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  res.status(200).json(
    new ApiResponsive(200, {
      testimonial: { ...testimonial, image: testimonial.image ? getFileUrl(testimonial.image) : null },
    }, "Testimonial fetched successfully")
  );
});

// Create testimonial (admin)
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, rating, text, displayOrder, isActive } = req.body;

  if (!name || !text) throw new ApiError(400, "Name and text are required");

  let imageUrl = null;
  if (req.files && req.files.image && req.files.image[0]) {
    try {
      imageUrl = await processAndUploadImage(req.files.image[0]);
    } catch (error) {
      throw new ApiError(400, "Failed to upload image: " + error.message);
    }
  }

  let order = 0;
  if (displayOrder !== undefined && displayOrder !== null && displayOrder !== "") {
    order = parseInt(displayOrder) || 0;
  } else {
    const maxOrder = await prisma.testimonial.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    order = maxOrder ? maxOrder.displayOrder + 1 : 0;
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      role: role || null,
      rating: parseFloat(rating) || 5,
      text,
      image: imageUrl,
      displayOrder: order,
      isActive: isActive !== "false" && isActive !== false,
    },
  });

  res.status(201).json(
    new ApiResponsive(201, {
      testimonial: { ...testimonial, image: testimonial.image ? getFileUrl(testimonial.image) : null },
    }, "Testimonial created successfully")
  );
});

// Update testimonial (admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { testimonialId } = req.params;
  const { name, role, rating, text, displayOrder, isActive } = req.body;

  const existing = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!existing) throw new ApiError(404, "Testimonial not found");

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (role !== undefined) updateData.role = role || null;
  if (rating !== undefined) updateData.rating = parseFloat(rating) || 5;
  if (text !== undefined) updateData.text = text;
  if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder) || 0;
  if (isActive !== undefined) updateData.isActive = isActive === "true" || isActive === true;

  if (req.files && req.files.image && req.files.image[0]) {
    if (existing.image) await deleteFromS3(existing.image);
    try {
      updateData.image = await processAndUploadImage(req.files.image[0]);
    } catch (error) {
      throw new ApiError(400, "Failed to upload image: " + error.message);
    }
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: updateData,
  });

  res.status(200).json(
    new ApiResponsive(200, {
      testimonial: { ...testimonial, image: testimonial.image ? getFileUrl(testimonial.image) : null },
    }, "Testimonial updated successfully")
  );
});

// Delete testimonial (admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { testimonialId } = req.params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  if (testimonial.image) await deleteFromS3(testimonial.image);

  await prisma.testimonial.delete({ where: { id: testimonialId } });

  res.status(200).json(new ApiResponsive(200, null, "Testimonial deleted successfully"));
});

// Toggle active status (admin)
export const toggleActiveTestimonial = asyncHandler(async (req, res) => {
  const { testimonialId } = req.params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  const updated = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { isActive: !testimonial.isActive },
  });

  res.status(200).json(
    new ApiResponsive(200, {
      testimonial: { ...updated, image: updated.image ? getFileUrl(updated.image) : null },
    }, `Testimonial ${updated.isActive ? "activated" : "deactivated"} successfully`)
  );
});

// Get active testimonials (public - for client home page)
export const getActiveTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      role: true,
      rating: true,
      text: true,
      image: true,
      displayOrder: true,
    },
  });

  const formatted = testimonials.map((t) => ({
    ...t,
    image: t.image ? getFileUrl(t.image) : null,
  }));

  res.status(200).json(
    new ApiResponsive(200, { testimonials: formatted }, "Active testimonials fetched successfully")
  );
});

import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Video title is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Video thumbnail is required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed. Please try again")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    if (!video) {
        throw new ApiError(500, "Video upload failed. Please try again")
    }

    const uploadedVideo = await Video.create({
        title,
        description,
        thumbnail: {
            url: thumbnail?.secure_url,
            public_id: thumbnail?.public_id,
            resource_type: thumbnail?.resource_type
        },
        video: {
            url: video?.secure_url,
            public_id: video?.public_id,
            resource_type: video?.resource_type
        },
        duration: video?.duration,
        owner: req.user?._id
    });

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong. Please try again")
    }

    return res.status(201).json(
        new ApiResponse(201, uploadedVideo, "Video uploaded successfully")
    );

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user?._id)) {
        throw new ApiError(403, "You're not authorized to edit this video");
    }

    const updatedFields = {};

    if (title?.trim()) updatedFields.title = title;
    if (description?.trim()) updatedFields.description = description;

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {
        const oldThumbnailPublicId = video.thumbnail?.public_id;
        const oldThumbnailResource_type = video.thumbnail?.resource_type;

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail) {
            throw new ApiError(500, "Thumbnail upload failed. Please try again")
        }

        if (thumbnail) {
            updatedFields.thumbnail = {
                url: thumbnail.secure_url,
                public_id: thumbnail.public_id,
                resource_type: thumbnail.resource_type
            };
        }

        if (oldThumbnailPublicId) {
            await deleteFromCloudinary(oldThumbnailPublicId, oldThumbnailResource_type);
        }
    }

    if (Object.keys(updatedFields).length === 0) {
        return res.status(200).json(
            new ApiResponse(200, video, "No changes made")
        );
    }

    Object.assign(video, updatedFields);
    await video.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.owner.equals(req.user?._id)) {
        throw new ApiError(403, "You are not authorized to update publish status")
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Published status updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.owner.equals(req.user?._id)) {
        throw new ApiError(403, "You're not authorized to delete this video")
    }

    const thumbnailPublicId = video.thumbnail?.public_id;
    const thumbnailResource_type = video.thumbnail?.resource_type;
    const videoPublicId = video.video?.public_id;
    const videoResource_type = video.video?.resource_type;

    // Delete video from DB
    await video.deleteOne();

    // Delete files from cloudinary
    try {

        if (thumbnailPublicId) {
            await deleteFromCloudinary(thumbnailPublicId, thumbnailResource_type)
        }

        if (videoPublicId) {
            await deleteFromCloudinary(videoPublicId, videoResource_type);
        }

    } catch (error) {
        throw new ApiError(500, "Something went wrong. Please try again")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )

})

const getMyVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const videos = await Video.find({ owner: req.user?._id })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalVideos = await Video.countDocuments({ owner: req.user?._id });
    const totalPages = Math.ceil(totalVideos / limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                pagination: {
                    totalVideos,
                    currentPage: page,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            },
            "Videos fetched successfully"
        )
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.isPublished && video.owner._id.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "This video is not published")
    }

    video.views += 1;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );

})

export {
    uploadVideo,
    updateVideo,
    togglePublishStatus,
    deleteVideo,
    getMyVideos,
    getVideoById,
}
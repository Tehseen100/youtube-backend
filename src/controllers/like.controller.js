import mongoose from "mongoose";
import { Like } from "../models/Like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        // Unlike
        await Like.deleteOne({ _id: alreadyLiked._id });

        return res.status(200).json(
            new ApiResponse(200, { isLikedByUser: false }, "Video unliked successfully")
        );
    }

    // Like
    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLikedByUser: true }, "Video liked successfully")
    );
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const alreadyLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        // Unlike
        await Like.deleteOne({ _id: alreadyLiked._id });

        return res.status(200).json(
            new ApiResponse(200, { isLikedByUser: false }, "Comment unliked successfully")
        );
    }

    // Like
    await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLikedByUser: true }, "Comment liked successfully")
    );

})

const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const totalLikes = await Like.countDocuments({ video: videoId });

    const isLikedByUser = await Like.exists({
        video: videoId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalLikes,
            isLikedByUser: Boolean(isLikedByUser)
        }, "Video likes fetched successfully")
    );

})

const getCommentLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const totalLikes = await Like.countDocuments({ comment: commentId });

    const isLikedByUser = await Like.exists({
        comment: commentId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalLikes,
            isLikedByUser: Boolean(isLikedByUser)
        }, "Comment likes fetched successfully")
    );

})

const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.find({ likedBy: req.user?._id })
        .populate("video")
        .sort({ createdAt: -1 });

    const videos = likedVideos.map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, videos, "Liked videos fetched successfully")
    );

})

export {
    toggleVideoLike,
    toggleCommentLike,
    getVideoLikes,
    getCommentLikes,
    getLikedVideos
}
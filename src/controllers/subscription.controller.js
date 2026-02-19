import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (channelId === req.user?._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const channelExists = await User.findById(channelId);

    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    });


    if (existingSubscription) {
        // Unsubscribe
        await existingSubscription.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, { isSubscribed: false }, "Unsubscribed successfully")
        );
    }

    // Subscribe
    await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, { isSubscribed: true }, "Subscribed successfully")
    );

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
        throw new ApiError(404, "User not found");
    }

    const subscribers = await Subscription
        .find({ channel: userId })
        .populate("subscriber", "username avatar coverImage")
        .lean();

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );

})

const getUserSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
        throw new ApiError(404, "User not found")
    }

    const subscribedChannels = await Subscription
        .find({ subscriber: userId })
        .populate("channel", "username avatar coverImage")
        .lean();

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getUserSubscribedChannels,
}


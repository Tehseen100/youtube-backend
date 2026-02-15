import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
        throw new ApiError(400, "Old password is required")
    }

    if (!newPassword) {
        throw new ApiError(400, "New password is required")
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )

})

const changeAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is missing");
    }

    // Upload new avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed. Please try again");
    }

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const oldAvatarPublicId = user?.avatar?.public_id;

    // Update user avatar
    user.avatar = {
        url: avatar.secure_url,
        public_id: avatar.public_id
    };

    await user.save({ validateBeforeSave: false });

    // Delete old avatar
    if (oldAvatarPublicId) {
        await deleteFromCloudinary(oldAvatarPublicId);
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Avatar updated successfully")
    );
})

const changeCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is missing")
    }

    // Upload new cover image
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new ApiError(500, "Cover image upload failed. Please try again")
    }

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const oldCoverImagePublicId = user?.coverImage?.public_id;

    // Update user cover image
    user.coverImage = {
        url: coverImage?.secure_url,
        public_id: coverImage?.public_id
    }

    await user.save({ validateBeforeSave: true });

    // Dlete old cover image
    if (oldCoverImagePublicId) {
        await deleteFromCloudinary(oldCoverImagePublicId);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;


    if (Object.keys(updateFields).length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, req.user, "No changes made")
            );
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        updateFields,
        {
            returnDocument: "after",
            runValidators: true
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        )

})

export {
    getCurrentUser,
    changePassword,
    changeAvatar,
    changeCoverImage,
    updateAccountDetails
}
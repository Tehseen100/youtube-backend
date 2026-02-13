import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    // console.log({ fullName, username, email, password })

    const normalizedUsername = username.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    const existedUser = await User.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed. Please try again")
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: {
            url: avatar?.secure_url,
            public_id: avatar?.public_id
        },
        coverImage: coverImage ? {
            url: coverImage?.secure_url,
            public_id: coverImage?.public_id
        } : undefined,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        )

})


export { registerUser }
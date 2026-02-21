import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

likeSchema.index({ video: 1, likedBy: 1 }, { unique: true });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
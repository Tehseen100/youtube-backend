import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subscribedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate subscriptions
subscriptionSchema.index(
    { subscriber: 1, subscribedTo: 1 },
    { unique: true }
)


export const Subscription = mongoose.model("Subscription", subscriptionSchema);
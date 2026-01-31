import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    clerkUserId: string;
    email: string;
    role: "admin" | "user";
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLoginAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
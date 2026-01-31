import mongoose from "mongoose";
import { User } from "../models/User.js";
import * as dotenv from 'dotenv';
dotenv.config();

async function seedAdmin() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI not defined in .env file");
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // ⚠️ UPDATE THIS WITH YOUR ACTUAL CLERK USER ID
        const adminClerkUserId = "user_38k7Z8mXpEa1ErAGCTs4tyt62Xu";
        const adminEmail = "ritanshupatel88@gmail.com";

        // Find existing user by Clerk ID
        const existingUser = await User.findOne({ clerkUserId: adminClerkUserId });

        if (existingUser) {
            console.log("⚠️ User already exists:", existingUser.email);

            // Update to admin role
            if (existingUser.role !== "admin") {
                existingUser.role = "admin";
                await existingUser.save();
                console.log("✅ Updated user to admin role");
            } else {
                console.log("✅ User is already an admin");
            }

            // Update email if it's the temp one
            if (existingUser.email.includes("@temp.com")) {
                existingUser.email = adminEmail;
                await existingUser.save();
                console.log("✅ Updated email to:", adminEmail);
            }
        } else {
            // Create new admin user
            const admin = await User.create({
                clerkUserId: adminClerkUserId,
                email: adminEmail,
                role: "admin",
                isActive: true,
                lastLoginAt: new Date(),
            });

            console.log("✅ Admin user created:", admin.email);
        }

        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        throw error;
    }
}

// Run the seed function
seedAdmin()
    .then(() => {
        console.log("🎉 Seed completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Seed failed:", error);
        process.exit(1);
    });
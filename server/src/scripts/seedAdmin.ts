import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User } from "../models/User.js";

async function seedAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("❌ MONGODB_URI not found in .env");
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");

        // ⚠️ CHANGE THIS TO YOUR EMAIL
        const adminEmail = "ritanshupatel88@gmail.com"; // ← PUT YOUR REAL EMAIL HERE

        const user = await User.findOneAndUpdate(
            { email: adminEmail },
            { $set: { role: "admin" } },
            { new: true }
        );

        if (user) {
            console.log(`✅ ${adminEmail} is now an admin!`);
            console.log("User details:", {
                id: user._id,
                email: user.email,
                role: user.role
            });
        } else {
            console.log(`⚠️ User with email ${adminEmail} not found.`);
            console.log("Make sure you've logged in at least once first!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedAdmin();
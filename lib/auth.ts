import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";
import type { VercelRequest } from "@vercel/node";
import { User } from "../models/User.js";
import type { IUser } from "../models/User.js";

/**
 * Extract and verify Clerk session token from Authorization header
 * Uses modern JWT verification
 */
export async function getAuthUserId(req: VercelRequest): Promise<string | null> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.substring(7);

        // ✅ Modern approach: Verify JWT token directly
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
            issuer: (iss) => iss.startsWith("https://"), // Accept any Clerk issuer
        });

        return payload.sub; // User ID is in the 'sub' claim
    } catch (error) {
        console.error("❌ Auth verification failed:", error);
        return null;
    }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(req: VercelRequest): Promise<string> {
    const userId = await getAuthUserId(req);

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return userId;
}

/**
 * Get or create user in MongoDB (syncs from Clerk)
 */
export async function getOrCreateUser(clerkUserId: string): Promise<IUser> {
    let user = await User.findOne({ clerkUserId });

    if (!user) {
        // Fetch user from Clerk
        const clerkUser = await clerkClient.users.getUser(clerkUserId);

        user = await User.create({
            clerkUserId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com",
            role: "user",
            isActive: true,
            lastLoginAt: new Date(),
        });

        console.log("✅ New user synced:", user.email);
    } else {
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
    }

    return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(req: VercelRequest): Promise<IUser> {
    const userId = await requireAuth(req);
    const user = await getOrCreateUser(userId);

    if (user.role !== "admin") {
        throw new Error("Admin access required");
    }

    return user;
}
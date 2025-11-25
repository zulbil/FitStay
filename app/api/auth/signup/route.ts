import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, firstName, lastName } = await request.json();
    
    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        username,
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        provider: "local",
      })
      .returning();
    
    return NextResponse.json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: firstName ? `${firstName} ${lastName || ""}`.trim() : username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Failed to create account" },
      { status: 500 }
    );
  }
}

import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router: IRouter = Router();
const SECRET = process.env.AUTH_SECRET || "pscmr-cet-innomind-2026";

function generateToken(userId: number): string {
  const data = `${userId}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${hmac}`).toString("base64url");
}

function verifyToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [userId, timestamp, hmac] = parts;
    const data = `${userId}:${timestamp}`;
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    if (hmac !== expected) return null;
    return parseInt(userId);
  } catch {
    return null;
  }
}

// POST /api/auth/register
router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, rollNumber, branch, year } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      password: hashed,
      role: "student",
      rollNumber: rollNumber || null,
      branch: branch || null,
      year: year || null,
    }).returning();
    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, branch: user.branch, year: user.year },
    });
  } catch (err) {
    req.log.error({ err }, "Register failed");
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, branch: user.branch, year: user.year },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/auth/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const token = authHeader.slice(7);
    const userId = verifyToken(token);
    if (!userId) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, branch: user.branch, year: user.year });
  } catch (err) {
    req.log.error({ err }, "Auth/me failed");
    res.status(500).json({ message: "Authentication check failed" });
  }
});

export { verifyToken };
export default router;

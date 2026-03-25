import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { eventsTable, registrationsTable, insertEventSchema } from "@workspace/db/schema";
import { eq, like, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/events", async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = db.select().from(eventsTable);

    const conditions = [];
    if (category && typeof category === "string") {
      conditions.push(eq(eventsTable.category, category));
    }
    if (status && typeof status === "string") {
      conditions.push(eq(eventsTable.status, status));
    }
    if (search && typeof search === "string") {
      conditions.push(like(eventsTable.title, `%${search}%`));
    }

    let events;
    if (conditions.length > 0) {
      events = await db.select().from(eventsTable).where(and(...conditions)).orderBy(eventsTable.date);
    } else {
      events = await db.select().from(eventsTable).orderBy(eventsTable.date);
    }

    res.json(events);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch events");
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch event");
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });
      return;
    }
    const [event] = await db.insert(eventsTable).values(parsed.data).returning();
    res.status(201).json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to create event");
    res.status(500).json({ message: "Failed to create event" });
  }
});

router.put("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });
      return;
    }
    const [event] = await db.update(eventsTable).set(parsed.data).where(eq(eventsTable.id, id)).returning();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to update event");
    res.status(500).json({ message: "Failed to update event" });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(registrationsTable).where(eq(registrationsTable.eventId, id));
    const [deleted] = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete event");
    res.status(500).json({ message: "Failed to delete event" });
  }
});

router.get("/events/:id/registrations", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const regs = await db.select().from(registrationsTable).where(eq(registrationsTable.eventId, id));
    res.json(regs);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch registrations");
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(eventsTable);
    const [upcomingResult] = await db.select({ count: sql<number>`count(*)` }).from(eventsTable).where(eq(eventsTable.status, "upcoming"));
    const [regsResult] = await db.select({ count: sql<number>`count(*)` }).from(registrationsTable);
    const [studentsResult] = await db.select({ count: sql<number>`count(distinct email)` }).from(registrationsTable);

    res.json({
      totalEvents: Number(totalResult?.count ?? 0),
      upcomingEvents: Number(upcomingResult?.count ?? 0),
      totalRegistrations: Number(regsResult?.count ?? 0),
      totalStudents: Number(studentsResult?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch stats");
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { eventsTable, registrationsTable, insertRegistrationSchema } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/registrations", async (req, res) => {
  try {
    const parsed = insertRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });
      return;
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, parsed.data.eventId));
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.registeredCount >= event.maxParticipants) {
      res.status(400).json({ message: "Event is full" });
      return;
    }

    const [registration] = await db.insert(registrationsTable).values(parsed.data).returning();

    await db.update(eventsTable)
      .set({ registeredCount: sql`${eventsTable.registeredCount} + 1` })
      .where(eq(eventsTable.id, parsed.data.eventId));

    res.status(201).json(registration);
  } catch (err) {
    req.log.error({ err }, "Failed to register for event");
    res.status(500).json({ message: "Failed to register for event" });
  }
});

router.delete("/registrations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [reg] = await db.select().from(registrationsTable).where(eq(registrationsTable.id, id));
    if (!reg) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    await db.delete(registrationsTable).where(eq(registrationsTable.id, id));
    await db.update(eventsTable)
      .set({ registeredCount: sql`${eventsTable.registeredCount} - 1` })
      .where(eq(eventsTable.id, reg.eventId));

    res.json({ message: "Registration cancelled successfully" });
  } catch (err) {
    req.log.error({ err }, "Failed to cancel registration");
    res.status(500).json({ message: "Failed to cancel registration" });
  }
});

export default router;

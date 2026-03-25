import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  venue: text("venue").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  organizer: text("organizer").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  status: text("status").notNull().default("upcoming"),
  imageUrl: text("image_url"),
  prizes: text("prizes"),
  entryFee: text("entry_fee"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({
  id: true,
  registeredCount: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;

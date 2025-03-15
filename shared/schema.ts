import { pgTable, text, serial, integer, boolean, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const alarms = pgTable("alarms", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  time: text("time").notNull(), // HH:mm format
  repeatDays: text("repeat_days").array().notNull(), // Array of days: ['MON', 'TUE', etc]
  active: boolean("active").notNull().default(true),
  callerName: text("caller_name").notNull(),
  callerNumber: text("caller_number").notNull(),
  challenge: text("challenge").notNull().default('none'), // none, math, typing
});

export const insertAlarmSchema = createInsertSchema(alarms).omit({ id: true });

export type InsertAlarm = z.infer<typeof insertAlarmSchema>;
export type Alarm = typeof alarms.$inferSelect;

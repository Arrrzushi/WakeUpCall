import { alarms, type Alarm, type InsertAlarm } from "@shared/schema";

export interface IStorage {
  getAlarms(): Promise<Alarm[]>;
  getAlarm(id: number): Promise<Alarm | undefined>;
  createAlarm(alarm: InsertAlarm): Promise<Alarm>;
  updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined>;
  deleteAlarm(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private alarms: Map<number, Alarm>;
  private currentId: number;

  constructor() {
    this.alarms = new Map();
    this.currentId = 1;
  }

  async getAlarms(): Promise<Alarm[]> {
    return Array.from(this.alarms.values());
  }

  async getAlarm(id: number): Promise<Alarm | undefined> {
    return this.alarms.get(id);
  }

  async createAlarm(insertAlarm: InsertAlarm): Promise<Alarm> {
    const id = this.currentId++;
    const alarm: Alarm = { id, ...insertAlarm };
    this.alarms.set(id, alarm);
    return alarm;
  }

  async updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined> {
    const existing = this.alarms.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...alarm };
    this.alarms.set(id, updated);
    return updated;
  }

  async deleteAlarm(id: number): Promise<boolean> {
    return this.alarms.delete(id);
  }
}

export const storage = new MemStorage();

import { type Alarm } from "@shared/schema";
import { showAlarmNotification } from "./notifications";
import { ringtonePlayer } from "./audio";

class AlarmManager {
  private checkInterval: number | null = null;
  private activeAlarms: Map<number, Alarm> = new Map();

  start() {
    if (this.checkInterval) return;
    
    // Check every 30 seconds
    this.checkInterval = window.setInterval(() => this.checkAlarms(), 30000);
    this.checkAlarms(); // Initial check
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  setAlarms(alarms: Alarm[]) {
    this.activeAlarms.clear();
    alarms.filter(alarm => alarm.active).forEach(alarm => {
      this.activeAlarms.set(alarm.id, alarm);
    });
  }

  private checkAlarms() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    const currentDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];

    this.activeAlarms.forEach(alarm => {
      if (alarm.time === currentTime && alarm.repeatDays.includes(currentDay)) {
        this.triggerAlarm(alarm);
      }
    });
  }

  private triggerAlarm(alarm: Alarm) {
    // Initialize audio context
    ringtonePlayer.init();
    
    // Show notification
    const notification = showAlarmNotification("Wake Up Call", {
      body: `Incoming call from ${alarm.callerName}`,
      requireInteraction: true
    });

    // Start playing ringtone
    ringtonePlayer.play();

    // Dispatch custom event for mock call UI
    window.dispatchEvent(new CustomEvent('alarmTriggered', { detail: alarm }));

    // Auto-stop after 1 minute if not answered
    setTimeout(() => {
      ringtonePlayer.stop();
      notification?.close();
    }, 60000);
  }
}

export const alarmManager = new AlarmManager();

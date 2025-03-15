import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AlarmList from "@/components/alarm-list";
import MockCall from "@/components/mock-call";
import { PlusCircle } from "lucide-react";
import { Alarm } from "@shared/schema";
import { alarmManager } from "@/lib/alarmManager";
import { ringtonePlayer } from "@/lib/audio";
import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";

export default function Alarms() {
  const [currentAlarm, setCurrentAlarm] = useState<Alarm | null>(null);

  const { data: alarms, isLoading } = useQuery<Alarm[]>({ 
    queryKey: ['/api/alarms']
  });

  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission();

    // Start alarm manager
    alarmManager.start();

    // Update alarms in manager when they change
    if (alarms) {
      alarmManager.setAlarms(alarms);
    }

    // Listen for alarm triggers
    const handleAlarmTrigger = (event: CustomEvent<Alarm>) => {
      setCurrentAlarm(event.detail);
    };

    window.addEventListener('alarmTriggered', handleAlarmTrigger as EventListener);

    return () => {
      alarmManager.stop();
      window.removeEventListener('alarmTriggered', handleAlarmTrigger as EventListener);
    };
  }, [alarms]);

  const handleAnswerCall = () => {
    ringtonePlayer.stop();
    setCurrentAlarm(null);
  };

  const handleDeclineCall = () => {
    ringtonePlayer.stop();
    setCurrentAlarm(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Wake Up Call</h1>
          <Link href="/create">
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Alarm
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <AlarmList alarms={alarms || []} />
        )}
      </div>

      {currentAlarm && (
        <MockCall 
          alarm={currentAlarm}
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
        />
      )}
    </div>
  );
}
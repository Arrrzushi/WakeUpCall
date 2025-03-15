import { type Alarm } from "@shared/schema";
import AlarmCard from "./alarm-card";
import { motion } from "framer-motion";

interface AlarmListProps {
  alarms: Alarm[];
}

export default function AlarmList({ alarms }: AlarmListProps) {
  return (
    <div className="space-y-4">
      {alarms.map((alarm, i) => (
        <motion.div
          key={alarm.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <AlarmCard alarm={alarm} />
        </motion.div>
      ))}
      
      {alarms.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No alarms set. Create your first alarm to get started!
        </div>
      )}
    </div>
  );
}

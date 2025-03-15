import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, PhoneOff } from "lucide-react";
import { type Alarm } from "@shared/schema";

interface MockCallProps {
  alarm: Alarm;
  onAnswer: () => void;
  onDecline: () => void;
}

export default function MockCall({ alarm, onAnswer, onDecline }: MockCallProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-8">
                  <div className="text-2xl font-bold mb-2">
                    Incoming Call
                  </div>
                  <div className="text-xl text-primary">
                    {alarm.callerName}
                  </div>
                  <div className="text-muted-foreground">
                    {alarm.callerNumber}
                  </div>
                </div>

                <div className="flex justify-center gap-8">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-full h-16 w-16"
                    onClick={onDecline}
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="default"
                    className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600"
                    onClick={onAnswer}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import { type Alarm } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AlarmCardProps {
  alarm: Alarm;
}

export default function AlarmCard({ alarm }: AlarmCardProps) {
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/alarms/${alarm.id}`, {
        active: !alarm.active
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/alarms/${alarm.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({ title: "Alarm deleted" });
    }
  });

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex-1">
          <div className="text-2xl font-bold">{alarm.time}</div>
          <div className="text-muted-foreground">{alarm.label}</div>
          <div className="text-sm text-muted-foreground">
            Incoming call from {alarm.callerName}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Switch
            checked={alarm.active}
            onCheckedChange={() => toggleMutation.mutate()}
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteMutation.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

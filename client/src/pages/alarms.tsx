import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AlarmList from "@/components/alarm-list";
import { PlusCircle } from "lucide-react";
import { Alarm } from "@shared/schema";

export default function Alarms() {
  const { data: alarms, isLoading } = useQuery<Alarm[]>({ 
    queryKey: ['/api/alarms']
  });

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
    </div>
  );
}

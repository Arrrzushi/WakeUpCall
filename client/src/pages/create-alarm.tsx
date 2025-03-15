import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAlarmSchema, type InsertAlarm } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function CreateAlarm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertAlarm>({
    resolver: zodResolver(insertAlarmSchema),
    defaultValues: {
      label: "",
      time: "08:00",
      repeatDays: ["MON", "TUE", "WED", "THU", "FRI"],
      active: true,
      callerName: "Unknown",
      callerNumber: "+1234567890",
      challenge: "none"
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertAlarm) => {
      const res = await apiRequest("POST", "/api/alarms", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarms'] });
      toast({ title: "Alarm created successfully" });
      navigate("/");
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create alarm",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Alarm</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Morning Alarm" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeatDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat Days</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {weekDays.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={field.value.includes(day) ? "default" : "outline"}
                          onClick={() => {
                            const newDays = field.value.includes(day)
                              ? field.value.filter(d => d !== day)
                              : [...field.value, day];
                            field.onChange(newDays);
                          }}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caller Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Unknown Caller" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create Alarm"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
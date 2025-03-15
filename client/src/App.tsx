import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Alarms from "@/pages/alarms";
import CreateAlarm from "@/pages/create-alarm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Alarms}/>
      <Route path="/create" component={CreateAlarm}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

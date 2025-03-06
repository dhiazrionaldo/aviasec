'use client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DepartureFlightSchedule from "./departure/page"
import ArrivalFlightSchedule from "./arrival/page"
import { Suspense } from "react"

export default function ManualSchedule() {
  
  return (
    <Tabs defaultValue="departure">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="departure">Departure</TabsTrigger>
        <TabsTrigger value="arrival">Arrival</TabsTrigger>
      </TabsList>
      <TabsContent value="departure">
        <Suspense fallback={<p>Loading Proposals...</p>}>
          <DepartureFlightSchedule />
        </Suspense>
      </TabsContent>
      <TabsContent value="arrival">
        <Suspense fallback={<p>Loading Order...</p>}>
          <ArrivalFlightSchedule />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

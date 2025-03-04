'use client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DepartureManualSchedule from "./departure/page"
import ArrivalManualSchedule from "./arrival/page"
import { Suspense } from "react"
import DeliveryCheckPage from "./delivery_check/page"

export default function ManualSchedule() {
  
  return (
    <Tabs defaultValue="departure">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="departure">Departure</TabsTrigger>
        <TabsTrigger value="arrival">Arrival</TabsTrigger>
      </TabsList>
      <TabsContent value="departure">
        <Suspense fallback={<p>Loading Proposals...</p>}>
          <DepartureManualSchedule />
        </Suspense>
      </TabsContent>
      <TabsContent value="arrival">
        <Suspense fallback={<p>Loading Order...</p>}>
          <ArrivalManualSchedule />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

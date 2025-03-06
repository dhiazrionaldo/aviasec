'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_company/table/data-table'; // Adjust the import based on your actual DataTable component path
import getDepartureManualFlightSchedule from '@/app/hook/departure_flight_schedule/departure_flight_schedule';
import { columns } from '@/app/(root)/admin/setting/master_company/table/columns'; // Assuming you have a columns definition for the table
import { DatePickerWithRange } from './dateRange';
import { addDays } from "date-fns"; 
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function ArrivalFlightSchedule() {
  const today = new Date();
  const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: firstDate,
    to: addDays(today, 1),
  });

  const [searchParams, setSearchParams] = useState({
    from: firstDate,
    to: addDays(today, 1),
  });

  const { isFetching: isFetching, data: departure_flight_schedule, error: error, refetch} = getDepartureManualFlightSchedule(searchParams);
  
  useEffect(() => {
    if (error) {
      toast.error(`Error fetching order data: ${error.message}`);
    }
  }, [error]);

  const handleSearchFlightSchedule = () => {
    if (dateRange?.from && dateRange?.to) {
      setSearchParams({
        from: dateRange.from,
        to: dateRange.to,
      });
    } else {
      toast.error('Please select a valid date range.');
    }
  };
  

  // Ensure refetch when searchParams change
  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  return (
    <div className="container w-full mx-auto py-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Flight Schedule</h1>
        <div className="flex items-center gap-2">
          <p>Flight Date Range</p>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button onClick={handleSearchFlightSchedule}>
            <Search size={15} />
          </Button>
        </div>
      </div>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={departure_flight_schedule ?? []} />
      )}
    </div>
  );
}
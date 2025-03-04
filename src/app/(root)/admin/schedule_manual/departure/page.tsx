'use client'

import { DataTable } from '@/app/(root)/admin/schedule_manual/departure/table/data-table'; // Adjust the import based on your actual DataTable component path
import getDepartureManualSchedule from '@/app/hook/manual_schedule/manual_schedule';
import { columns } from './table/columns'; // Assuming you have a columns definition for the table

export default function DepartureManualSchedule() {
  const { isFetching, data } = getDepartureManualSchedule();
  
  const userData = data || []; // Adjust according to the actual structure of your profile data
  
  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Departure Manual Schedule</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={userData ?? []} />
      )}
    </div>
  );
}
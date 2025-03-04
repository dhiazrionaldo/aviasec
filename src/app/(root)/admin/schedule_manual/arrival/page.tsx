'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_terminal_pairing/table/data-table'; // Adjust the import based on your actual DataTable component path
import terminalPairingMaster from '@/app/hook/terminal_setting/terminal_merge';
import { columns } from './table/columns'; // Assuming you have a columns definition for the table

export default function ArrivalManualSchedule() {
  const { isFetching, data } = terminalPairingMaster();
  
  const userData = data || []; // Adjust according to the actual structure of your profile data
  
  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Arrival Manual Schedule</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={userData ?? []} />
      )}
    </div>
  );
}
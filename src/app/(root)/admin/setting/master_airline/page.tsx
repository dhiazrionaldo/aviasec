'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_airline/table/data-table'; // Adjust the import based on your actual DataTable component path
import airlineMaster from '@/app/hook/setting/airline';
import { columns } from '@/app/(root)/admin/setting/master_airline/table/columns'; // Assuming you have a columns definition for the table
import terminalMaster from '@/app/hook/setting/terminal';

export default function AirlineMaster() {
  const { isFetching, data } = airlineMaster();
  const {data: masterTerminal} = terminalMaster();
  
  const companies = data || []; // Adjust according to the actual structure of your profile data
  
  

  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Airline Master</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns(masterTerminal)} data={companies ?? []} master_terminal={masterTerminal} />
      )}
    </div>
  );
}
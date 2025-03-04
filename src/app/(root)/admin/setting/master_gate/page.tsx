'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_gate/table/data-table'; // Adjust the import based on your actual DataTable component path
import gateMaster from '@/app/hook/setting/gate';
import { columns } from '@/app/(root)/admin/setting/master_gate/table/columns'; // Assuming you have a columns definition for the table

export default function GateMaster() {
  const { isFetching, data } = gateMaster();
  
  const companies = data || []; // Adjust according to the actual structure of your profile data
  
  

  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Boarding Gate Master</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={companies ?? []} />
      )}
    </div>
  );
}
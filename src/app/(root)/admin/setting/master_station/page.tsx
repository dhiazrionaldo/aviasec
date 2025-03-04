'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_station/table/data-table'; // Adjust the import based on your actual DataTable component path
import stationMaster from '@/app/hook/setting/station';
import { columns } from '@/app/(root)/admin/setting/master_station/table/columns'; // Assuming you have a columns definition for the table

export default function StationMaster() {
  const { isFetching, data } = stationMaster();
  
  const companies = data || []; // Adjust according to the actual structure of your profile data
  
  

  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Station Master</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={companies ?? []} />
      )}
    </div>
  );
}
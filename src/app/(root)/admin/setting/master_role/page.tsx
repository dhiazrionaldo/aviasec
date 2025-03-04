'use client'

import { DataTable } from '@/app/(root)/admin/setting/master_role/table/data-table'; // Adjust the import based on your actual DataTable component path
import roleMaster from '@/app/hook/setting/role';
import { columns } from '@/app/(root)/admin/setting/master_role/table/columns'; // Assuming you have a columns definition for the table

export default function RoleMaster() {
  const { isFetching, data } = roleMaster();
  
  const companies = data || []; // Adjust according to the actual structure of your profile data
  
  

  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">Role Master</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={companies ?? []} />
      )}
    </div>
  );
}
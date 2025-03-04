'use client'

import { DataTable } from '@/app/(root)/admin/setting/users/table/data-table'; // Adjust the import based on your actual DataTable component path
import useProfiles from '@/app/hook/setting/profile';
import { columns } from './table/columns'; // Assuming you have a columns definition for the table

export default function UserManagement() {
  const { isFetching, data } = useProfiles();
  
  const userData = data || []; // Adjust according to the actual structure of your profile data
  
  return (
    <div className="container w-full mx-auto py-6">
      <h1 className="text-3xl font-semibold">User Management</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={userData ?? []} />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import toast from 'react-hot-toast';
import useUser from '@/app/hook/useUser';
import { editRole } from '@/app/hook/setting/role';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditRoleMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [role_name, setRoleName] = useState('');
  const {data} = useUser();    
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  
  

  useEffect(() => {
    if (stockMaster) {
      setRoleName(stockMaster.role_name);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; role_name: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editRole(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["role_master"]}); 
      

      if(updatedCategory){
        toast.success('Success')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      console.error('Error editing:', error);
      toast.error(`Failed to edit item: ${error}`);
    }
  }

  const handleSave = async () => {

    const datas = {
      role_name: role_name,
      id: stockMaster.id,
      modified_by: data?.display_name || '',
    };
    await editStockMaster(datas);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Role Data</SheetTitle>
          <SheetDescription>
            Make changes to your role data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role_name" className="text-right">
              Role Name
            </Label>
            <Input id="role_name" 
                   value={role_name}
                   onChange={(e) => setRoleName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)} 
                   className="col-span-3" 
            />
          </div> */}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Unit Price
            </Label>
            <Input 
              id="price" 
              value={price}
              onChange={handlePriceChange}
              className="col-span-3" 
              type="text" // Use text to allow currency formatting
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storage_minimum_stock" className="text-right">
              Storage Minimum Stock
            </Label>
            <Input id="storage_minimum_stock" 
                   value={storage_minimum_stock}
                   onChange={(e) => setStorageMinimumStock(e.target.value)}
                   className="col-span-3" 
                   type='number'
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lounge_minimum_stock" className="text-right">
              Lounge Minimum Stock
            </Label>
            <Input id="lounge_minimum_stock" 
                   value={lounge_minimum_stock}
                   onChange={(e) => setLoungeMinimumStock(e.target.value)}
                   className="col-span-3" 
                   type='number'
            />
          </div> */}
        </div>
        <SheetFooter>
          {isLoading ? (
            <Button disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>
          ) : (
            <Button className="text-white" type="button" onClick={handleSave}>Save changes</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

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
import { editParkingStand } from '@/app/hook/setting/parking_stand';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditParkingStandMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [parking_stand, setParkingStand] = useState('');
  const {data} = useUser();    
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  
  

  useEffect(() => {
    if (stockMaster) {
      setParkingStand(stockMaster.parking_stand);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; parking_stand: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editParkingStand(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["parking_stand_master"]}); 
      queryClient.invalidateQueries({queryKey: ["parking_stand_master_pairing"]});  
      queryClient.invalidateQueries({queryKey: ["terminal_pairing_master"]}); 

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
      parking_stand: parking_stand,
      id: stockMaster.id,
      modified_by: data?.display_name || '',
    };
    await editStockMaster(datas);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Parking Stand Data</SheetTitle>
          <SheetDescription>
            Make changes to your parking stand data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parking_stand" className="text-right">
              Parking Stand
            </Label>
            <Input id="parking_stand" 
                   value={parking_stand}
                   onChange={(e) => setParkingStand(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
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

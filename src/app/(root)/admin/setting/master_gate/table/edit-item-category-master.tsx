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
import { editGate } from '@/app/hook/setting/gate';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditGateMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [gate, setGateName] = useState('');
  const {data} = useUser();    
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  
  

  useEffect(() => {
    if (stockMaster) {
      setGateName(stockMaster.gate);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; gate: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editGate(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["gate_master"]}); 
      queryClient.invalidateQueries({queryKey: ["gate_master_pairing"]}); 
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
      gate: gate,
      id: stockMaster.id,
      modified_by: data?.display_name || '',
    };
    await editStockMaster(datas);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Boarding Gate Data</SheetTitle>
          <SheetDescription>
            Make changes to your boarding gate data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gate" className="text-right">
              Boarding Gate
            </Label>
            <Input id="gate" 
                   value={gate}
                   onChange={(e) => setGateName(e.target.value)} 
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

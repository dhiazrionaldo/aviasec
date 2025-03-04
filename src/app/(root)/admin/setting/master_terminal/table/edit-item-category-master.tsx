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
import { editTerminal } from '@/app/hook/setting/terminal';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditTerminalMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [terminal, setTerminal] = useState('');
  const {data} = useUser();    
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  
  

  useEffect(() => {
    if (stockMaster) {
      setTerminal(stockMaster.terminal);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; terminal: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editTerminal(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["terminal_master"]}); 
      queryClient.invalidateQueries({queryKey: ["terminal_master_pairing"]}); 
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
      terminal: terminal,
      id: stockMaster.id,
      modified_by: data?.display_name || '',
    };
    await editStockMaster(datas);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Terminal Data</SheetTitle>
          <SheetDescription>
            Make changes to your terminal data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="terminal" className="text-right">
              Terminal
            </Label>
            <Input id="terminal" 
                   value={terminal}
                   onChange={(e) => setTerminal(e.target.value)} 
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

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {CirclePlus, Loader2} from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import toast from 'react-hot-toast'
import createClient from '@/utils/supabase/client'
import useUser from '@/app/hook/useUser'
import { useQueryClient } from '@tanstack/react-query'
import { createTerminal } from '@/app/hook/setting/terminal'

export const maxDuration = 60;

export function CreateTerminal() {
    const [terminalName, setterminalName] = useState('');
    const [isLoading, setLoading] = React.useState(false);
    const supabase = createClient()
    const {isFetching, data} = useUser();      
    const queryClient = useQueryClient();

    async function createTerminalMaster(body: { terminal: string; created_by: string}) {
      setLoading(true);
      
      try {
        const vendors = await createTerminal(body); // Call editProfiles with the row data
        queryClient.invalidateQueries({queryKey: ["terminal_master"]}); 
        queryClient.invalidateQueries({queryKey: ["terminal_master_pairing"]}); 
        queryClient.invalidateQueries({queryKey: ["terminal_pairing_master"]}); 
  
        toast.success('Success')
        setLoading(false)
        
      } catch (error) {
        setLoading(false);
        console.error('Error editing:', error);
        toast.error(`Failed to edit item: ${error}`);
      }
    }
    

    const handleSave = async () => {
      
        const datas = {
        terminal: terminalName,
        created_by: data?.display_name || '', 
        terminalName: terminalName, 
        };

      await createTerminalMaster(datas)
    };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button  className="text-white"><CirclePlus className="mr-2 h-6 w-6" />Add new</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new Terminal Data</SheetTitle>
          <SheetDescription>
            Create your terminal settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="terminalName" className="text-right">
              Terminal
            </Label>
            <Input id="terminalName" 
                   value={terminalName}
                   onChange={(e) => setterminalName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
        </div>
        <SheetFooter>
          {/* <SheetClose asChild> */}
            <>
                {isLoading ? (
                    <Button disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>
                ):(
                    <Button className="text-white" type="submit" onClick={handleSave}>Save changes</Button>
                )}
            </>
          {/* </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

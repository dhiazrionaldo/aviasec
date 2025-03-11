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
import { editAirline } from '@/app/hook/setting/airline';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditAirlineMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [airline_name, setAirlineName] = useState('');
  const [airline_code_iata, setAirlineCodeIata] = useState('');
  const [airline_code_icao, setAirlineCodeIcao] = useState('');
  const [description, setDescription] = useState('');
  const {data} = useUser();    
  const queryClient = useQueryClient();
  // const [skuList, setSkuList] = useState<SKU[]>([]); 
  // const [price, setPrice] = useState('');
  // const [rawPrice, setRawPrice] = useState(''); //for reconverting the value before hit API
  // const [storage_minimum_stock, setStorageMinimumStock] = useState('');
  // const [lounge_minimum_stock, setLoungeMinimumStock] = useState('');
  const [isLoading, setLoading] = useState(false);
  
  
  // const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  //   setRawPrice(input); // Store the raw value

  //   // Convert the raw input to a number for Supabase
  //   const numericPrice = parseInt(input, 10) || 0; // Fallback to 0 if NaN
  
  //   const formattedPrice = new Intl.NumberFormat('id-ID', {
  //       style: 'currency',
  //       currency: 'IDR',
  //       minimumFractionDigits: 0,
  //   }).format(numericPrice); // Format as currency
  
  //   setPrice(formattedPrice);
  // };
  

  useEffect(() => {
    if (stockMaster) {
      setAirlineName(stockMaster.airline_name);
      setAirlineCodeIata(stockMaster.airline_code_iata);
      setAirlineCodeIcao(stockMaster.airline_code_icao);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; airline_name: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editAirline(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["airline_master"]}); 
      queryClient.invalidateQueries({queryKey: ["profile"]}); 
      queryClient.invalidateQueries({queryKey: ["departure_manual_flight_schedule"]}); 
      queryClient.invalidateQueries({queryKey: ["departure_manual_schedule"]}); 
      queryClient.invalidateQueries({queryKey: ["arrival_manual_flight_schedule"]}); 
      queryClient.invalidateQueries({queryKey: ["arrival_manual_schedule"]}); 
      

      if(updatedCategory){
        toast.success('Success')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      toast.error(`Failed to edit item: ${error}`);
    }
  }

  const handleSave = async () => {

    const datas = {
      airline_name: airline_name,
      airline_code_iata: airline_code_iata,
      airline_code_icao: airline_code_icao,
      id: stockMaster.id,
      // item_name: item_name,
      // unit_price: rawPrice,
      // storage_minimum_stock: storage_minimum_stock,
      // lounge_minimum_stock: lounge_minimum_stock,
      modified_by: data?.display_name || '',
    };
    await editStockMaster(datas);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Airline Data</SheetTitle>
          <SheetDescription>
            Make changes to your airline data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airline_name" className="text-right">
              Airline Name
            </Label>
            <Input id="airline_name" 
                   value={airline_name}
                   onChange={(e) => setAirlineName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airline_code_iata" className="text-right">
              Airline Code IATA
            </Label>
            <Input id="airline_code_iata" 
                   maxLength={2}
                   value={airline_code_iata}
                   onChange={(e) => setAirlineCodeIata(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airline_code_icao" className="text-right">
              Airline Code ICAO
            </Label>
            <Input id="airline_code_icao" 
                   maxLength={3}
                   value={airline_code_icao}
                   onChange={(e) => setAirlineCodeIcao(e.target.value)} 
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

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
import { editStation } from '@/app/hook/setting/station';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditStationMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [station_name, setStationName] = useState('');
  const [station_code, setStationCode] = useState('');
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
      setStationName(stockMaster.station_name);
      setStationCode(stockMaster.station_code);
      // setItemName(stockMaster.item_name);
      // setPrice(stockMaster.unit_price);

       // Store the raw price and set the formatted price for display
      // const initialRawPrice = parseInt(stockMaster.unit_price, 10).toString();
      // setRawPrice(initialRawPrice);
      
      // // Format the initial price for display
      // const formattedPrice = new Intl.NumberFormat('id-ID', {
      //   style: 'currency',
      //   currency: 'IDR',
      //   minimumFractionDigits: 0,
      // }).format(parseInt(stockMaster.unit_price, 10));
      
      // setPrice(formattedPrice);
      // setStorageMinimumStock(stockMaster.storage_minimum_stock);
      // setLoungeMinimumStock(stockMaster.lounge_minimum_stock);
    }
  }, [stockMaster]);
  
  async function editStockMaster(data: { id: number; station_name: string; station_code: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editStation(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["station_master"]}); 
      queryClient.invalidateQueries({queryKey: ["terminal_pairing_master"]}); 
      queryClient.invalidateQueries({queryKey: ["station"]}); 
      

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
      station_name: station_name,
      station_code: station_code,
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
          <SheetTitle>Edit Station Data</SheetTitle>
          <SheetDescription>
            Make changes to your station data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
        {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_id" className="text-right">
              Item Category
            </Label>
            {isLoading ? (
              <Loader2 className="col-span-3 h-6 w-6 animate-spin text-center mx-auto" />
            ):(
              <Select
                  value={id}
                  onValueChange={setCategoryId} 
              >
                  <SelectTrigger className="col-span-3" >
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      {skuList.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id}>
                              {sku.category_name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            )}
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="station_name" className="text-right">
              Station Name
            </Label>
            <Input id="station_name" 
                   value={station_name}
                   onChange={(e) => setStationName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="station_code" className="text-right">
              Station Code
            </Label>
            <Input id="station_code" 
                   value={station_code}
                   onChange={(e) => setStationCode(e.target.value)} 
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

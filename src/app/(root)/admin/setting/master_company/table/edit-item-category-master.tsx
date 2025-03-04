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
import { editCompany } from '@/app/hook/setting/company';
import { useQueryClient } from '@tanstack/react-query';

export const maxDuration = 60;

type Props = { 
  stockMaster: any; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
};



export function EditCompanyMaster({ stockMaster, isOpen, onOpenChange }: Props) {
  const [company_name, setCompanyName] = useState('');
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
      setCompanyName(stockMaster.company_name);
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
  
  async function editStockMaster(data: { id: number; company_name: string; modified_by: string;}) {
    setLoading(true);
    
    try {
      const updatedCategory = await editCompany(data); // Call editProfiles with the row data
      queryClient.invalidateQueries({queryKey: ["company_master"]}); 
      

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
      company_name: company_name,
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
          <SheetTitle>Edit Company Data</SheetTitle>
          <SheetDescription>
            Make changes to your company data settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company_name" className="text-right">
              Company Name
            </Label>
            <Input id="company_name" 
                   value={company_name}
                   onChange={(e) => setCompanyName(e.target.value)} 
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

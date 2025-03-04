import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import React from 'react'
import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { deleteRole } from "@/app/hook/setting/role";
import { useQueryClient } from "@tanstack/react-query";
  

export const maxDuration = 60;

type Props = {
    id: number;
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void;
};

export function DeleteRoleMaster({id, isOpen, onOpenChange}: Props){
    const [isLoading, setLoading] = React.useState(false); 
    const queryClient = useQueryClient();
    
     async function deleteSKU(){
        setLoading(true)
        try {
            const res = await deleteRole(id);
            queryClient.invalidateQueries({queryKey: ["role_master"]}); 
            setLoading(false)
            toast.success('Done');
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return(
        <>
        
            <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            {/* <AlertDialogTrigger>
            <Button className="text-white gap-5" variant="ghost"><Trash2 size={18} color="#cf0202"/>Delete</Button>
            </AlertDialogTrigger> */}
            {isLoading ? (
            <AlertDialogContent>
                <AlertDialogHeader className="item-center">
                    <AlertDialogTitle>Deleting...</AlertDialogTitle>
                    <Loader2 className="animate-spin" />
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteSKU} disabled>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            ) : (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your data
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button  onClick={deleteSKU} className="text-white bg-red-700">Continue</Button>
                {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
            )}
            </AlertDialog>
        </>
    )
}
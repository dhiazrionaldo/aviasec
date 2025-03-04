'use client'
import { login, signup } from '@/app/login/action'
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { ChevronRight, Loader2, UserRoundPlus } from "lucide-react";
import toast from 'react-hot-toast';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";  
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { registrationGetCompany, updateProfileData } from '../hook/useUser';
import { profile } from 'console';
import { redirect } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query';

//zod config
const formSchema = z.object({
    email: z.string().min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."
    ),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters. and use Upercase and Lowercase also symbols and number",
    }),
    // display_name: z.string().min(1, {
    //     message: "This field has to be filled.",
    // }),
    // employee_id: z.string().min(1, {
    //     message: "This field has to be filled.",
    // }),
  })
//end zod config

//zod profile
const formSchemaProfile = z.object({
    display_name: z.string().min(1,{
        message: "This field has to be filled"
    }),
    company_id: z.number().min(1,{
        message: "You must choose company"
    }),
    company_name: z.string().min(1,{
        message: "This field has to be filled"
    }),
})
//end zod profile

type FormValues = z.infer<typeof formSchema>;
type FormProfiles = z.infer<typeof formSchemaProfile>;

export default function SignUpPage() {
  const [loading,setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Track carousel position
  const {data: companyList} = registrationGetCompany();
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  
  // 1. Define your form.
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
        // display_name: "",
        // employee_id: ""
      }
    });
    
    const formProfile = useForm<FormProfiles>({
        resolver: zodResolver(formSchemaProfile),
        defaultValues: {
            display_name: "",
            company_id: 0,
            company_name: ""
        }
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const response = await signup(values);
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
            setCurrentIndex((prev) => prev + 1); // Move to next slide after login
        }
    }

    //get company list for registration
    async function updateProfile(valuesProfile: z.infer<typeof formSchemaProfile>) {
        setLoading2(true);
        try {
            const email = form.getValues().email;
             // Ensure email is included in valuesProfile
            const updatedProfile = {
                ...valuesProfile,
                email: email,  // Add the email field explicitly
            };
            const profiles = await updateProfileData(updatedProfile);
            queryClient.invalidateQueries({queryKey: ["user_profiles"]}); 
            queryClient.invalidateQueries({queryKey: ["user"]}); 

            if (!valuesProfile.company_id) {
                toast.error("Please select a company");
                return;
            }
        } catch (error) {
            toast.error("Error updating profile");
        } finally{
            toast.success("Check your email for user confirmation!");
            setLoading2(false)
            redirect('/')
        }
    }
    

    return (
    <div className='flex justify-center items-center'>
        <Carousel 
            className="w-full max-w-xs overflow-hidden"
            opts={{
                watchDrag: false
            }}
        >
            <CarouselContent className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {/* Step 1 */}
                <CarouselItem className="w-full flex-shrink-0">
                    <div className='flex items-center justify-center w-full h-screen'>
                        <div className='w-96 rounded-md border p-5 relative bg-slate-900'>
                            <div className='flex justify-center items-center gap-2'>
                                <h1 className='text-2xl font-bold uppercase '>AviaSec</h1>
                            </div>
                            <p className='text-sm flex justify-center'>Fill to register your account</p>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@email.com" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter your valid Email Address</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="password" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter your password</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className='flex w-full uppercase' disabled={loading}>
                                        {loading ? <Loader2 className='animate-spin' /> : "Next"} <ChevronRight />
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CarouselItem>

                {/* Step 2 */}
                <CarouselItem className="w-full flex-shrink-0">
                    <div className='flex items-center justify-center w-full h-screen'>
                        <div className='w-96 rounded-md border p-5 relative bg-slate-900'>
                            <div className='flex justify-center items-center gap-2'>
                                <h1 className='text-2xl font-bold uppercase '>AviaSec</h1>
                            </div>
                            <p className='text-sm flex justify-center'>Additional Registration Information</p>
                            {/* form start here */}
                            <Form {...formProfile}>
                            <form onSubmit={formProfile.handleSubmit((values) => {
                                        updateProfile(values);
                                    })} className="space-y-8">
                                    <FormField control={formProfile.control} name="display_name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Put your full name" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter your public full name</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField
                                        control={formProfile.control}
                                        name="company_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Company Name</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={
                                                            field.value
                                                                ? Array.isArray(companyList) &&
                                                                companyList?.find((company) => company.id === field.value)?.company_name || undefined
                                                                : undefined
                                                        }
                                                        onValueChange={(value) => {
                                                            if (Array.isArray(companyList)) {
                                                                const selectedCompany = companyList.find(
                                                                    (company) => company.company_name === value
                                                                );
                                                                if (selectedCompany) {
                                                                    field.onChange(selectedCompany.id);
                                                                    formProfile.setValue("company_name", selectedCompany.company_name);
                                                                    setSelectedCompanyId(selectedCompany.id);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choose your company" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.isArray(companyList) && companyList.map((company) => (
                                                                <SelectItem key={company.id} value={company.company_name ?? ""}>
                                                                    {company.company_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>Choose your company name</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="flex w-full uppercase" disabled={loading2}>
                                        {loading2 ? <Loader2 className="animate-spin" /> : "Register"} <UserRoundPlus size={15} />
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    </div>
    
    );
}
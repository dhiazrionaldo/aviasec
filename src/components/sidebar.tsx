'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  Building2Icon,
  CalendarArrowUpIcon,
  CalendarMinus,
  Dock,
  DollarSignIcon,
  DoorOpenIcon,
  Group,
  Handshake,
  LaptopMinimalCheckIcon,
  LineChartIcon,
  ListCheckIcon,
  ListOrderedIcon,
  Martini,
  MoreHorizontal,
  Package,
  PlaneIcon,
  Receipt,
  Settings,
  Settings2Icon,
  SquareParking,
  SquareParkingIcon,
  TimerReset,
  TowerControlIcon,
  User2,
  Warehouse,
  Wine,
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import Link from 'next/link';
import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';
import useUser from '@/app/hook/useUser';

// Admin sidebar configuration
const adminSidebarItems: SidebarItems = {
  

  links: [
    { label: 'Dashboard', href: '/admin/home', icon: LineChartIcon },
    { label: 'Flight Schedule', href: '/admin/flight_schedule', icon: PlaneIcon },
    { label: 'Manual Schedule Upload', href: '/admin/schedule_manual', icon: CalendarArrowUpIcon },
    { label: 'Manual UnSchedule Upload', href: '/admin/unschedule_manual', icon: CalendarMinus },
    // { label: 'Order Report', href: '/admin/order_report', icon: ListCheckIcon },
    // { label: 'Order', href: '/admin/proposal_order', icon: ListOrderedIcon },
    // {
    //   href: '/admin/history',
    //   icon: TimerReset,
    //   label: 'Transaction History',
    // },
  ],
  extras2: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='w-full justify-start'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-2'>
              <span><Settings2Icon /></span>
              <span>Terminal Master</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
        <div className='space-y-1'>
          <Link href='/admin/setting/master_terminal_pairingr'>
            <SidebarButton size='sm' icon={Package} className='w-full'>
                Merge Terminal Master
            </SidebarButton>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  ),
  extras: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='w-full justify-start'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-2'>
              <span><Settings /></span>
              <span>Master Settings</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
        <div className='space-y-1'>
        <Link href='/admin/setting/users'>
          <SidebarButton size='sm' icon={User2} className='w-full'>
              User Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_company'>
          <SidebarButton size='sm' icon={Building2Icon} className='w-full'>
            Company Settings
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_station'>
          <SidebarButton size='sm' icon={TowerControlIcon} className='w-full'>
              Station Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_terminal'>
          <SidebarButton size='sm' icon={PlaneIcon} className='w-full'>
              Terminal Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_role'>
          <SidebarButton size='sm' icon={LaptopMinimalCheckIcon} className='w-full'>
              Role Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_gate'>
          <SidebarButton size='sm' icon={DoorOpenIcon} className='w-full'>
              Gate Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_parking_stand'>
          <SidebarButton size='sm' icon={SquareParking} className='w-full'>
              Parking Stand Master
          </SidebarButton>
        </Link>
          {/* <Link href='/admin/setting/company'>
            <SidebarButton size='sm' icon={Building2Icon} className='w-full'>
              Company Settings
            </SidebarButton>
          </Link> */}
        </div>
      </PopoverContent>
    </Popover>
  )
};

// Admin sidebar configuration
const superAdminSidebarItems: SidebarItems = {
  links: [
    { label: 'Dashboard', href: '/admin/home', icon: LineChartIcon },
    { label: 'Flight Schedule', href: '/admin/flight_schedule', icon: PlaneIcon },
    { label: 'Manual Schedule Upload', href: '/admin/schedule_manual', icon: CalendarArrowUpIcon },
    { label: 'Manual UnSchedule Upload', href: '/admin/unschedule_manual', icon: CalendarMinus },
    // { label: 'Lounge Stocks', href: '/admin/lounge', icon: Martini },
    // { label: 'Order', href: '/admin/proposal_order', icon: ListOrderedIcon },
    // { label: 'Vendor Price', href: '/admin/vendor_price', icon: DollarSignIcon },
    // {
    //   href: '/admin/history',
    //   icon: TimerReset,
    //   label: 'Transaction History',
    // },
  ],
  extras2: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='w-full justify-start'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-2'>
              <span><Settings2Icon /></span>
              <span>Terminal Master</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
        <div className='space-y-1'>
          <Link href='/admin/setting/master_terminal_pairing'>
            <SidebarButton size='sm' icon={Package} className='w-full'>
                Merge Terminal Master
            </SidebarButton>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  ),
  extras: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='w-full justify-start'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-2'>
              <span><Settings /></span>
              <span>Master Settings</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
        <div className='space-y-1'>
        <Link href='/admin/setting/users'>
          <SidebarButton size='sm' icon={User2} className='w-full'>
              User Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_company'>
          <SidebarButton size='sm' icon={Building2Icon} className='w-full'>
            Company Settings
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_station'>
          <SidebarButton size='sm' icon={TowerControlIcon} className='w-full'>
              Station Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_terminal'>
          <SidebarButton size='sm' icon={PlaneIcon} className='w-full'>
              Terminal Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_role'>
          <SidebarButton size='sm' icon={LaptopMinimalCheckIcon} className='w-full'>
              Role Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_gate'>
          <SidebarButton size='sm' icon={DoorOpenIcon} className='w-full'>
              Gate Master
          </SidebarButton>
        </Link>
        <Link href='/admin/setting/master_parking_stand'>
          <SidebarButton size='sm' icon={SquareParking} className='w-full'>
              Parking Stand Master
          </SidebarButton>
        </Link>
          {/* <Link href='/admin/setting/company'>
            <SidebarButton size='sm' icon={Building2Icon} className='w-full'>
              Company Settings
            </SidebarButton>
          </Link> */}
        </div>
      </PopoverContent>
    </Popover>
  )
};

// Vendor sidebar configuration
const vendorSidebarItems: SidebarItems = {
  links: [
    { label: 'Dashboard', href: '/admin/home', icon: LineChartIcon },
    { label: 'Automatic Schedule', href: '/admin/schedule_auto', icon: PlaneIcon },
    { label: 'Manual Schedule Upload', href: '/admin/schedule_manual', icon: CalendarArrowUpIcon },
  ],
  // extras: (
  //   <Popover>
  //     <PopoverTrigger asChild>
  //       <Button variant='ghost' className='w-full justify-start'>
  //         <div className='flex justify-between items-center w-full'>
  //           <div className='flex gap-2'>
  //             <span><Settings /></span>
  //             <span>Settings</span>
  //           </div>
  //           <MoreHorizontal size={20} />
  //         </div>
  //       </Button>
  //     </PopoverTrigger>
  //     <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
  //       <div className='space-y-1'>
  //         <Link href='/vendor/setting/company'>
  //           <SidebarButton size='sm' icon={Settings} className='w-full'>
  //             Account Settings
  //           </SidebarButton>
  //         </Link>
  //       </div>
  //     </PopoverContent>
  //   </Popover>
  // )
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {isFetching, data} = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = data?.master_role!.role_name;
    setUserRole(role!);
  }, [data]);

  const handleNavigation = async (href: string) => {
    setLoading(true);
    await router.push(href);
    setLoading(false);
  };

  // Select sidebar items based on user role
  const sidebarItems = //userRole === 'admin' ? adminSidebarItems : vendorSidebarItems;
                        userRole === 'admin'
                        ? adminSidebarItems
                        : userRole === 'superadmin'
                        ? superAdminSidebarItems
                        : vendorSidebarItems;
  
  const sidebarItemsWithOnClick = {
    ...sidebarItems,
    links: sidebarItems.links.map((item) => ({
      ...item,
      onClick: () => handleNavigation(item.href),
    })),
  };

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItemsWithOnClick} loading={loading} />;
  }

  return <SidebarMobile sidebarItems={sidebarItemsWithOnClick} />;
}
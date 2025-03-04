'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { Overview } from './cost-overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warehouse } from 'lucide-react'
// import { SummaryOverview } from '@/app/hook/admin/home/dashboard'
import { OrderListOverview } from './order_list'

export default function AdminHome() {
  // const {data, error} = SummaryOverview();
  // const [storage_qty, setStorageQty] = useState(0);
  // const [waisted_qty, setWaistedQty] = useState(0);
  // const [storage_expense, setStorageExpense] = useState('');
  // const [waisted_expense, setWaistedExpense] = useState('');

  
  // useEffect(() => {
  //   if (data && Array.isArray(data)) {
  //     const storageData = data.find(item => item.type === 'storage');
  //     const waistedData = data.find(item => item.type === 'waisted');

  //     if (storageData) {
  //       setStorageQty(storageData.qty || 0);
  //       const formattedCurrency = new Intl.NumberFormat('id-ID', {
  //         style: 'currency',
  //         currency: 'IDR',
  //         minimumFractionDigits: 0,
  //     }).format(storageData.total_expense);

  //       setStorageExpense(formattedCurrency);
  //     }

  //     if (waistedData) {
  //       setWaistedQty(waistedData.qty || 0);
  //       const formattedCurrency = new Intl.NumberFormat('id-ID', {
  //         style: 'currency',
  //         currency: 'IDR',
  //         minimumFractionDigits: 0,
  //     }).format(waistedData.total_expense);
  //       setWaistedExpense(formattedCurrency);
  //     }
  //   }
  // }, [data]);

  return (
    <div className="mt-3">
      <div className="flex flex-col space-y-4 md:hidden">
        {/* Mobile View: Cards stacked vertically */}
        <h1 className="text-3xl font-semibold">Summary</h1>
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UOPO IKI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">COK1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">COK2</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delayed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">COK3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">COK4</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:flex flex-col space-y-4">
        {/* Desktop View: Multi-Column Grid */}
        <h1 className="text-3xl font-semibold">Summary</h1>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-5">
          <div className="col-span-5 space-y-4">
            {/* Summary Cards */}
            <div className="flex flex-col md:flex-row gap-5">
            <Card>
              <CardHeader>
                <CardTitle>UOPO IKI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">COK1</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">COK2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Delayed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">COK3</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cancel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">COK4</div>
              </CardContent>
            </Card>
            </div>
            {/* Chart Section */}
            {/* <Card className="w-full">
              <CardHeader>
                <CardTitle>Monthly Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<p>Loading...</p>}/>
                <Overview />
              </CardContent>
            </Card> */}
          </div>

          {/* Right Section: Test Card */}
          {/* <Suspense fallback={<p>Loading...</p>}/> */}
          {/* <OrderListOverview /> */}
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import React, { Suspense, useEffect, useState } from 'react'
// import { Overview } from './cost-overview'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Loader2 } from 'lucide-react'
// import { Warehouse } from 'lucide-react'
// import { SummaryOverview } from '@/app/hook/admin/home/dashboard'
// import { OrderListOverview } from './order_list'

// export default function AdminHome() {
//   const {data, error} = SummaryOverview();
//   const [storage_qty, setStorageQty] = useState(0);
//   const [waisted_qty, setWaistedQty] = useState(0);
//   const [storage_expense, setStorageExpense] = useState('');
//   const [waisted_expense, setWaistedExpense] = useState('');

  
//   useEffect(() => {
//     if (data && Array.isArray(data)) {
//       const storageData = data.find(item => item.type === 'storage');
//       const waistedData = data.find(item => item.type === 'waisted');

//       if (storageData) {
//         setStorageQty(storageData.qty || 0);
//         const formattedCurrency = new Intl.NumberFormat('id-ID', {
//           style: 'currency',
//           currency: 'IDR',
//           minimumFractionDigits: 0,
//       }).format(storageData.total_expense);

//         setStorageExpense(formattedCurrency);
//       }

//       if (waistedData) {
//         setWaistedQty(waistedData.qty || 0);
//         const formattedCurrency = new Intl.NumberFormat('id-ID', {
//           style: 'currency',
//           currency: 'IDR',
//           minimumFractionDigits: 0,
//       }).format(waistedData.total_expense);
//         setWaistedExpense(formattedCurrency);
//       }
//     }
//   }, [data]);

//   return (
//     <div className="mt-3 justify-between">
//       <div className="hidden md:flex flex-col space-y-4">
//         <h1 className="text-3xl font-semibold">Summary</h1>
//         {/* Parent Grid for Summary, Chart, and Test Card */}
//         <div className="grid grid-cols-7 gap-5">
//           {/* Left Section: Summary Cards and Chart */}
//           <div className="col-span-5 space-y-4">
//             {/* Summary and Chart Wrapper */}
//             <div className="space-y-4">
//               {/* Summary Cards */}
//               <div className="flex flex-row gap-5">
//                 <Card className="flex-1 min-w-[170px]">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//                     <CardTitle className="font-medium">Storage Expense</CardTitle>
//                     <Warehouse className="w-10 h-10" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">{storage_expense}</div>
//                   </CardContent>
//                 </Card>
//                 <Card className="flex-1 min-w-[170px]">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//                     <CardTitle className="font-medium">Surplus Expense</CardTitle>
//                     <Warehouse className="w-10 h-10" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-red-700">{waisted_expense}</div>
//                   </CardContent>
//                 </Card>
//                 <Card className="flex-1 min-w-[170px]">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//                     <CardTitle className="font-medium">Storage Qty</CardTitle>
//                     <Warehouse className="w-10 h-10" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">{storage_qty}</div>
//                   </CardContent>
//                 </Card>
//                 <Card className="flex-1 min-w-[170px]">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//                     <CardTitle className="font-medium">Surplus Qty</CardTitle>
//                     <Warehouse className="w-10 h-10" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-red-700">{waisted_qty}</div>
//                   </CardContent>
//                 </Card>
//               </div>
//               {/* Chart Section */}
//               <Card className="w-full">
//                 <CardHeader>
//                   <CardTitle>Monthly Revenue Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Suspense fallback={<p>Loading...</p>}/>
//                   <Overview />
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           {/* Right Section: Test Card */}
//           <Suspense fallback={<p>Loading...</p>}/>
//           <OrderListOverview />
//         </div>
//       </div>
//     </div>

//     // <div className="mt-3 justify-between">
//     //   <div className="hidden flex-col md:flex space-y-4">
//     //     <h1 className="text-3xl font-semibold">Summary</h1>
//     //     <div className='flex flex-row gap-5'>
//     //     <Card className='min-w-[170px] '>
//     //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//     //           <CardTitle className="font-medium">
//     //           Storage Expense
//     //           </CardTitle>
//     //           <Warehouse className="w-10 h-10"/>
//     //       </CardHeader>
//     //       <CardContent>
//     //           {/* <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin"/> :expenseStorage}</div> */}
//     //           <div className="text-2xl font-bold">{storage_expense}</div>
//     //       </CardContent>
//     //       </Card>
//     //       <Card className='min-w-[170px]'>
//     //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//     //           <CardTitle className="font-medium">
//     //           Waisted Expense
//     //           </CardTitle>
//     //           <Warehouse className="w-10 h-10"/>
//     //       </CardHeader>
//     //       <CardContent>
//     //           {/* <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin"/> :waistedExpenseStorage}</div> */}
//     //           <div className="text-2xl font-bold">{waisted_expense}</div>
//     //       </CardContent>
//     //       </Card>
//     //       <Card className='min-w-[170px]'>
//     //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//     //           <CardTitle className="font-medium">
//     //           Storage Qty
//     //           </CardTitle>
//     //           <Warehouse className="w-10 h-10"/>
//     //       </CardHeader>
//     //       <CardContent>
//     //           {/* <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin"/> :expenseStorage}</div> */}
//     //           <div className="text-2xl font-bold">{storage_qty}</div>
//     //       </CardContent>
//     //       </Card>
//     //       <Card className='min-w-[170px]'>
//     //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5">
//     //           <CardTitle className="font-medium">
//     //           Waisted Qty
//     //           </CardTitle>
//     //           <Warehouse className="w-10 h-10"/>
//     //       </CardHeader>
//     //       <CardContent>
//     //           {/* <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin"/> :waistedExpenseStorage}</div> */}
//     //           <div className="text-2xl font-bold">{waisted_qty}</div>
//     //       </CardContent>
//     //       </Card>
//     //     </div>
//     //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//     //       <Card className='col-span-5 space-y-5'>
//     //         <CardHeader>
//     //           <CardTitle>Monthly Revenue Overview</CardTitle>
//     //         </CardHeader>
//     //         <CardContent>
//     //             <Overview />
//     //         </CardContent>
//     //       </Card>
//     //     </div>
//     //     <div className='flex flex-col grid grid-cols-8'>
//     //       <Card>
//     //         <CardHeader>
//     //           <CardTitle>TEST</CardTitle>
//     //         </CardHeader>
//     //       </Card>
//     //     </div>
//     //   </div>
//     // </div>
//   )
// }

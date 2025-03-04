import { OrderData } from '@/app/hook/admin/order/admin_proposals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Import Badge from ShadCN
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CircleDot } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';

// Assuming `orders` is fetched from your custom hook or API
export function OrderListOverview() {
  const { isFetching, data: orders, error } = OrderData();  // Assuming this is fetching data
  const [itemData, setItemData] = useState<any[]>([]); // Update with actual item data structure

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      // Map orders to a structured format for easy rendering
      
      const mappedOrders = orders.map((order) => ({
        item_name: order.item_name,
        item_category: order.item_category_master.category_name,
        order_qty: order.order_qty,
        delivery_status: order.isDelivered ? 'Delivered' : 'Pending',
        icon: '/path/to/item-icon.png', // Replace with an appropriate icon or use a default
      }));
      setItemData(mappedOrders);
    }
  }, [orders]);

  return (
    <Card className="col-span-2 h-[427px]">
      <CardHeader>
        <CardTitle className='text-xl'>Order Status</CardTitle>
        
        <Separator />
      </CardHeader>
      <CardContent className='overflow-y-auto max-h-[327px]'>
        <div className="space-y-4">
          {itemData.map((item, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-4">
              <div className="flex items-center space-x-3">
                <CircleDot className='w-5 h-5' />
                {/* <Image
                  src={item.icon} // Use item icon or default icon
                  alt={item.item_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                /> */}
                <div className='space-y-2'>
                  <p className="font-semibold">{item.item_name}</p>
                  <p className="text-md text-gray-500">{item.item_category}</p>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <p className="text-sm text-gray-500">Order Qty</p>
                <p className="text-xl font-semibold text-gray-300">{item.order_qty}</p>
              </div>
              
              {/* ShadCN Badge - conditionally styled */}
              <Badge
                className={`text-xs font-medium py-1 px-3 rounded-full ${
                  item.delivery_status === 'Pending' ? 'bg-red-900 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {item.delivery_status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

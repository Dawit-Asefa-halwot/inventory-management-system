import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import { ShoppingCart, Package, Receipt, User } from 'lucide-react';

const RecentActivityCard = () => {
     const [activities, setActivities] = useState([]);

     useEffect(() => {
          fetchActivities();
     }, []);

     const fetchActivities = () => {
          // Static dummy data for demo purposes
          const demoActivities = [
               {
                    id: 1,
                    type: 'success',
                    message: 'Order #1234 completed successfully.',
                    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
               },
               {
                    id: 2,
                    type: 'warning',
                    message: 'Low stock alert for "USB-C Cable".',
                    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
               },
               {
                    id: 3,
                    type: 'error',
                    message: 'Failed payment for Order #1235.',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
               },
               {
                    id: 4,
                    type: 'info',
                    message: 'New user registered: john.doe@example.com.',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
               },
          ];

          setActivities(demoActivities);
     };

     const getActivityIcon = (type) => {
          switch (type) {
               case 'success':
                    return <Receipt className="text-green-600" size={20} />;
               case 'warning':
                    return <Package className="text-amber-600" size={20} />;
               case 'error':
                    return <ShoppingCart className="text-red-600" size={20} />;
               default:
                    return <User className="text-blue-600" size={20} />;
          }
     };

     const formatTime = (timestamp) => {
          return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
     };

     return (
          <Card className="h-full">
               <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
               </CardHeader>

               <CardContent className="max-h-[400px] overflow-y-auto">
                    <div className="divide-y divide-gray-200">
                         {activities.length > 0 ? (
                              activities.map((activity) => (
                                   <div key={activity.id} className="flex items-start gap-4 py-3">
                                        <div className="p-2 rounded-full bg-gray-50">
                                             {getActivityIcon(activity.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                             <p className="text-sm text-gray-900">{activity.message}</p>
                                             <p className="text-xs text-gray-500 mt-0.5">
                                                  {formatTime(activity.created_at)}
                                             </p>
                                        </div>
                                   </div>
                              ))
                         ) : (
                              <p className="text-gray-500 text-sm py-4">No recent activities</p>
                         )}
                    </div>
               </CardContent>
          </Card>
     );
};

export default RecentActivityCard;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Button from '../../../components/ui/button';
import { TrendingUp, Package, ShoppingCart } from 'lucide-react';

const icons = {
     TrendingUp,
     Package,
     ShoppingCart
};

const ReportCategoryCard = ({ report, loading, onGenerate }) => {
     const IconComponent = icons[report.icon];
     const colorClasses = {
          indigo: 'text-indigo-600 bg-indigo-50',
          blue: 'text-blue-600 bg-blue-50',
          orange: 'text-orange-600 bg-orange-50'
     };

     return (
          <Card className="hover:shadow-lg transition-shadow duration-200">
               <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-2 rounded-lg ${colorClasses[report.color]}`}>
                         <IconComponent size={24} />
                    </div>
                    <div>
                         <CardTitle className="text-lg">{report.title}</CardTitle>
                         <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
               </CardHeader>

               <CardContent>
                    <div className="space-y-2">
                         {report.options.map((option) => (
                              <Button
                                   key={option.id}
                                   variant="outline"
                                   size="sm"
                                   className="w-full justify-start"
                                   onClick={() => onGenerate(option.id)}
                                   isLoading={loading === option.id}
                              >
                                   {option.name}
                              </Button>
                         ))}
                    </div>
               </CardContent>
          </Card>
     );
};

export default ReportCategoryCard;
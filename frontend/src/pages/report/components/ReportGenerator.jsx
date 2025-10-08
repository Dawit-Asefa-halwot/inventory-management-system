import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const reportConfigs = {
     'daily-sales': {
          endpoint: 'http://localhost:5000/api/reports/daily-sales',
          columns: ['Date', 'Order ID', 'Customer', 'Amount', 'Status'],
          title: 'Daily Sales Report'
     },
     'inventory': {
          endpoint: 'http://localhost:5000/api/reports/inventory',
          columns: ['Product Name', 'Category', 'Quantity', 'Price', 'Status'],
          title: 'Inventory Status Report'
     },
     'purchase-orders': {
          endpoint: 'http://localhost:5000/api/reports/purchases',
          columns: ['Date', 'Order ID', 'Supplier', 'Amount', 'Status'],
          title: 'Purchase Orders Report'
     },
     'monthly-revenue': {
          endpoint: 'http://localhost:5000/api/reports/monthly-revenue',
          columns: ['Month', 'Total Revenue'],
          title: 'Monthly Revenue Report'
     },
     'top-products': {
          endpoint: 'http://localhost:5000/api/reports/top-products',
          columns: ['Product Name', 'Units Sold'],
          title: 'Top Selling Products Report'
     },
     'low-stock': {
          endpoint: 'http://localhost:5000/api/reports/low-stock',
          columns: ['Product Name', 'Category', 'Quantity', 'Status'],
          title: 'Low Stock Items Report'
     },
     'inventory-value': {
          endpoint: 'http://localhost:5000/api/reports/inventory-value',
          columns: ['Product Name', 'Category', 'Quantity', 'Price', 'Total Value'],
          title: 'Inventory Valuation Report'
     },
     'supplier-analysis': {
          endpoint: 'http://localhost:5000/api/reports/supplier-analysis',
          columns: ['Supplier', 'Total Orders', 'Total Spent'],
          title: 'Supplier Analysis Report'
     },
     'cost-analysis': {
          endpoint: 'http://localhost:5000/api/reports/cost-analysis',
          columns: ['Product Name', 'Total Purchased', 'Total Cost'],
          title: 'Cost Analysis Report'
     }
};

const ReportGenerator = {
     generateReport: async (reportType, setCurrentReport, setLoading) => {
          setLoading(reportType);
          try {
               const config = reportConfigs[reportType];
               if (!config) throw new Error('Invalid report type');

               const { endpoint, columns, title } = config;

               const response = await fetch(endpoint);
               const contentType = response.headers.get("content-type");

               if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
               }

               if (!contentType || !contentType.includes("application/json")) {
                    const errorText = await response.text();
                    throw new Error("Received non-JSON response");
               }

               const data = await response.json();
               setCurrentReport({ title, data, columns });
          } catch (error) {
               console.error('Error generating report:', error.message);
               alert(`Failed to generate report: ${error.message}`);
          } finally {
               setLoading(null);
          }
     },

     downloadPDF: (currentReport) => {
          if (!currentReport) return;

          const doc = new jsPDF();
          const title = currentReport.title;
          const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

          doc.setFontSize(18);
          doc.text(title, 14, 20);
          doc.setFontSize(12);
          doc.text(`Generated on: ${date}`, 14, 30);

          const tableData = currentReport.data.map(item => {
               return currentReport.columns.map(column => {
                    switch (column) {
                         case 'Date':
                              return format(new Date(item.created_at), 'yyyy-MM-dd');
                         case 'Amount':
                         case 'Price':
                         case 'Total Revenue':
                         case 'Total Value':
                         case 'Total Spent':
                         case 'Total Cost':
                              return `$${Number(item[column.toLowerCase().replace(' ', '_')]).toFixed(2)}`;
                         case 'Customer':
                              return item.customer?.name || item.customer_name || 'Unknown';
                         case 'Supplier':
                              return item.supplier_name || 'Unknown';
                         case 'Category':
                              return item.category_name || 'Uncategorized';
                         case 'Product Name':
                              return item.name || item.product_name;
                         case 'Status':
                              return item.status;
                         default:
                              return item[column.toLowerCase().replace(' ', '_')] || '';
                    }
               });
          });

          autoTable(doc, {
               head: [currentReport.columns],
               body: tableData,
               startY: 40,
          });

          doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${date}.pdf`);
     }
};

export default ReportGenerator;
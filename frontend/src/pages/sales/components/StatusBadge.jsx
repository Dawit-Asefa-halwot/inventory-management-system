import React from 'react';
import Badge from '../../../components/ui/badge';
import { Check, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
     switch (status) {
          case 'completed':
               return <Badge variant="success" className="flex items-center gap-1"><Check size={12} /> {status}</Badge>;
          case 'pending':
               return <Badge variant="warning" className="flex items-center gap-1"><Clock size={12} /> {status}</Badge>;
          case 'cancelled':
               return <Badge variant="danger">{status}</Badge>;
          default:
               return <Badge>{status}</Badge>;
     }
};

export default StatusBadge;
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  MoreVertical,
  MapPin,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/Modal';

export default function AdminOrderClient({ initialOrders }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local state with server props when router.refresh() finishes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    // Default to 'pending' if status is undefined/null (for old data)
    const currentStatus = order.status || 'pending';
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote })
      });

      if (response.ok) {
        const updatedOrder = await response.json();

        // Update local state instantly
        setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));

        toast.success(`Order status updated to ${newStatus}`);
        setSelectedOrder(null);
        setAdminNote('');

        // Refresh server data
        router.refresh();
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    // Handle undefined status
    const safeStatus = status || 'pending';

    switch (safeStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          <Input
            placeholder="Search orders, users, or products..."
            className="pl-10 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {['all', 'pending', 'approved', 'shipped', 'completed', 'rejected'].map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`capitalize whitespace-nowrap rounded-lg border-gray-200 ${statusFilter === status
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 border-transparent'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {filteredOrders.map(order => (
          <Card key={order._id} className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 group">
            <div className="p-6 flex flex-col md:flex-row gap-6">

              {/* Product Image */}
              <div className="w-full md:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                <Image
                  src={order.productId?.image || '/icons/default_product.png'}
                  alt="Product"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-900">{order.productName}</h3>
                      <Badge className={`capitalize ${getStatusColor(order.status)}`} variant="outline">
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 w-fit px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Ordered on {formatDate(order.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-green-600">{Math.abs(order.points).toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Points Redeemed</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm">
                        <Image src={order.userId?.avatar || '/icons/default_avatar.png'} width={40} height={40} alt="User" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{order.userId?.name}</p>
                        <p className="text-xs text-gray-500">{order.userId?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
                    {order.shippingAddress ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4" /> No address provided
                      </span>
                    )}
                  </div>
                </div>

                {order.adminNote && (
                  <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p><strong>Admin Note:</strong> {order.adminNote}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                <Button
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10"
                  onClick={() => {
                    setSelectedOrder(order);
                    setAdminNote(order.adminNote || '');
                  }}
                >
                  Manage Order
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">There are no orders matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Order Management Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Manage Order #${selectedOrder?._id.slice(-6)}`}
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'pending', label: 'Pending', color: 'bg-yellow-500 hover:bg-yellow-600' },
                { id: 'approved', label: 'Approve', color: 'bg-blue-600 hover:bg-blue-700' },
                { id: 'shipped', label: 'Ship', color: 'bg-purple-600 hover:bg-purple-700' },
                { id: 'completed', label: 'Complete', color: 'bg-green-600 hover:bg-green-700' },
                { id: 'rejected', label: 'Reject', color: 'bg-red-600 hover:bg-red-700' },
              ].map((status) => (
                <Button
                  key={status.id}
                  size="sm"
                  variant={selectedOrder?.status === status.id ? 'default' : 'outline'}
                  onClick={() => handleUpdateStatus(status.id)}
                  disabled={isUpdating}
                  className={`rounded-lg ${selectedOrder?.status === status.id ? `${status.color} text-white border-transparent` : 'border-gray-200 text-gray-600'}`}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Admin Note / Resi</h3>
            <Input
              placeholder="Add note for user (e.g., Tracking Number)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> This note will be visible to the user.
            </p>
          </div>

          {isUpdating && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium animate-pulse">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Updating order status...
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
'use client';

import { useState, useEffect, useMemo } from 'react';
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
  ShoppingBag,
  Copy,
  Check
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
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Generate tracking number (only displayed when status = shipped)
  const generatedTracking = useMemo(() => {
    if (!selectedOrder?.productId) return 'N/A';
    const idString = String(selectedOrder.productId._id || selectedOrder.productId);
    const idPart = idString.slice(-8).toUpperCase();
    const orderTimestamp = new Date(selectedOrder.timestamp || selectedOrder.createdAt).getTime().toString().slice(-6);
    return `RV-${idPart}-${orderTimestamp}`;
  }, [selectedOrder?._id, selectedOrder?.productId, selectedOrder?.timestamp, selectedOrder?.createdAt]);

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

        // Update local state
        setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));

        // Update show number
        setSelectedOrder(updatedOrder);

        toast.success(`Order status updated to ${newStatus}`);
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
          {[
            { id: 'all', label: 'All', icon: Package, activeBg: 'bg-gradient-to-r from-green-500 to-green-600', activeShadow: 'shadow-green-500/25', iconColor: 'text-green-500' },
            { id: 'pending', label: 'Pending', icon: Clock, activeBg: 'bg-gradient-to-r from-yellow-500 to-amber-500', activeShadow: 'shadow-yellow-500/25', iconColor: 'text-yellow-500' },
            { id: 'approved', label: 'Approved', icon: CheckCircle, activeBg: 'bg-gradient-to-r from-blue-500 to-blue-600', activeShadow: 'shadow-blue-500/25', iconColor: 'text-blue-500' },
            { id: 'shipped', label: 'Shipped', icon: Truck, activeBg: 'bg-gradient-to-r from-purple-500 to-purple-600', activeShadow: 'shadow-purple-500/25', iconColor: 'text-purple-500' },
            { id: 'completed', label: 'Completed', icon: CheckCircle, activeBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600', activeShadow: 'shadow-emerald-500/25', iconColor: 'text-emerald-500' },
            { id: 'rejected', label: 'Rejected', icon: XCircle, activeBg: 'bg-gradient-to-r from-red-500 to-red-600', activeShadow: 'shadow-red-500/25', iconColor: 'text-red-500' },
          ].map(status => {
            const Icon = status.icon;
            const isActive = statusFilter === status.id;

            return (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200
                  ${isActive
                    ? `${status.activeBg} text-white shadow-lg ${status.activeShadow}`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : status.iconColor}`} />
                {status.label}
              </button>
            );
          })}
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

                  {order.trackingNumber && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Nomor Tracking</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono font-bold text-purple-700 text-sm">{order.trackingNumber}</p>
                        <Truck className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                  )}
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
                  className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-green-600 hover:border-green-200 rounded-xl shadow-sm transition-all group/btn"
                  onClick={() => {
                    setSelectedOrder(order);
                    setAdminNote(order.adminNote || '');
                  }}
                >
                  <MoreVertical className="w-4 h-4 mr-2 text-gray-400 group-hover/btn:text-green-500 transition-colors" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', desc: 'Awaiting process' },
                { id: 'approved', label: 'Approve', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Ready to pack' },
                { id: 'shipped', label: 'Ship Order', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'On the way' },
                { id: 'completed', label: 'Complete', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', desc: 'Delivered' },
                { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', desc: 'Cancel order' },
              ].map((status) => {
                const Icon = status.icon;
                const isActive = selectedOrder?.status === status.id;

                return (
                  <button
                    key={status.id}
                    onClick={() => handleUpdateStatus(status.id)}
                    disabled={isUpdating}
                    className={`
                      relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                      ${isActive
                        ? `${status.bg} ${status.border} ring-2 ring-offset-1 ring-${status.color.split('-')[1]}-400`
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-full mb-2 ${isActive ? 'bg-white/50' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {status.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-1">
                      {status.desc}
                    </span>

                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <span className={`flex h-2 w-2 rounded-full ${status.color.replace('text', 'bg')}`}></span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Resi</h3>
            {selectedOrder?.status === 'shipped' && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2">
                <p className="text-xs text-gray-600 mb-1 font-semibold">kode resi </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-gray-900">
                    {selectedOrder.trackingNumber || generatedTracking}
                  </p>
                  <button
                    onClick={async () => {
                      const trackNum = selectedOrder.trackingNumber || generatedTracking;
                      await navigator.clipboard.writeText(trackNum);
                      setCopiedTracking(true);
                      toast.success('Nomor resi disalin!');
                      setTimeout(() => setCopiedTracking(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-200 group"
                  >
                    {copiedTracking ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-gray-700" />
                        <span className="text-xs font-bold text-gray-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-700 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-gray-700">Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            <Input
              placeholder="Admin note (opsional)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Catatan admin untuk order ini (tidak wajib).
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
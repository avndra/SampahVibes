'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  Bell,
  User,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
  Activity,
  Zap,
  MoreHorizontal,
  Truck,
  Factory
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Lazy load heavy chart component (Recharts is big!)
const EChart = dynamic(() => import('@/components/admin/EChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl animate-pulse">
      <div className="text-gray-400 text-sm">Loading chart...</div>
    </div>
  )
});

export default function ModernAdminDashboard({
  totalUsers,
  totalProducts,
  totalActivities,
  analyticsData,
  recentActivities: initialRecentActivities = [],
  lowStockProducts = []
}) {
  const [isExporting, setIsExporting] = useState(false);

  const processedRecentActivities = useMemo(() => {
    return initialRecentActivities.map((activity, index) => ({
      id: index + 1,
      user: activity.userName || activity.userId?.name || 'Unknown User',
      action: activity.type === 'earn' ? `Earned ${activity.points} points` : `Redeemed ${activity.points} points`,
      time: activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now',
      status: 'completed'
    }));
  }, [initialRecentActivities]);

  const topProducts = useMemo(() => {
    return lowStockProducts.map((product, index) => {
      let status = 'in-stock';
      if (product.stock === 0) {
        status = 'out-of-stock';
      } else if (product.stock < 10) {
        status = 'low-stock';
      }

      return {
        id: index + 1,
        name: product.name,
        stock: product.stock,
        status
      };
    });
  }, [lowStockProducts]);



  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Lazy load PDF libraries only when needed
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ]);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // -- Header --
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Green-600
      doc.text('RecycleVibes', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text('Laporan Ringkasan Admin', pageWidth / 2, 30, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 38, { align: 'center' });

      // -- Summary Stats Section --
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Ringkasan Statistik', 14, 50);

      const statsData = [
        ['Total Poin', analyticsData.totalPoints?.toLocaleString() || '0'],
        ['Total User', totalUsers.toLocaleString()],
        ['Sampah Terolah', `${analyticsData.totalWeight?.toFixed(2) || '0.00'} kg`],
        ['Total Transaksi Scan', analyticsData.totalDeposits?.toLocaleString() || '0']
      ];

      autoTable(doc, {
        startY: 55,
        head: [['Metrik', 'Nilai']],
        body: statsData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 80 } }
      });

      // -- Recent Activity Table --
      doc.text('Aktivitas Terbaru', 14, doc.lastAutoTable.finalY + 15);

      const activityRows = processedRecentActivities.map(act => [
        act.id,
        act.user,
        act.action,
        act.time
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['#', 'User', 'Aktivitas', 'Waktu']],
        body: activityRows,
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        styles: { fontSize: 9 },
      });

      // -- Footer --
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
        doc.text('Dokumen Rahasia - Hanya untuk keperluan internal.', 14, doc.internal.pageSize.height - 10);
      }

      doc.save(`admin-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('Laporan berhasil diunduh!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Gagal membuat laporan PDF');
    } finally {
      setIsExporting(false);
    }
  };


  // ... (useEffect for search remains)

  const stats = [
    {
      title: 'Total Points',
      value: analyticsData.totalPoints?.toLocaleString() || '0',
      change: '+12%',
      icon: DollarSign,
      color: 'text-green-700',
      iconBg: 'bg-white/80',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'
    },
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '+5%',
      icon: Users,
      color: 'text-emerald-700',
      iconBg: 'bg-white/80',
      gradient: 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200'
    },
    {
      title: 'Recycled (kg)',
      value: analyticsData.totalWeight?.toFixed(2) || '0.00',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-teal-700',
      iconBg: 'bg-white/80',
      gradient: 'bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200'
    },
    {
      title: 'Total Scans',
      value: analyticsData.totalDeposits?.toLocaleString() || '0',
      change: '+8%',
      icon: Package,
      color: 'text-lime-700',
      iconBg: 'bg-white/80',
      gradient: 'bg-gradient-to-br from-lime-50 to-green-100 border-lime-200'
    },
  ];

  return (
    <div className="space-y-8 font-sans text-gray-900">

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Overview of your platform's performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-sm hidden md:flex"
          >
            {isExporting ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-gray-100 text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`group relative overflow-hidden rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${stat.gradient}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-700"></div>

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} shadow-sm flex items-center justify-center ring-1 ring-black/5`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/60 backdrop-blur-sm ${stat.color} flex items-center border border-white/50 shadow-sm`}>
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-gray-600 text-sm font-bold mb-1 opacity-90">{stat.title}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Activity Overview</CardTitle>
                <CardDescription className="text-gray-500">Points generation over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <EChart
                type="area"
                data={[
                  { month: 'Jan', points: Math.round(analyticsData.totalPoints * 0.2) },
                  { month: 'Feb', points: Math.round(analyticsData.totalPoints * 0.35) },
                  { month: 'Mar', points: Math.round(analyticsData.totalPoints * 0.45) },
                  { month: 'Apr', points: Math.round(analyticsData.totalPoints * 0.6) },
                  { month: 'May', points: Math.round(analyticsData.totalPoints * 0.8) },
                  { month: 'Jun', points: analyticsData.totalPoints },
                ]}
                dataKey="points"
                color="#10b981"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <Card className="lg:col-span-1 bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-1 px-2">
              {processedRecentActivities.slice(0, 6).map((activity, i) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                    <Zap className="w-5 h-5 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{activity.time.split(',')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="lg:col-span-2 bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Inventory Status</CardTitle>
              <CardDescription className="text-gray-500">Products requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
              <Filter className="w-3 h-3 mr-2" /> Filter Items
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 rounded-lg">
                  <tr>
                    <th className="px-6 py-4 font-semibold rounded-l-lg">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Stock Level</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold rounded-r-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.stock} units</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`
                                      border-0 px-3 py-1 rounded-full font-bold
                                      ${product.status === 'out-of-stock' ? 'bg-red-100 text-red-700' : ''}
                                      ${product.status === 'low-stock' ? 'bg-orange-100 text-orange-700' : ''}
                                      ${product.status === 'in-stock' ? 'bg-green-100 text-green-700' : ''}
                                   `}
                        >
                          {product.status.replace(/-/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- FACTORY SALES SIMULATION SECTION --- */}
      <FactoryDistributionSection totalWeight={analyticsData.totalWeight || 0} />

    </div>
  );
}

function FactoryDistributionSection({ totalWeight }) {
  const [isShipping, setIsShipping] = useState(false);
  const [shipments, setShipments] = useState([
    { id: 1, partner: 'PT Daur Ulang Jaya', date: '21/01/2026', weight: '500 kg', amount: 'Rp 2.500.000', status: 'Completed' },
    { id: 2, partner: 'CV Plastik Sentosa', date: '18/01/2026', weight: '320 kg', amount: 'Rp 1.600.000', status: 'Completed' },
  ]);

  const handleShipment = () => {
    setIsShipping(true);
    setTimeout(() => {
      const newShipment = {
        id: shipments.length + 1,
        partner: 'Mitra Eco Factory',
        date: new Date().toLocaleDateString('en-GB'),
        weight: '200 kg',
        amount: 'Rp 1.000.000',
        status: 'Processing'
      };
      setShipments([newShipment, ...shipments]);
      setIsShipping(false);
      toast.success('Pengiriman ke pabrik berhasil dijadwalkan!');
    }, 2000);
  };

  return (
    <div className="pt-6 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Truck className="w-6 h-6 text-green-600" />
        Logistik & Penjualan (Factory Sales)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. Inventory Summary */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Inventory Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-4xl font-black text-gray-900">{totalWeight.toFixed(1)}</h3>
              <span className="text-sm font-bold text-gray-500">kg</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Plastik (PET)</span>
                <span className="font-bold">{(totalWeight * 0.6).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Logam (Can)</span>
                <span className="font-bold">{(totalWeight * 0.3).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500"></span>Kaca/Lainnya</span>
                <span className="font-bold">{(totalWeight * 0.1).toFixed(1)} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Action Card */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-700 text-white border-none shadow-lg rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Kirim ke Mitra
            </CardTitle>
            <CardDescription className="text-green-100">
              Kirim stok sampah terpilah ke pabrik daur ulang rekanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-100 text-sm">Estimasi Pendapatan</span>
              </div>
              <div className="text-2xl font-black">Rp 1.000.000</div>
              <div className="text-xs text-green-200 mt-1">*Harga pasar Rp 5.000/kg</div>
            </div>
            <Button
              onClick={handleShipment}
              disabled={isShipping}
              className="w-full bg-white text-green-700 hover:bg-green-50 font-bold shadow-sm"
            >
              {isShipping ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Jadwalkan Pengiriman
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 3. Shipment Log */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Log Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-y-auto max-h-[220px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Mitra</th>
                    <th className="px-4 py-2">Berat</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.map((ship) => (
                    <tr key={ship.id}>
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{ship.partner}</div>
                        <div className="text-xs text-gray-500">{ship.date}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ship.weight}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-bold text-green-600">{ship.amount}</div>
                        <Badge variant="outline" className="text-[10px] py-0 h-4 border-green-200 text-green-600 bg-green-50">
                          {ship.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
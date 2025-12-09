'use client';

import { useAppContext } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import ProductCard from '@/components/ProductCard';
import ProgressChart from '@/components/ProgressChart';
import ScanButton from '@/components/ScanButton';
import { TreePine, ChevronRight, Leaf, Wind, Droplets, ArrowRight } from 'lucide-react';

// --- Components ---

function AboutSection() {
  const { session } = useAppContext();
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider w-fit mb-6">
              <TreePine className="h-4 w-4" />
              <span>Misi Kami</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Mengubah Sampah Menjadi Berkah
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
              E-Recycle bukan sekadar aplikasi, tapi gerakan perubahan. Kami memadukan teknologi AI dengan gamifikasi untuk membuat daur ulang menjadi aktivitas yang menyenangkan dan menguntungkan.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Scan sampah dengan AI canggih",
                "Dapatkan poin untuk setiap gram",
                "Tukar poin dengan hadiah menarik"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {!session && (
              <Link href="/login">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    backgroundColor: '#16a34a',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    padding: '12px 32px',
                    boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)'
                  }}
                >
                  Mulai Perubahan
                </Button>
              </Link>
            )}
          </div>

          <div className="relative h-64 md:h-auto min-h-[300px]">
            <Image
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070"
              alt="Recycling Art"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-l"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="font-caveat text-3xl mb-2">"Bumi ini titipan anak cucu"</p>
              <p className="text-sm opacity-80">Bergabunglah dengan 10,000+ pahlawan lingkungan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvironmentalImpact({ totalWeight }) {
  const co2Saved = (totalWeight * 0.8).toFixed(1);
  const treesSaved = (totalWeight / 50).toFixed(1);

  const stats = [
    {
      icon: <Leaf className="w-6 h-6 text-green-500" />,
      value: totalWeight.toFixed(1),
      unit: "kg",
      label: "Sampah Terolah",
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50 dark:bg-green-900/10",
      border: "border-green-100 dark:border-green-900/30"
    },
    {
      icon: <Wind className="w-6 h-6 text-blue-500" />,
      value: co2Saved,
      unit: "kg",
      label: "Jejak Karbon",
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-100 dark:border-blue-900/30"
    },
    {
      icon: <TreePine className="w-6 h-6 text-yellow-500" />,
      value: treesSaved,
      unit: "Pohon",
      label: "Penyelamatan",
      color: "from-yellow-500 to-orange-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/10",
      border: "border-yellow-100 dark:border-yellow-900/30"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
            Dampak Nyata
          </span>
          <span className="text-2xl">🌍</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`relative overflow-hidden rounded-2xl p-6 ${stat.bg} border ${stat.border} transition-transform hover:-translate-y-1 duration-300`}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                {stat.icon}
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/50 dark:bg-black/20 text-gray-500`}>
                Total
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-gray-500">{stat.unit}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>

            {/* Decorative Background Blob */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-r ${stat.color} opacity-10 blur-2xl`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedProducts({ products }) {
  return (
    <div id="featured-rewards" className="mb-12">
      <div className="flex justify-between items-end px-1 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white mb-2">
            Hadiah Spesial
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Tukarkan poinmu dengan produk ramah lingkungan</p>
        </div>
        <Link href="/shop" className="group flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
          Lihat Semua
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Mobile Slider */}
      <div className="flex md:hidden overflow-x-auto gap-4 pb-6 -mx-4 px-4 no-scrollbar snap-x">
        {products.map(product => (
          <div key={product._id} className="w-[160px] flex-shrink-0 snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

// --- Main HomePageClient Component ---

export default function HomePageClient({ session, user, featuredProducts, recentActivities }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 overflow-x-hidden">

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-400/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10">
        {/* Hero for Guests Only */}
        {!session && (
          <div className="relative min-h-[95vh] flex items-center overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070"
                alt="Hero"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Dark overlay without white fade */}
              <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
              {/* Optional: Radial gradient for focus */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content - Left Aligned */}
                <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-2xl">
                  <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-300 text-sm font-bold tracking-wider mb-6 hover:bg-green-500/30 transition-colors">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    REVOLUSI DAUR ULANG
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-2xl tracking-tight">
                    Ubah <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">Sampah</span> Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Rupiah</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light border-l-4 border-green-500 pl-6 bg-black/20 py-2 rounded-r-lg backdrop-blur-sm">
                    Bergabunglah dengan komunitas peduli lingkungan. Scan sampahmu dengan AI, kumpulkan poin, dan tukarkan dengan hadiah menarik.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          borderRadius: '16px',
                          textTransform: 'none',
                          backgroundColor: '#16a34a',
                          fontSize: '1.1rem',
                          fontWeight: '800',
                          padding: '16px 48px',
                          boxShadow: '0 0 25px rgba(22, 163, 74, 0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: '#15803d',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.6)',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Mulai Sekarang
                      </Button>
                    </Link>
                    <Link href="#how-it-works" className="w-full sm:w-auto">
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderRadius: '16px',
                          textTransform: 'none',
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          padding: '16px 48px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Pelajari Cara Kerja
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-12 flex items-center gap-6 text-gray-400 text-sm font-medium">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                          <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} width={40} height={40} alt="User" />
                        </div>
                      ))}
                    </div>
                    <span>Dipercaya 10,000+ Pengguna</span>
                  </div>
                </div>

                {/* Right Side - Floating Cards / Visuals */}
                <div className="hidden md:block relative h-full min-h-[500px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                  {/* Abstract Floating UI Elements representing the app */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/30 rounded-full blur-[100px] animate-pulse"></div>

                  <div className="relative z-10 grid gap-6">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 hover:scale-105 shadow-2xl">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-green-500/20 rounded-2xl text-2xl">📸</div>
                        <div>
                          <p className="text-white font-bold">AI Scanner</p>
                          <p className="text-green-300 text-xs">Mendeteksi Sampah...</p>
                        </div>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-green-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl transform rotate-[6deg] translate-x-12 hover:rotate-0 hover:translate-x-0 transition-all duration-500 hover:scale-105 shadow-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-300 text-sm">Total Poin</p>
                        <span className="text-green-400 text-xs font-bold">+250</span>
                      </div>
                      <p className="text-3xl font-black text-white">12,450 <span className="text-sm font-normal text-gray-400">Pts</span></p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Hero for Logged-in Users */}
        {session && user && (
          <div className="relative min-h-[50vh] flex items-center mb-10 overflow-hidden rounded-b-[40px] shadow-2xl">
            {/* Nature Hero Background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/plant_tree.jpeg"
                alt="Nature Hero"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="text-white animate-in fade-in slide-in-from-left-8 duration-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
                      🌿 Pahlawan Lingkungan
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-lg">
                    Halo, <span className="text-green-400">{user.name?.split(' ')[0] || 'Sobat'}!</span> 👋
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 font-light max-w-xl">
                    Terima kasih telah berkontribusi menjaga kelestarian alam hari ini.
                  </p>
                </div>

                <div className="hidden md:block text-right animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                    <p className="text-sm font-medium text-gray-300">Hari ini</p>
                    <p className="text-2xl font-bold text-white">
                      {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative ${!session ? '-mt-20' : ''}`}>

          {session && user && (
            <div className="space-y-8 md:space-y-16">

              {/* Unified Stats Card */}
              <DashboardStats user={user} />

              {/* Flex container for Chart & Impact */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart - Takes up 2 columns */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Statistik Poin</h3>
                    <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm font-medium rounded-lg px-3 py-1 text-gray-600 dark:text-gray-300">
                      <option>Bulan Ini</option>
                      <option>Tahun Ini</option>
                    </select>
                  </div>
                  <ProgressChart monthlyPoints={user.monthlyPoints || {}} />
                </div>

                {/* Environmental Impact - Takes up 1 column */}
                <div className="lg:col-span-1">
                  <EnvironmentalImpact totalWeight={user.totalWeight || 0} />

                  {/* Mini Activity Feed */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Baru Saja</h3>
                      <Link href="/profile" className="text-xs font-bold text-green-600 hover:underline">Lihat Semua</Link>
                    </div>
                    <ActivityFeed activities={recentActivities.slice(0, 3)} compact />
                  </div>
                </div>
              </div>

              {/* Featured Products */}
              <FeaturedProducts products={featuredProducts} />

              {/* About Section */}
              <AboutSection />

            </div>
          )}

          {/* Guest View Content */}
          {(!session || !user) && (
            <div className="space-y-20 pb-20">
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mt-20">
                {[
                  { title: "Scan & Kenali", desc: "AI kami mengenali jenis sampahmu dalam hitungan detik.", icon: "📸" },
                  { title: "Kumpulkan Poin", desc: "Dapatkan poin reward untuk setiap gram sampah.", icon: "💰" },
                  { title: "Tukar Hadiah", desc: "Tukarkan poin dengan voucher, pulsa, atau barang.", icon: "🎁" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-4xl mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <FeaturedProducts products={featuredProducts} />
              <AboutSection />
            </div>
          )}
        </div>

        {/* Only show float scan button on desktop since mobile has it in navbar */}
        <div className="hidden md:block">
          {session && <ScanButton />}
        </div>
      </div>
    </div>
  );
}

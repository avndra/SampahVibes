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
import HeroCarousel from '@/components/HeroCarousel';
import { TreePine, ChevronRight, Leaf, Wind, Droplets, ArrowRight, ScanLine, Coins, Gift, Sparkles, History, Bell } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// ... (skip lines)
<Link href="/notifications" className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
  <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></div>
  <Bell className="w-5 h-5" />
</Link>

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
              Mengubah Sampah Menjadi Poin
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
              E-Recycle bukan sekadar aplikasi, tapi gerakan perubahan, memadukan scan berat ke poin dengan gamifikasi untuk membuat daur ulang menjadi aktivitas yang menyenangkan dan menguntungkan.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Scan sampah dengan Scanner",
                "Dapatkan poin untuk setiap gram",
                "Tukar poin dengan barang menarik"
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
              src="images/tree_in_pot.jpg"
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
    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
              Dampak
            </span>
            <div className="w-8 h-8 inline-block">
              <DotLottieReact
                src="https://lottie.host/921d285a-51eb-42f0-a463-831cbb0dc411/1ohY6gq49K.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Kontribusi positifmu untuk bumi sejauh ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, idx) => (
          <div key={idx} className={`relative overflow-hidden rounded-xl p-2.5 ${stat.bg} border ${stat.border} transition-all hover:bg-opacity-80 group`}>
            <div className="flex flex-col items-center text-center">
              <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-1.5">
                {/* Clone element to modify className for size */}
                {React.cloneElement(stat.icon, { className: `w-4 h-4 ${stat.icon.props.className.split(' ').slice(2).join(' ')}` })}
              </div>

              <div className="relative z-10 w-full">
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} leading-none`}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 mt-0.5">{stat.unit}</span>
                </div>
                <p className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mt-0.5 truncate w-full">
                  {stat.label}
                </p>
              </div>
            </div>
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

// How It Works Section for Landing Page
function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: ScanLine,
      title: 'Scan Sampahmu',
      description: 'Arahkan kamera ke barcode botol plastik atau sampah elektronik. Sistem akan mendeteksi jenis dan berat otomatis.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      step: 2,
      icon: Coins,
      title: 'Dapatkan Poin & XP',
      description: 'Setiap gram sampah yang kamu recycle akan dikonversi menjadi poin reward dan XP untuk naik level.',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      step: 3,
      icon: Gift,
      title: 'Tukar dengan Hadiah',
      description: 'Kumpulkan poin dan tukarkan dengan produk ramah lingkungan, voucher, atau merchandise eksklusif.',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent text-transparent text-sm font-bold mb-4">
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Semudah <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">1-2-3</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Tidak perlu ribet. Cukup tiga langkah sederhana untuk mulai berkontribusi menjaga bumi.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-24 left-[16.6%] right-[16.6%] h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-pink-500 rounded-full opacity-20" />

        {steps.map((item, index) => (
          <div key={index} className="relative group">
            {/* Step Number Badge */}
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${item.color} text-white font-black text-sm flex items-center justify-center shadow-lg z-10`}>
              {item.step}
            </div>

            <div className={`${item.bgColor} backdrop-blur-sm border border-white/10 rounded-3xl p-8 pt-10 text-center hover:scale-105 transition-all duration-500 group-hover:shadow-2xl`}>
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Product Slider for Guest Landing Page
function ProductSlider({ products }) {
  const [isPaused, setIsPaused] = useState(false);

  if (products.length === 0) return null;

  // Duplicate products for infinite scroll effect
  const duplicatedProducts = [...products, ...products];

  return (
    <div className="py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent text-purple-500 text-sm font-bold mb-4">
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Tukar Poin dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Hadiah Menarik</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Dari tumbler premium hingga voucher belanja. Pilihan rewards yang bikin semangat daur ulang!
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-6 py-4 animate-scroll"
          style={{
            width: 'max-content',
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="flex-shrink-0 w-64 group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  <Image
                    src={product.image || '/images/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {/* Points Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    {product.pointsCost?.toLocaleString()} pts
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {product.description || 'Produk ramah lingkungan'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center mt-10">
        <Link href="/shop">
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              fontSize: '1rem',
              fontWeight: '700',
              padding: '14px 40px',
              boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7e22ce 0%, #db2777 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 40px rgba(147, 51, 234, 0.4)',
              },
            }}
          >
            Lihat Semua Hadiah
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

import OnboardingGuide from '@/components/OnboardingGuide';

import QuickActions from '@/components/QuickActions';

// --- Main HomePageClient Component ---

export default function HomePageClient({ session, user, featuredProducts, recentActivities }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-12 overflow-x-hidden font-sans">

      {/* Onboarding Guide for New Users */}
      {session && user && (
        <OnboardingGuide
          userPoints={user.totalPoints || 0}
          userDeposits={user.totalDeposits || 0}
        />
      )}

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-400/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto md:max-w-7xl">
        {/* Hero for Guests Only */}
        {!session && (
          <div className="relative min-h-[95vh] flex items-center overflow-hidden">
            {/* ... Guest content unchanged ... */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070"
                alt="Hero"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-2xl">
                  <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-300 text-sm font-bold tracking-wider mb-6 hover:bg-green-500/30 transition-colors">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    REVOLUSI DAUR ULANG
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-2xl tracking-tight">
                    Ubah <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">Sampah</span> Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Poin</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light border-l-4 border-green-500 pl-6 bg-black/20 py-2 rounded-r-lg backdrop-blur-sm">
                    Bergabunglah dengan komunitas peduli lingkungan. Scan sampahmu dengan kamera, kumpulkan poin, dan tukarkan dengan hadiah menarik.
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
                  </div>
                  {/* Trust Indicators */}
                  <div className="mt-12 flex items-center gap-6 text-gray-400 text-sm font-medium">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                          <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} width={40} height={40} alt="User" unoptimized />
                        </div>
                      ))}
                    </div>
                    <span>Dipercaya 1000+ Pengguna</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className={`px-4 sm:px-6 lg:px-8 relative ${!session ? '-mt-20' : 'pt-6'}`}>

          {session && user && (
            <div className="space-y-6">

              {/* 0. Promo Banner (HeroCarousel) - Full Width on Mobile */}
              <div className="w-full overflow-hidden rounded-none md:rounded-3xl shadow-lg -mx-4 md:mx-0 w-[calc(100%+2rem)] md:w-full">
                <HeroCarousel />
              </div>

              {/* 1. Mobile App Header Style */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                    Halo, {user.name?.split(' ')[0]}! 👋
                  </h1>
                </div>
                {/* Header Buttons */}
                <div className="flex items-center gap-3">
                  <Link href="/history" className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <History className="w-5 h-5" />
                  </Link>
                  <Link href="/notifications" className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
                    <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></div>
                    {/* Note: In a real app, red dot would be conditional based on unread count */}
                    <Bell className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* 2. Hero Card (DashboardStats) */}
              <div className="w-full">
                <DashboardStats user={user} />
              </div>

              {/* 3. Quick Actions Grid */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800">
                <QuickActions />
              </div>

              {/* 4. Impact & Charts (Stacked) */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Statistik Poin</h3>
                <ProgressChart monthlyPoints={user.monthlyPoints || {}} />
                <EnvironmentalImpact totalWeight={user.totalWeight || 0} />
              </div>

              {/* 5. Recent Activity - Hidden on Mobile, Visible on Desktop */}
              <div className="hidden md:block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Aktivitas Terbaru</h3>
                  <Link href="/history" className="text-xs font-bold text-green-600 hover:underline">Lihat Semua</Link>
                </div>
                <ActivityFeed activities={recentActivities.slice(0, 5)} compact />
              </div>

              {/* 6. Featured Products */}
              <div className="pt-2">
                <FeaturedProducts products={featuredProducts} />
              </div>

            </div>
          )}

          {/* Guest View Content */}
          {(!session || !user) && (
            <div className="space-y-0 pb-20">
              <HowItWorks />
              <ProductSlider products={featuredProducts} />
              <AboutSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

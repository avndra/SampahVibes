'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Sparkles, Zap, Recycle, Coins, Gift } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth';
import Image from 'next/image';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dotLottieRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // Login
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        if (result.error.includes('banned')) {
          toast.error('Akun Anda telah DIBEKUKAN. Hubungi admin.');
        } else {
          toast.error('Email atau password salah.');
        }
      } else {
        toast.success('Welcome back! 🎉');
        router.push('/');
        router.refresh();
      }
    } else {
      // Register
      const result = await registerUser(formData);

      if (result.success) {
        toast.success(result.message);
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', name: '' });
      } else {
        toast.error(result.error);
      }
    }

    setLoading(false);
  };



  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                E-Recycle
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2 text-gray-900 dark:text-white">
              {isLogin ? (
                <>Selamat Datang Kembali! <img src="https://emojis.slackmojis.com/emojis/images/1577305505/7373/hand_wave.gif?1577305505" alt="wave" className="inline w-10 h-10" /></>
              ) : (
                'Bergabunglah Sekarang! 🚀'
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">
              {isLogin
                ? 'Lanjutkan perjalanan ramah lingkungan Anda'
                : 'Mulai dapatkan hadiah dari mendaur ulang'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                    <User className="inline h-4 w-4 mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold"
                    required={!isLogin}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold"
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      if (dotLottieRef.current) {
                        if (!showPassword) {
                          dotLottieRef.current.setSegment(0, 10);
                          dotLottieRef.current.play();
                        } else {
                          dotLottieRef.current.setSegment(10, 30);
                          dotLottieRef.current.play();
                        }
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors overflow-hidden"
                  >
                    <div className="w-6 h-6">
                      <DotLottieReact
                        src="https://lottie.host/60450d32-4ff9-4da6-a773-1bfdb6a04c03/GLCyh8XQaZ.lottie"
                        loop={false}
                        autoplay={false}
                        style={{ width: '100%', height: '100%' }}
                        dotLottieRefCallback={(dotLottie) => {
                          dotLottieRef.current = dotLottie;
                        }}
                      />
                    </div>
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => toast.info('Hubungi Admin untuk reset: +62 812-3456-7890', {
                        duration: 10000,
                        action: {
                          label: 'Salin',
                          onClick: () => {
                            navigator.clipboard.writeText('+6281234567890');
                            toast.success('Nomor Admin disalin!');
                          }
                        }
                      })}
                      className="text-sm font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                      Lupa Password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  height: 56,
                  borderRadius: 3,
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  textTransform: 'none',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #059669, #047857)',
                    boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mohon tunggu...
                  </>
                ) : isLogin ? (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Masuk
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Buat Akun
                  </>
                )}
              </Button>
            </form>





            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  {isLogin ? 'Atau masuk dengan' : 'Atau daftar dengan'}
                </span>
              </div>
            </div>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => signIn('google', { callbackUrl: '/' })}
              sx={{
                height: 56,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#374151',
                borderColor: '#e5e7eb',
                '&:hover': {
                  borderColor: '#d1d5db',
                  backgroundColor: '#f9fafb'
                }
              }}
              className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={24}
                height={24}
                className="mr-3"
              />
              Continue with Google
            </Button>

            {/* Toggle */}
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400 font-semibold">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 dark:text-green-400 font-black hover:underline"
              >
                {isLogin ? 'Daftar' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013"
          alt="Recycling"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        {/* Dark gradient overlay for text readability without hiding image details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <div className="text-white max-w-xl">
            <h2 className="text-5xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
              Langkah Kecil,<br />
              <span className="text-green-400">Dampak Besar.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed font-medium drop-shadow-md">
              Ubah kebiasaan membuang sampah menjadi aksi nyata menyelamatkan lingkungan sambil mendapatkan keuntungan eksklusif.
            </p>

            <div className="grid gap-5">
              {[
                { icon: Recycle, title: 'Daur Ulang', desc: 'Kelola sampah dengan bijak' },
                { icon: Coins, title: 'Dapatkan Poin', desc: 'Tukar sampah jadi cuan' },
                { icon: Gift, title: 'Raih Hadiah', desc: 'Voucher & produk menarik' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <item.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg drop-shadow-md">{item.title}</h3>
                    <p className="text-sm text-gray-400 font-medium drop-shadow-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
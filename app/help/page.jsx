import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    QrCode,
    ShoppingBag,
    Leaf,
    HelpCircle,
    UserPlus,
    Smartphone,
    Trophy,
    MapPin,
    Mail
} from 'lucide-react';

export const metadata = {
    title: 'Pusat Bantuan - RecycleVibes',
    description: 'Panduan lengkap cara menggunakan layanan RecycleVibes untuk pemula.',
};

export default function HelpPage() {
    const guides = [
        {
            title: "Langkah Pertama",
            icon: <UserPlus className="w-8 h-8 text-green-600" />,
            steps: [
                "Daftar akun menggunakan email aktif.",
                "Lengkapi profil Anda (nama, alamat) agar pengiriman hadiah lancar.",
                "Pastikan izin lokasi dan kamera browser aktif untuk fitur Scan."
            ]
        },
        {
            title: "Cara Scan Sampah",
            icon: <QrCode className="w-8 h-8 text-blue-600" />,
            steps: [
                "Buka menu 'Scan' di halaman utama atau navbar.",
                "Arahkan kamera ke barcode kemasan plastik/botol.",
                "Sistem akan otomatis mendeteksi jenis sampah dan poinnya.",
                "Jika berhasil, poin akan langsung masuk ke akun Anda."
            ]
        },
        {
            title: "Tukar Hadiah (Shop)",
            icon: <ShoppingBag className="w-8 h-8 text-purple-600" />,
            steps: [
                "Kumpulkan poin sebanyak-banyaknya.",
                "Buka menu 'Shop' untuk melihat katalog hadiah.",
                "Pilih barang atau voucher yang diinginkan.",
                "Pastikan stok tersedia dan poin Anda cukup.",
                "Klik 'Beli Langsung' dan isi alamat pengiriman."
            ]
        },
        {
            title: "Tips Mendapat Poin Ekstra",
            icon: <Trophy className="w-8 h-8 text-yellow-600" />,
            steps: [
                "Rutin scan sampah setiap hari.",
                "Ajak teman untuk ikut mendaur ulang.",
                "Pantau promo poin ganda di hari-hari tertentu.",
                "Pastikan sampah bersih sebelum disetorkan (opsional tapi baik!)."
            ]
        }
    ];

    const faqs = [
        {
            q: "Kenapa lokasi saya tidak terdeteksi?",
            a: "Pastikan GPS di HP Anda menyala dan Anda telah memberikan izin 'Location Access' pada browser saat diminta."
        },
        {
            q: "Apakah poin bisa hangus?",
            a: "Saat ini poin RecycleVibes berlaku selamanya selama akun Anda aktif."
        },
        {
            q: "Berapa lama pengiriman hadiah?",
            a: "Untuk voucher digital instan. Untuk barang fisik, estimasi pengiriman 3-5 hari kerja tergantung lokasi."
        },
        {
            q: "Apa yang terjadi jika stok habis?",
            a: "Stok akan diisi ulang secara berkala. Anda bisa cek kembali di lain waktu atau memilih hadiah lain."
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 text-green-600 mb-4">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    Pusat Bantuan
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Bingung harus mulai dari mana? Simak panduan singkat ini untuk memulai perjalanan daur ulangmu.
                </p>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {guides.map((guide, idx) => (
                    <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                                {guide.icon}
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">{guide.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {guide.steps.map((step, sIdx) => (
                                    <li key={sIdx} className="flex gap-3 text-gray-600 dark:text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {sIdx + 1}
                                        </div>
                                        <span className="leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 border-t pt-12 border-gray-100 dark:border-gray-800">
                    Sering Ditanyakan (FAQ)
                </h2>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                                <span className="text-green-500">Q:</span> {item.q}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-6 border-l-2 border-green-100 dark:border-gray-700">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support CTA */}
            <div className="mt-20 text-center bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-3xl p-10">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Masih butuh bantuan?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Tim support kami siap membantu kendala Anda.</p>
                <div className="inline-flex gap-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-sm font-bold text-gray-700 dark:text-gray-200">
                        <Mail className="w-4 h-4 text-green-500" />
                        support@recyclevibes.com
                    </div>
                </div>
            </div>
        </div>
    );
}

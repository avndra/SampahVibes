import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'Kebijakan Privasi - RecycleVibes',
    description: 'Informasi tentang bagaimana RecycleVibes mengumpulkan dan menggunakan data Anda.',
};

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 border-b border-gray-100">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                        Kebijakan Privasi
                    </CardTitle>
                    <p className="text-gray-500 mt-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[60vh] pr-4 overflow-y-auto custom-scrollbar">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Pengumpulan Data</h3>
                                <p>
                                    Kami mengumpulkan informasi pribadi tertentu untuk memberikan layanan terbaik, meliputi:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>Identitas:</strong> Nama, Email, dan informasi profil dasar saat pendaftaran.</li>
                                    <li><strong>Lokasi:</strong> Data geolokasi Anda saat melakukan checkout untuk keperluan pengiriman hadiah.</li>
                                    <li><strong>Kamera:</strong> Akses kamera hanya digunakan saat Anda menggunakan fitur Scan Barcode.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Penggunaan Data</h3>
                                <p>Data Anda digunakan untuk:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Memproses penukaran poin dan pengiriman hadiah.</li>
                                    <li>Memverifikasi keaslian scan sampah (anti-cheat).</li>
                                    <li>Mengirimkan notifikasi penting terkait akun Anda.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Keamanan Data</h3>
                                <p>
                                    Kami menerapkan protokol keamanan standar industri untuk melindungi data Anda. Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga manapun.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Cookie & Penyimpanan Lokal</h3>
                                <p>
                                    Aplikasi ini menggunakan <em>Local Storage</em> dan <em>Cookies</em> untuk menyimpan sesi login dan preferensi pengguna (seperti status "Onboarding" yang sudah dilihat).
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Hak Pengguna</h3>
                                <p>
                                    Anda berhak untuk meminta penghapusan akun dan data pribadi Anda dengan menghubungi layanan pelanggan kami melalui email yang tertera di bagian footer.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Perubahan Kebijakan</h3>
                                <p>
                                    Kebijakan privasi ini dapat berubah sewaktu-waktu. Kami menyarankan Anda untuk memeriksa halaman ini secara berkala.
                                </p>
                            </section>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center mt-8 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} RecycleVibes Platform. All rights reserved.
            </div>
        </div>
    );
}

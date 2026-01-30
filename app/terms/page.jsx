import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsAndConditions() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 border-b border-gray-100">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                        Syarat dan Ketentuan
                    </CardTitle>
                    <p className="text-gray-500 mt-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[60vh] pr-4 overflow-y-auto custom-scrollbar">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Pendahuluan</h3>
                                <p>
                                    Selamat datang di RecycleVibes. Dengan mengakses dan menggunakan platform ini, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang tertulis di bawah ini.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Akun Pengguna</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Anda wajib memberikan informasi yang akurat saat pendaftaran.</li>
                                    <li>Anda bertanggung jawab menjaga kerahasiaan akun dan password Anda.</li>
                                    <li>Kami berhak menonaktifkan akun (banned) jika ditemukan aktivitas mencurigakan atau pelanggaran aturan.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Sistem Poin & Penukaran</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Poin diperoleh dari hasil scan sampah yang valid.</li>
                                    <li>Kami berhak membatalkan poin jika ditemukan kecurangan manipulasi scan.</li>
                                    <li>Penukaran poin (Redemption) bersifat final dan tidak dapat dibatalkan kecuali stok kosong.</li>
                                    <li>Stok barang dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Larangan</h3>
                                <p>Pengguna dilarang keras:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Menggunakan bot atau script otomatis untuk memanipulasi sistem.</li>
                                    <li>Mengunggah konten yang mengandung SARA atau pornografi.</li>
                                    <li>Mencoba meretas atau merusak integritas sistem keamanan kami.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Penafian (Disclaimer)</h3>
                                <p>
                                    Aplikasi ini dibuat sebagai proyek kompetensi kejuruan. Poin dan barang yang ada di dalam platform ini mungkin bersifat simulasi kecuali dinyatakan lain.
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

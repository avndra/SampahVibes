import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-8 animate-bounce">
                <FileQuestion className="w-16 h-16 text-gray-400" />
            </div>

            <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
            </p>

            <div className="flex gap-3">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/">
                        Kembali ke Beranda
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/terms">
                        Baca Syarat & Ketentuan
                    </Link>
                </Button>
            </div>
        </div>
    );
}

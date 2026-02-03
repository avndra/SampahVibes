'use client';

import { Suspense, useState, useRef } from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, FileText, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Image from 'next/image';

export default function PurchaseSuccessModal({ isOpen, onClose, transaction }) {
    const [downloading, setDownloading] = useState(false);

    if (!transaction) return null;

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(16, 185, 129); // Green-600
            doc.text('RecycleVibes', 105, 20, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text('Bukti Penukaran Poin', 105, 30, { align: 'center' });

            // Transaction Info
            doc.setFontSize(10);
            doc.setTextColor(0);

            const details = [
                ['ID Transaksi', transaction._id],
                ['Tanggal', new Date(transaction.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full', timeStyle: 'short' })],
                ['Status', transaction.status.toUpperCase()],
            ];

            autoTable(doc, {
                startY: 40,
                body: details,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2 },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
            });

            // Product Details
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Produk', 'Jumlah', 'Total Poin']],
                body: [
                    [transaction.productName, transaction.quantity, `${transaction.totalPoints.toLocaleString()} pts`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [16, 185, 129], textColor: 255 },
                styles: { fontSize: 11, cellPadding: 5 },
            });

            // Shipping info
            if (transaction.shippingData) {
                doc.text('Info Pengiriman:', 14, doc.lastAutoTable.finalY + 15);
                doc.setFontSize(10);
                doc.text(`${transaction.shippingData.address}`, 14, doc.lastAutoTable.finalY + 22);
                doc.text(`${transaction.shippingData.city}, ${transaction.shippingData.postalCode}`, 14, doc.lastAutoTable.finalY + 27);
            }

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text('Terima kasih telah berkontribusi menjaga lingkungan!', 105, 280, { align: 'center' });

            doc.save(`receipt-${transaction._id.substr(-6)}.pdf`);
        } catch (error) {
            console.error(error);
            alert('Gagal mendownload PDF');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="text-center space-y-6 pt-2 pb-6">

                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Penukaran Berhasil!</h2>
                    <p className="text-gray-500">Permintaan Anda sedang diproses admin.</p>
                </div>

                {/* Digital Receipt Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-left border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    {/* Decorative jagged edge bottom could be CSS, but kept simple here */}
                    <div className="border-b border-dashed border-gray-300 dark:border-gray-600 pb-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Transaksi ID</span>
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{transaction._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tanggal</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">{new Date(transaction.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-200">
                                <img src={transaction.productImage} alt="prod" className="w-full h-full object-cover rounded" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{transaction.productName}</p>
                                <p className="text-sm text-gray-500">x{transaction.quantity}</p>
                            </div>
                            <div className="ml-auto font-bold text-green-600">
                                -{transaction.totalPoints.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="font-black text-xl text-green-600">{transaction.totalPoints.toLocaleString()} pts</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* PDF Button removed as requested */}
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" onClick={onClose}>
                        Selesai
                    </Button>
                </div>

            </div>
        </Modal>
    );
}

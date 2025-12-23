'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        image: 'images/recycletrsh.jpg',
        title: 'Daur Ulang Sampah',
        subtitle: 'Selamatkan lingkungan kita dengan daur ulang yang tepat'
    },
    {
        id: 2,
        image: 'images/greenearth.jpg',
        title: 'Bumi Hijau Masa Depan',
        subtitle: 'Bersama-sama kita jaga alam kita'
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 overflow-hidden mb-8 group">
            {/* Slides */}
            <div
                className="relative w-full h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {SLIDES.map((slide) => (
                    <div key={slide.id} className="relative w-full h-full flex-shrink-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={slide.id === 1}
                            unoptimized
                        />
                        {/* Overlay for text readability - sharp edges, no gradient */}
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 md:px-16">
                            <div className="max-w-2xl text-white">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                                <p className="text-lg md:text-xl text-gray-200">{slide.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 transition-colors ${current === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

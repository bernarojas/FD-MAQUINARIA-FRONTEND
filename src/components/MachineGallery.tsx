'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  name: string;
}

export default function MachineGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setActive((p) => (p + 1) % images.length);
      if (e.key === 'ArrowLeft') setActive((p) => (p - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!images?.length) {
    return (
      <div className="h-80 lg:h-[420px] rounded-xl bg-slate-800 flex items-center justify-center">
        <span className="text-slate-600 text-sm">Sin imágenes</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative h-80 lg:h-[420px] rounded-xl overflow-hidden bg-slate-800 cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[active]}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 ease-out hover:scale-105"
            priority
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative h-20 rounded-lg overflow-hidden bg-slate-800 border-2 transition-all ${
                  active === i ? 'border-amber-500' : 'border-transparent hover:border-slate-600'
                }`}
              >
                <Image
                  src={url}
                  alt={`${name} imagen ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-xl"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); setActive((p) => (p - 1 + images.length) % images.length); }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); setActive((p) => (p + 1) % images.length); }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {active + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}

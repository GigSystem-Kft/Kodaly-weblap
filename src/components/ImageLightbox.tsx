import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props { src: string; alt: string; onClose: () => void; }

export const ImageLightbox: React.FC<Props> = ({ src, alt, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out" onClick={onClose}>
      <button aria-label="Bezár" className="absolute top-3 right-3 text-white p-2" onClick={onClose}>
        <X className="w-7 h-7" />
      </button>
      <div className="max-h-full max-w-6xl w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="w-full h-auto bg-white rounded" />
        <p className="text-center text-white/80 text-sm mt-2">{alt}</p>
      </div>
    </div>
  );
};

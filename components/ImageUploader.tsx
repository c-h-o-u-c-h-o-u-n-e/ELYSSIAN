
import React, { useState } from 'react';
import { ReferenceImages } from '../types';

interface ImageUploaderProps {
  onProcess: (images: ReferenceImages, sizeInfo: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onProcess, isLoading }) => {
  const [previews, setPreviews] = useState<{front: string | null, back: string | null, side: string | null}>({
    front: null,
    back: null,
    side: null
  });
  const [sizeInfo, setSizeInfo] = useState('');
  const [images, setImages] = useState<{front: string | null, back: string | null, side: string | null}>({
    front: null,
    back: null,
    side: null
  });

  const handleFileChange = (type: keyof ReferenceImages) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImages(prev => ({ ...prev, [type]: base64 }));
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.front && images.back && images.side) {
      onProcess(images as ReferenceImages, sizeInfo || 'Standard Fit');
    }
  };

  const isReady = images.front && images.back && images.side;

  return (
    <div className="max-w-5xl mx-auto bg-[#f8bbd0] p-10 neo-brutal">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-black uppercase tracking-tighter italic">Technical Entry</h2>
          <p className="text-black font-bold text-sm tracking-widest bg-white border-2 border-black inline-block px-4 py-1">THREE PERSPECTIVES REQUIRED</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['front', 'back', 'side'] as const).map((view) => (
            <div key={view} className="space-y-4">
              <span className="text-xs font-black text-black uppercase tracking-widest block text-center underline decoration-black/20">{view} View</span>
              <div className={`relative border-4 border-black transition-colors aspect-square ${previews[view] ? 'bg-[#f48fb1]' : 'bg-[#fce4ec]'}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(view)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isLoading}
                />
                {previews[view] ? (
                  <div className="p-2 h-full w-full">
                    <img src={previews[view]!} alt={`${view} preview`} className="h-full w-full border-2 border-black object-contain shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white" />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 bg-black flex items-center justify-center">
                      <i className={`fa-solid ${view === 'front' ? 'fa-image' : view === 'back' ? 'fa-person-half-dress' : 'fa-camera-rotate'} text-xl text-[#fce4ec]`}></i>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black text-center px-4">Upload {view}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className="text-xs font-black text-black uppercase tracking-widest block mb-3">Garment Specifications</span>
            <input
              type="text"
              placeholder="E.G., 34B, SILK SATIN, FRENCH LACE..."
              value={sizeInfo}
              onChange={(e) => setSizeInfo(e.target.value)}
              className="w-full px-6 py-5 bg-[#fce4ec] border-4 border-black text-black font-black focus:outline-none placeholder:text-black/30 placeholder:uppercase"
              disabled={isLoading}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!isReady || isLoading}
          className={`w-full py-6 rounded-none text-2xl font-black tracking-[0.2em] uppercase neo-btn ${
            !isReady || isLoading ? 'bg-stone-400 cursor-not-allowed text-stone-600' : 'bg-[#d81b60] text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Synching Blueprints...</span>
            </div>
          ) : (
            <span>Initiate Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
};

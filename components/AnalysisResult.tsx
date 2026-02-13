
import React, { useState } from 'react';
import { AnalysisResponse, ReferenceImages } from '../types';
import { geminiService } from '../services/geminiService';

interface AnalysisResultProps {
  data: AnalysisResponse;
  originalImages: ReferenceImages;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, originalImages }) => {
  const [visuals, setVisuals] = useState<Record<string, string>>({});
  const [loadingVisual, setLoadingVisual] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const generateVisual = async (id: string, type: 'product' | 'front' | 'back', prompt: string) => {
    setLoadingVisual(id);
    try {
      let referenceImage: string;
      if (type === 'product') {
        referenceImage = originalImages.front;
      } else if (type === 'front') {
        referenceImage = originalImages.front;
      } else {
        referenceImage = originalImages.back;
      }
      const url = await geminiService.generateVisual(type, prompt, referenceImage);
      setVisuals(prev => ({ ...prev, [id]: url }));
    } catch (err) {
      console.error(err);
      alert("Could not generate visual at this time.");
    } finally {
      setLoadingVisual(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard!");
  };

  const analysisItems = [
    { label: 'Fabric & Texture', value: data.analysis.fabric, icon: 'fa-scroll' },
    { label: 'Color Palette', value: data.analysis.colors, icon: 'fa-palette' },
    { label: 'Construction', value: data.analysis.construction, icon: 'fa-compass-drafting' },
    { label: 'Embellishments', value: data.analysis.embellishments, icon: 'fa-sparkles' },
    { label: 'Fit & Structure', value: data.analysis.fit, icon: 'fa-user-check' },
    { label: 'Unique Elements', value: data.analysis.uniqueFeatures, icon: 'fa-signature' },
  ];

  const blueprintCards = [
    { id: 'productShot', type: 'product' as const, title: '01. Studio Pack', prompt: data.prompts.productShot, icon: 'fa-image', model: 'Gemini 2.5' },
    { id: 'frontModelShot', type: 'front' as const, title: '02. Front Profile', prompt: data.prompts.frontModelShot, icon: 'fa-person-half-dress', model: 'Seedream 4.5' },
    { id: 'backModelShot', type: 'back' as const, title: '03. Rear View', prompt: data.prompts.backModelShot, icon: 'fa-person-running', model: 'Seedream 4.5' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-20">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-[#f06292] text-5xl transition-transform active:scale-90 z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
          <img 
            src={selectedImage} 
            alt="Full size preview" 
            className="max-w-full max-h-full object-contain border-8 border-[#f06292] bg-white shadow-[0px_0px_50px_rgba(240,98,146,0.3)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Analysis Section */}
      <section className="space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-black text-black leading-none uppercase tracking-tighter italic">
            Technical <br/>
            <span className="text-[#d81b60] serif normal-case">DNA Analysis</span>
          </h2>
          <div className="w-40 h-2 bg-black mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {analysisItems.map((item, idx) => (
            <div key={idx} className="flex flex-col p-8 bg-[#f48fb1] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-[#fce4ec] mb-6">
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-black mb-3 underline decoration-black/30 underline-offset-4">{item.label}</h4>
              <p className="text-sm text-black leading-relaxed font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Studio Blueprints */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-black uppercase tracking-tighter italic">Comparison Studio</h2>
          <p className="text-black font-black text-xs tracking-[0.5em] uppercase bg-[#f06292] inline-block px-6 py-2 border-2 border-black">Master Reference Matrix vs AI Blueprints</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Master Reference Card - Multi View */}
          <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col xl:col-span-1">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-black uppercase tracking-tighter italic">Source</h4>
                <div className="w-10 h-10 bg-[#d81b60] flex items-center justify-center text-white">
                  <i className="fa-solid fa-fingerprint text-sm"></i>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(['front', 'back', 'side'] as const).map((view) => (
                  <div key={view} className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-black">{view} view</span>
                      <i className="fa-solid fa-circle text-[4px] text-stone-200"></i>
                    </div>
                    <div 
                      className="aspect-[4/3] w-full bg-[#fce4ec] border-2 border-black cursor-zoom-in relative overflow-hidden group"
                      onClick={() => setSelectedImage(`data:image/jpeg;base64,${originalImages[view]}`)}
                    >
                      <img 
                        src={`data:image/jpeg;base64,${originalImages[view]}`} 
                        alt={`${view} Master`} 
                        className="w-full h-full object-contain p-1 bg-white" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Blueprints */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {blueprintCards.map((card) => (
              <div key={card.id} className="bg-[#f06292] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                <div className="p-8 flex-grow space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black text-black uppercase tracking-tighter italic leading-none">{card.title}</h4>
                    <div className="w-10 h-10 bg-black flex items-center justify-center text-[#fce4ec]">
                      <i className={`fa-solid ${card.icon} text-sm`}></i>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Engine:</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black px-2 py-0.5">{card.model}</span>
                  </div>
                  <div className="bg-[#fce4ec] p-4 border-2 border-black text-[11px] text-black leading-relaxed font-bold italic h-36 overflow-y-auto">
                    {card.prompt}
                  </div>
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={() => copyToClipboard(card.prompt)}
                      className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-black border-2 border-black bg-[#fce4ec] neo-btn"
                    >
                      Copy Prompt
                    </button>
                    <button 
                      onClick={() => generateVisual(card.id, card.type, card.prompt)}
                      disabled={!!loadingVisual}
                      className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-white bg-black neo-btn disabled:opacity-50"
                    >
                      {loadingVisual === card.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : 'Generate Visual'}
                    </button>
                  </div>
                </div>

                {visuals[card.id] ? (
                  <div 
                    className="aspect-square w-full bg-white border-t-4 border-black cursor-zoom-in relative overflow-hidden"
                    onClick={() => setSelectedImage(visuals[card.id])}
                  >
                    <img src={visuals[card.id]} alt="Generated Preview" className="w-full h-full object-contain p-4" />
                    <div className="absolute top-4 right-4 bg-black text-white p-2 border-2 border-[#f06292]">
                      <i className="fa-solid fa-magnifying-glass-plus text-xs"></i>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-[#f8bbd0] border-t-4 border-black flex items-center justify-center p-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#d81b60]/50 italic">
                      Visual pending generation...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

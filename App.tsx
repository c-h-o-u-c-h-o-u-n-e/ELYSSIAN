
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { geminiService } from './services/geminiService';
import { AnalysisResponse, ReferenceImages } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [currentImages, setCurrentImages] = useState<ReferenceImages | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImages = async (images: ReferenceImages, size: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentImages(images);
    try {
      const data = await geminiService.analyzeLingerie(images, size);
      setResult(data);
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError("WE ENCOUNTERED A PROBLEM DURING THE TRI-ANGLE ANALYSIS. ENSURE ALL PHOTOS ARE CLEAR.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentImages(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="bg-[#fce4ec] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10">
          {!result ? (
            <div className="space-y-24">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block px-6 py-2 bg-black text-[#f06292] font-black text-xs tracking-[0.4em] uppercase mb-4 border-4 border-black">
                  TRI-ANGLE CRAFT ANALYTICS
                </div>
                <h1 className="text-6xl md:text-9xl font-black text-black leading-none uppercase tracking-tighter italic">
                  Boutique <br/>
                  <span className="text-[#d81b60] serif normal-case">Intelligence.</span>
                </h1>
                <p className="text-xl text-black font-bold max-w-2xl mx-auto leading-relaxed underline decoration-[#f06292] decoration-8 underline-offset-8">
                  ADVANCED PHOTOGRAMMETRIC ANALYSIS FOR ELITE LINGERIE CURATION. POWERED BY SEEDREAM 4.5.
                </p>
              </div>

              <ImageUploader onProcess={processImages} isLoading={isLoading} />
              
              {error && (
                <div className="max-w-2xl mx-auto p-6 bg-black text-[#f48fb1] border-4 border-[#d81b60] text-sm text-center font-black uppercase tracking-widest">
                  <i className="fa-solid fa-circle-exclamation mr-3 text-xl"></i>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-20 border-t-8 border-black">
                {[
                  { title: "Triple Perspective", text: "Front, back, and side analysis for absolute precision." },
                  { title: "Seedream 4.5", text: "State-of-the-art model shot generation via OpenRouter." },
                  { title: "Studio Fidelity", text: "Professional-grade photography blueprints for any lighting." },
                  { title: "Neo-Brutalist", text: "High-contrast accessibility meets Victoria's Secret aesthetics." }
                ].map((feature, i) => (
                  <div key={i} className="space-y-4 p-6 bg-[#f8bbd0] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black italic underline decoration-black/20">{feature.title}</h4>
                    <p className="text-[12px] text-black font-bold tracking-wider leading-relaxed">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 border-b-8 border-black pb-12 gap-6">
                <button 
                  onClick={reset}
                  className="flex items-center space-x-4 text-black bg-[#f06292] px-8 py-4 border-4 border-black font-black uppercase tracking-[0.2em] text-sm neo-btn"
                >
                  <i className="fa-solid fa-arrow-left text-xl"></i>
                  <span>Back to Lab</span>
                </button>
                <div className="text-black text-xs tracking-[0.4em] uppercase font-black bg-[#f8bbd0] p-4 border-4 border-black">
                  MULTI-VIEW REPORT — {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
              </div>
              
              <AnalysisResult data={result} originalImages={currentImages!} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;

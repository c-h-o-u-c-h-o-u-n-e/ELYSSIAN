
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fce4ec]">
      <header className="bg-[#f06292] border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black flex items-center justify-center rounded-sm">
              <i className="fa-solid fa-gem text-[#fce4ec] text-xl"></i>
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase serif text-black">Elysian</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-xs font-bold tracking-[0.2em] uppercase text-black">
            <a href="#" className="underline decoration-2 underline-offset-4">Analyzer</a>
            <a href="#">Studio</a>
            <a href="#">Boutique</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black text-[#fce4ec] py-12 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl tracking-widest uppercase serif mb-4 text-[#f06292] font-black italic">Elysian AI Studio</p>
          <p className="text-xs font-bold tracking-widest opacity-80">EMPOWERING CONFIDENCE THROUGH TECHNICAL EXCELLENCE.</p>
        </div>
      </footer>
    </div>
  );
};

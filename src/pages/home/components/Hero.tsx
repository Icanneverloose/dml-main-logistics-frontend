
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: 'url(https://readdy.ai/api/search-image?query=Modern%20logistics%20warehouse%20with%20orange%20delivery%20trucks%2C%20blue%20industrial%20lighting%2C%20professional%20cargo%20operations%2C%20high-tech%20distribution%20center%20with%20organized%20shipping%20containers%2C%20futuristic%20supply%20chain%20facility&width=1920&height=1080&seq=hero-bg-001&orientation=landscape)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          <div className="text-white animate-fade-in">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-200 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                🚀 Trusted by 10,000+ Businesses Worldwide
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Reliable.</span>
              <span className="block text-blue-400">Fast.</span>
              <span className="block">Global.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed max-w-2xl">
              Experience seamless logistics solutions that connect your business to the world. From express delivery to complex supply chain management, we deliver excellence every time.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">500K+</div>
                <div className="text-sm text-gray-300">Packages Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">99.9%</div>
                <div className="text-sm text-gray-300">On-Time Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">50+</div>
                <div className="text-sm text-gray-300">Countries Served</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/track">
                <button className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                  <i className="ri-search-line mr-2"></i>Track Shipment
                </button>
              </Link>
              <Link to="/auth/signin">
                <button className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                  <i className="ri-add-box-line mr-2"></i>Register Package
                </button>
              </Link>
            </div>
            
            <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-lg font-semibold mb-3">Quick Track</h3>
              <form onSubmit={handleQuickTrack} className="flex gap-3">
                <input 
                  type="text"
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                />
                <button 
                  type="submit"
                  className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base"
                >
                  <i className="ri-search-line"></i>
                </button>
              </form>
            </div>
          </div>
          
          <div className="hidden lg:block animate-slide-up">
            <div className="relative">
              <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white font-medium">Live Tracking</span>
                </div>
                <p className="text-gray-300 text-sm">Package #DML789456 delivered to New York</p>
              </div>
              
              <div className="absolute top-32 left-0 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white font-medium">Express Route</span>
                </div>
                <p className="text-gray-300 text-sm">Los Angeles → Tokyo in 24hrs</p>
              </div>
              
              <div className="absolute top-64 right-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white font-medium">Global Network</span>
                </div>
                <p className="text-gray-300 text-sm">Connected to 50+ countries</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <i className="ri-arrow-down-line text-2xl"></i>
        </div>
      </div>
    </section>
  );
};

export default Hero;
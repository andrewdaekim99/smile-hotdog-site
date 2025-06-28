'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [corndogsVisible, setCorndogsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setCorndogsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#F5F5DC]">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <div className="relative z-20 text-center px-4 flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#1D4E1A]">
            Change the world.
            <br />
            One smile at a time.
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
            <Link href="/order">
              <button className="bg-[#EA9841] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#d88a3a] transition-colors duration-300 shadow-lg">
                Order Online
              </button>
            </Link>
            <Link href="/book">
              <button className="border-2 border-[#1D4E1A] text-[#1D4E1A] px-8 py-4 rounded-full font-semibold hover:bg-[#1D4E1A] hover:text-white transition-colors duration-300">
                Book the Truck
              </button>
            </Link>
          </div>

          {/* Three Corndog Images with Floating Animation */}
          <div className="relative flex items-center justify-center gap-6 md:gap-12" style={{ perspective: '1000px' }}>
            {/* Left Corndog - Floating Animation */}
            <div className={`transform transition-all duration-1000 ease-out ${corndogsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ zIndex: 10 }}>
              <div className="float-animation">
                <Image
                  src="/images/potatodogicon.png"
                  alt="Potato Dog"
                  width={300}
                  height={400}
                  className="w-40 md:w-64 h-auto -rotate-12 md:-rotate-6 drop-shadow-2xl"
                  style={{ 
                    marginRight: '-30px',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
            </div>
            
            {/* Center Corndog - Floating Animation */}
            <div className={`transform transition-all duration-1000 ease-out delay-200 ${corndogsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ zIndex: 20 }}>
              <div className="float-animation">
                <Image
                  src="/images/regcorndogicon.png"
                  alt="Regular Corndog"
                  width={300}
                  height={400}
                  className="w-40 md:w-64 h-auto drop-shadow-2xl"
                  style={{ 
                    marginLeft: '-15px', 
                    marginRight: '-15px',
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4)) drop-shadow(0 15px 30px rgba(0,0,0,0.3))'
                  }}
                />
              </div>
            </div>
            
            {/* Right Corndog - Floating Animation */}
            <div className={`transform transition-all duration-1000 ease-out delay-400 ${corndogsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ zIndex: 10 }}>
              <div className="float-animation">
                <Image
                  src="/images/cheetodogicon.png"
                  alt="Cheeto Dog"
                  width={300}
                  height={400}
                  className="w-40 md:w-64 h-auto rotate-12 md:rotate-6 drop-shadow-2xl"
                  style={{ 
                    marginLeft: '-30px',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {['Good Food', 'Fast Service', 'Cheese Pulls', 'Cold Drinks', 'Hot and Fresh', 'Global Flavor', 'Friendly Workers'].map((feature) => (
              <div key={feature} className="p-6 bg-[#F5F5DC] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#EA9841]/20">
                <p className="font-semibold text-[#1D4E1A]">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1D4E1A]">
            A Blend of Two Cultures.
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto text-[#1D4E1A] mb-16">
            Experience the perfect blend of traditional Korean flavors with modern American cuisine. 
            From our signature bulgogi tacos to kimchi fried rice, every dish tells a story of fusion and innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A]">Made with Rice Flour</h3>
              <p className="text-[#1D4E1A]">Traditional ingredients for authentic taste</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🇰🇷</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A]">Traditional Korean Flavors</h3>
              <p className="text-[#1D4E1A]">Authentic recipes passed down through generations</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A]">Fusion Flavors</h3>
              <p className="text-[#1D4E1A]">Creative combinations that surprise and delight</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

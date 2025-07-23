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
      <section className="relative h-screen flex items-center justify-center bg-[#FFF8E1]">
        <div className="relative z-20 text-center px-4 flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#1D4E1A] font-display">
            Change the world.
            <br />
            One smile at a time.
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
            <Link href="/order">
              <button className="bg-[#EA9841] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#d88a3a] transition-colors duration-300 shadow-lg font-body">
                Order Online
              </button>
            </Link>
            <Link href="/book">
              <button className="border-2 border-[#1D4E1A] text-[#1D4E1A] px-8 py-4 rounded-full font-semibold hover:bg-[#1D4E1A] hover:text-white transition-colors duration-300 font-body">
                Book the Truck
              </button>
            </Link>
          </div>

          {/* Three Corndog Images with Floating Animation */}
          <div className="relative flex items-center justify-center gap-2 md:gap-6 lg:gap-12" style={{ perspective: '1000px' }}>
            {/* Left Corndog - Floating Animation */}
            <div className={`transform transition-all duration-1000 ease-out ${corndogsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ zIndex: 10 }}>
              <div className="float-animation">
                <Image
                  src="/images/regcorndogicon.png"
                  alt="Regular Corndog"
                  width={300}
                  height={400}
                  className="w-36 md:w-56 h-auto -rotate-12 md:-rotate-6 drop-shadow-2xl"
                  style={{ 
                    marginRight: '0px',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
            </div>
            
            {/* Center Corndog - Floating Animation */}
            <div className={`transform transition-all duration-1000 ease-out delay-200 ${corndogsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ zIndex: 20 }}>
              <div className="float-animation">
                <Image
                  src="/images/potatodogicon.png"
                  alt="Potato Dog"
                  width={300}
                  height={400}
                  className="w-44 md:w-72 h-auto drop-shadow-2xl"
                  style={{ 
                    marginLeft: '0px', 
                    marginRight: '0px',
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
                  className="w-36 md:w-56 h-auto rotate-12 md:rotate-6 drop-shadow-2xl"
                  style={{ 
                    marginLeft: '0px',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ramen Wall Section */}
      <section className="py-20 bg-[#FFECB8]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1D4E1A] mb-6 font-display">
                Experience Our Ramen Wall
              </h2>
              <p className="text-xl text-[#1D4E1A] max-w-3xl mx-auto font-body">
                Step into our store and discover our unique Ramen Wall - a curated collection of instant ramen from around the world. 
                Choose your favorite, pay, and enjoy authentic ramen made fresh in our kitchen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Video */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
                  <video 
                    className="w-full h-auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/ramen-wall-poster.jpg"
                  >
                    <source src="/videos/smileRamenVideo.MP4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Instagram Icon Overlay */}
                  <a 
                    href="https://www.instagram.com/reel/DHXNp9Qvl7O/?utm_source=ig_web_copy_link&igsh=MTliZzc3MXpsaGQyeA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <Image
                      src="/images/insta_white.jpeg"
                      alt="Instagram"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-lg shadow-md border border-[#EA9841]/20">
                  <h3 className="text-2xl font-bold text-[#1D4E1A] mb-4 font-display">
                    🌟 What Makes Our Ramen Wall Special
                  </h3>
                  <ul className="space-y-3 text-[#1D4E1A] font-body">
                    <li className="flex items-start">
                      <span className="text-[#EA9841] mr-3 text-lg">•</span>
                      <span>Curated selection of premium instant ramen from Japan, Korea, and beyond</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#EA9841] mr-3 text-lg">•</span>
                      <span>Professional preparation with fresh toppings and authentic ingredients</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#EA9841] mr-3 text-lg">•</span>
                      <span>Customizable spice levels and add-ons to suit your taste</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#EA9841] mr-3 text-lg">•</span>
                      <span>Perfect for a quick, satisfying meal or late-night cravings</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md border border-[#EA9841]/20">
                  <h3 className="text-2xl font-bold text-[#1D4E1A] mb-4 font-display">
                    🍜 How It Works
                  </h3>
                  <div className="space-y-4 text-[#1D4E1A] font-body">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">Choose Your Ramen</p>
                        <p className="text-sm text-gray-600">Browse our wall of premium instant ramen varieties</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Customize Your Order</p>
                        <p className="text-sm text-gray-600">Select spice level and additional toppings</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">Enjoy Fresh Ramen</p>
                        <p className="text-sm text-gray-600">Watch as we prepare your ramen with care and attention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="py-20 bg-[#FFF8E1]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1D4E1A] font-display">
            A Blend of Two Cultures.
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto text-[#1D4E1A] mb-16 font-body">
            Experience the perfect blend of traditional Korean flavors with modern American cuisine. 
            From our signature bulgogi tacos to kimchi fried rice, every dish tells a story of fusion and innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A] font-display">Made with Rice Flour</h3>
              <p className="text-[#1D4E1A] font-body">Traditional ingredients for authentic taste</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🇰🇷</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A] font-display">Traditional Korean Flavors</h3>
              <p className="text-[#1D4E1A] font-body">Authentic recipes passed down through generations</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#EA9841]/20">
              <div className="w-16 h-16 bg-[#EA9841] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D4E1A] font-display">Fusion Flavors</h3>
              <p className="text-[#1D4E1A] font-body">Creative combinations that surprise and delight</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

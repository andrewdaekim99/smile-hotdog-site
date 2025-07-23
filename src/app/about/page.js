export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Header */}
              <div className="bg-[#FFECB8] shadow-md border-b border-[#EA9841]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#2C1810] text-center font-display">About Us</h1>
          <p className="text-[#2C1810] mt-3 text-center text-lg font-body">Our story and mission</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center font-display">Our Mission</h2>
            <p className="text-lg text-[#2C1810] leading-relaxed mb-6 font-body">
              We&apos;re passionate about bringing the authentic flavors of Korea to your neighborhood, 
              with a modern American twist that makes every dish accessible and exciting.
            </p>
            <p className="text-lg text-[#2C1810] leading-relaxed font-body">
              From our humble beginnings as a family recipe collection to serving thousands of 
              happy customers, we&apos;ve stayed true to our roots while embracing innovation.
            </p>
          </section>

          {/* Story Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center font-display">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-semibold mb-4 text-[#2C1810] font-display">The Beginning</h3>
                <p className="text-[#2C1810] mb-4 font-body">
                  Started in 2020, our food truck began as a dream to share our family&apos;s 
                  traditional Korean recipes with the community.
                </p>
                <p className="text-[#2C1810] font-body">
                  What started as weekend pop-ups quickly grew into a beloved local favorite, 
                  known for our authentic flavors and warm service.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-semibold mb-4 text-[#2C1810] font-display">Today</h3>
                <p className="text-[#2C1810] mb-4 font-body">
                  We now serve multiple locations across the city, bringing our unique 
                  Korean-American fusion to food lovers everywhere.
                </p>
                <p className="text-[#2C1810] font-body">
                  Our commitment to quality ingredients and traditional cooking methods 
                  remains at the heart of everything we do.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center font-display">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🌾</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810] font-display">Authenticity</h3>
                <p className="text-[#2C1810] font-body">
                  We stay true to traditional Korean cooking methods and flavors.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810] font-display">Innovation</h3>
                <p className="text-[#2C1810] font-body">
                  We creatively blend Korean and American culinary traditions.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810] font-display">Community</h3>
                <p className="text-[#2C1810] font-body">
                  We build connections through food and shared experiences.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center font-display">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-20 h-20 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold font-display">K</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[#2C1810] font-display">Chef Kim</h3>
                <p className="text-[#8B4513] text-center font-semibold font-body">Head Chef & Founder</p>
                <p className="text-[#2C1810] mt-4 text-center font-body">
                  Bringing 15+ years of culinary experience and family recipes to every dish.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-20 h-20 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold font-display">S</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[#2C1810] font-display">Sarah Park</h3>
                <p className="text-[#8B4513] text-center font-semibold font-body">Operations Manager</p>
                <p className="text-[#2C1810] mt-4 text-center font-body">
                  Ensuring every customer experience is exceptional and memorable.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-[#8B4513]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#2C1810] text-center">About Us</h1>
          <p className="text-[#2C1810] mt-3 text-center text-lg">Our story and mission</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center">Our Mission</h2>
            <p className="text-lg text-[#2C1810] leading-relaxed mb-6">
              We&apos;re passionate about bringing the authentic flavors of Korea to your neighborhood, 
              with a modern American twist that makes every dish accessible and exciting.
            </p>
            <p className="text-lg text-[#2C1810] leading-relaxed">
              From our humble beginnings as a family recipe collection to serving thousands of 
              happy customers, we&apos;ve stayed true to our roots while embracing innovation.
            </p>
          </section>

          {/* Story Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-semibold mb-4 text-[#2C1810]">The Beginning</h3>
                <p className="text-[#2C1810] mb-4">
                  Started in 2020, our food truck began as a dream to share our family&apos;s 
                  traditional Korean recipes with the community.
                </p>
                <p className="text-[#2C1810]">
                  What started as weekend pop-ups quickly grew into a beloved local favorite, 
                  known for our authentic flavors and warm service.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-semibold mb-4 text-[#2C1810]">Today</h3>
                <p className="text-[#2C1810] mb-4">
                  We now serve multiple locations across the city, bringing our unique 
                  Korean-American fusion to food lovers everywhere.
                </p>
                <p className="text-[#2C1810]">
                  Our commitment to quality ingredients and traditional cooking methods 
                  remains at the heart of everything we do.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🌾</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Authenticity</h3>
                <p className="text-[#2C1810]">
                  We stay true to traditional Korean cooking methods and flavors.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Innovation</h3>
                <p className="text-[#2C1810]">
                  We creatively blend Korean and American culinary traditions.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-12 h-12 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C1810]">Community</h3>
                <p className="text-[#2C1810]">
                  We build connections through food and shared experiences.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-bold text-[#2C1810] mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-20 h-20 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">K</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[#2C1810]">Chef Kim</h3>
                <p className="text-[#8B4513] text-center font-semibold">Head Chef & Founder</p>
                <p className="text-[#2C1810] mt-4 text-center">
                  Bringing 15+ years of culinary experience and family recipes to every dish.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <div className="w-20 h-20 bg-[#8B4513] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">S</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[#2C1810]">Sarah Park</h3>
                <p className="text-[#8B4513] text-center font-semibold">Operations Manager</p>
                <p className="text-[#2C1810] mt-4 text-center">
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
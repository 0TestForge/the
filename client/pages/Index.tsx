import { Button } from "@/components/ui/button";
import { SelectGameDialog } from "@/components/SelectGameDialog";
import { TrustedSlider } from "@/components/TrustedSlider";
import { Gamepad2, FileText, Zap, Shield, Plus, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-6 md:pt-10">
        <div className="container py-6 md:py-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight font-['Poppins']">
                <span className="text-white">Buy Your Favorite Items </span>
                <span className="bg-gradient-to-r from-[#3DFF88] to-[#D2FFE3] bg-clip-text text-transparent">
                  Fast, Safe, and Easy
                </span>
                <span className="text-white"> with RoCart!</span>
              </h1>

              <p className="text-base sm:text-lg text-[#C8C8C8] font-['Poppins'] leading-relaxed max-w-2xl mx-auto md:mx-0">
                Rocart the fastest, safest shop for in‑game items with automated delivery. Get what you need in seconds. For items in Murder Mystery 2, Grow a Garden, Blox Fruits, Steal a Brainrot, Blade Ball.
              </p>

              <SelectGameDialog>
                <Button className="group relative w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-[#3DFF88] to-[#259951] hover:from-[#35E67E] hover:to-[#1F8A47] text-white font-bold text-base sm:text-lg rounded-[19px] shadow-lg transition-all duration-300 transform hover:scale-105 mx-auto md:mx-0">
                  <svg
                    className="w-8 h-8 sm:w-9 sm:h-9 mr-3"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M8.4 8.4h11.2l-1.4 8.4H9.8L8.4 8.4zM7 5.6H4.2v1.4H7l2.8 16.8h11.2l2.1-12.6H8.4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="11.2" cy="25.2" r="1.4" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="21" cy="25.2" r="1.4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Start Buying
                </Button>
              </SelectGameDialog>
            </div>

            {/* Right Content - Character with Floating Items */}
            <div className="relative flex justify-center mt-8 md:mt-0">
              {/* Main Character */}
              <div className="relative z-30">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2d5473a4eae9a96f479adef1e288c75b11f25207?width=600"
                  alt="RoCart Character"
                  className="h-72 sm:h-80 md:h-96 lg:h-[28rem] w-auto object-contain"
                />
              </div>

              {/* Floating Product Cards */}
              {/* Chroma Evergun - Bottom Left */}
              <div className="hidden sm:block absolute sm:bottom-2 md:bottom-0 sm:-left-6 md:left-0 z-10 animate-float-slow">
                <div className="w-40 rounded-[17px] border border-[rgba(61,255,136,0.7)] bg-gradient-to-b from-[rgba(6,16,10,0.3)] to-[rgba(44,118,73,0)] p-4 shadow-lg">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/1d3ba1853fbe40adc721dab18a3497262acd4fa1?width=220"
                    alt="Chroma Evergun"
                    className="w-full aspect-square object-contain mb-3"
                  />
                  <h4 className="text-sm font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">CHROMA EVERGUN</h4>
                </div>
              </div>

              {/* Control Fruit - Top Right */}
              <div className="hidden sm:block absolute sm:top-16 md:top-12 sm:-right-6 md:right-0 z-10 animate-float-slow">
                <div className="w-40 rounded-[17px] border border-[rgba(61,200,255,0.7)] bg-gradient-to-b from-[rgba(6,12,16,0.3)] to-[rgba(44,86,118,0)] p-4 shadow-lg">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f616d7e591651484d66301e9a475d8d1f74f2ef3?width=220"
                    alt="Control Fruit"
                    className="w-full aspect-square object-contain mb-3"
                  />
                  <h4 className="text-sm font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">CONTROL FRUIT</h4>
                </div>
              </div>

              {/* Gold Disco Bee - Top Left */}
              <div className="hidden sm:block absolute sm:top-2 md:top-0 sm:-left-10 md:left-10 lg:left-16 z-10 animate-float-slow" style={{ animationDuration: '2s' }}>
                <div className="w-40 rounded-[17px] border border-[rgba(255,236,61,0.7)] bg-gradient-to-b from-[rgba(6,16,10,0.3)] to-[rgba(118,113,44,0)] p-4 shadow-lg">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f65edc58a24018d8cf4807e1f09eb0d6efcf2a4c?width=220"
                    alt="Gold Disco Bee"
                    className="w-full aspect-square object-contain mb-3"
                  />
                  <h4 className="text-sm font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">GOLD DISCO BEE</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="relative pt-8 md:pt-10 pb-20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern grid-fade-center opacity-30"></div>
        </div>
        <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent mb-4">
            Trending Now
          </h2>
          <p className="text-[#C8C8C8] font-['Poppins'] text-lg">
            Items gaining popularity right now. Most users are active on their catalog pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Grow A Garden */}
          <div className="bg-[#030804] border border-[rgba(226,226,226,0.24)] rounded-[42px] overflow-hidden relative">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/0bfbfe4309dcd4d9dd1d11bb4fcda3effc2fc491?width=60"
                  alt="Grow A Garden"
                  className="w-7 h-6 rounded-lg object-contain"
                />
                <h3 className="text-lg font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                  Grow A Garden
                </h3>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 items-stretch">
                {/* Raccoon */}
                <div className="border border-[rgba(61,255,136,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(6,16,10,0.3)] to-[rgba(44,118,73,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/a8d322d086e3188977389ed0ee40f79877937381?width=210"
                    alt="Raccoon"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    RACCOON
                  </h4>
                  <p className="text-[#3DFF88] font-['Poppins'] text-base md:text-lg font-bold">$15</p>
                </div>

                {/* Queen Bee */}
                <div className="border border-[rgba(255,236,61,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(6,16,10,0.3)] to-[rgba(118,113,44,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/2f2afed2e055df8521e74d60f9e19ccbcfcd3bb4?width=228"
                    alt="Queen Bee"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    QUEEN BEE
                  </h4>
                  <p className="text-[#FFD801] font-['Poppins'] text-base md:text-lg font-bold">$10</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative bg-black rounded-b-[42px] p-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/e83ad52b3af76d53e616545f55fca5259d49f20a?width=818"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover object-bottom opacity-14 rounded-b-[42px]"
                style={{ objectPosition: 'center bottom' }}
              />
              <Button className="relative w-fit mx-auto bg-gradient-to-r from-[#06100A] to-[#2C764A] border border-[#9B9B9B] text-white font-bold text-sm font-['Poppins'] px-6 py-3 rounded-[15px] hover:opacity-80">
                Visit Market
              </Button>
            </div>
          </div>

          {/* MM2 */}
          <div className="bg-[#030804] border border-[rgba(226,226,226,0.24)] rounded-[42px] overflow-hidden relative">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7b67eb096da8c0f6b066ed252917aceb0883ed05?width=60"
                  alt="MM2"
                  className="w-7 h-6 rounded-lg object-contain"
                />
                <h3 className="text-lg font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                  MM2
                </h3>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 items-stretch">
                {/* Raccoon */}
                <div className="border border-[rgba(255,61,61,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(16,6,6,0.3)] to-[rgba(151,41,41,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/a2c4d8ec1d47f83380d0b7215b664c41fd442309?width=240"
                    alt="Raccoon"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    RACCOON
                  </h4>
                  <p className="text-[#FF3D3D] font-['Poppins'] text-base md:text-lg font-bold">$15</p>
                </div>

                {/* Gingerscope */}
                <div className="border border-[rgba(255,161,61,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(16,12,6,0.3)] to-[rgba(118,82,44,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/b3b889b94a7a2378bbb9a4b2c6b20251b3bf81b7?width=330"
                    alt="Gingerscope"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    GINGERSCOPE ...
                  </h4>
                  <p className="text-[#BE8832] font-['Poppins'] text-base md:text-lg font-bold">$10</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative bg-black rounded-b-[42px] p-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/d6dc5ae358be68a32fd568a01495e861fe5571e9?width=976"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover object-bottom opacity-14 rounded-b-[42px]"
                style={{ objectPosition: 'center bottom' }}
              />
              <Button className="relative w-fit mx-auto bg-gradient-to-r from-[#100706] to-[#911313] border border-[#9B9B9B] text-white font-bold text-sm font-['Poppins'] px-6 py-3 rounded-[15px] hover:opacity-80">
                Visit Market
              </Button>
            </div>
          </div>

          {/* Steal A Brainrot */}
          <div className="bg-[#030804] border border-[rgba(226,226,226,0.24)] rounded-[42px] overflow-hidden relative">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/73e26c8314f2d8113b8c91a73453a67798833b6e?width=62"
                  alt="Steal A Brainrot"
                  className="w-7 h-6 rounded-lg object-contain"
                />
                <h3 className="text-lg font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                  Steal A brainrot
                </h3>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 items-stretch">
                {/* Raccoon */}
                <div className="border border-[rgba(255,61,242,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(12,6,16,0.3)] to-[rgba(116,44,118,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/56b5464d1f54b0feef75732a2945472739525a73?width=228"
                    alt="Raccoon"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    RACCOON
                  </h4>
                  <p className="text-[#DD00FF] font-['Poppins'] text-base md:text-lg font-bold">$15</p>
                </div>

                {/* Queen Bee */}
                <div className="border border-[rgba(255,61,197,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(16,6,13,0.3)] to-[rgba(118,44,96,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/40b2ef3a442cb297fab3cb96a11523e8caaf79bb?width=238"
                    alt="Queen Bee"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    QUEEN BEE
                  </h4>
                  <p className="text-[#FF38F2] font-['Poppins'] text-base md:text-lg font-bold">$10</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative bg-black rounded-b-[42px] p-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/3db3a465061eefe3afcbf1a865ba204a9491afaf?width=1208"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover object-bottom opacity-14 rounded-b-[42px]"
                style={{ objectPosition: 'center bottom' }}
              />
              <Button className="relative w-fit mx-auto bg-gradient-to-r from-[#0D0610] to-[#6C2C76] border border-[#9B9B9B] text-white font-bold text-sm font-['Poppins'] px-6 py-3 rounded-[15px] hover:opacity-80">
                Visit Market
              </Button>
            </div>
          </div>

          {/* Adopt Me */}
          <div className="bg-[#030804] border border-[rgba(226,226,226,0.24)] rounded-[42px] overflow-hidden relative">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/eb504256c1b8d46c2959922a55e00fb56b3f2ed7?width=60"
                  alt="Adopt Me"
                  className="w-7 h-6 rounded-lg object-contain"
                />
                <h3 className="text-lg font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                  Adopt Me
                </h3>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 items-stretch">
                {/* Raccoon */}
                <div className="border border-[rgba(61,200,255,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(6,12,16,0.3)] to-[rgba(44,86,118,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/3355d3422b62c9bb46a051e74a6141dd537b7963?width=196"
                    alt="Raccoon"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    RACCOON
                  </h4>
                  <p className="text-[#32A6FF] font-['Poppins'] text-base md:text-lg font-bold">$15</p>
                </div>

                {/* Queen Bee */}
                <div className="border border-[rgba(255,255,255,0.7)] rounded-[17px] bg-gradient-to-b from-[rgba(24,24,24,0.3)] to-[rgba(164,164,164,0)] p-4 h-56 md:h-60 flex flex-col justify-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d2b1b1541445605a61648235d48017d22da0db63?width=218"
                    alt="Queen Bee"
                    className="w-full max-h-32 md:max-h-36 object-contain mb-2 mt-6 md:mt-8"
                  />
                  <h4 className="mt-auto text-sm md:text-base font-bold font-['Poppins'] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
                    QUEEN BEE
                  </h4>
                  <p className="text-white font-['Poppins'] text-base md:text-lg font-bold">$10</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative bg-black rounded-b-[42px] p-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/856ee8e4f1a6ea7724ddc68eab43ebf33134d6af?width=944"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover object-bottom opacity-14 rounded-b-[42px]"
                style={{ objectPosition: 'center bottom' }}
              />
              <Button className="relative w-fit mx-auto bg-gradient-to-r from-[#060D10] to-[#2886CD] border border-[#9B9B9B] text-white font-bold text-sm font-['Poppins'] px-6 py-3 rounded-[15px] hover:opacity-80">
                Visit Market
              </Button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Trusted Buyers Section */}
      <section className="py-16 md:py-20 bg-[#030804]">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins'] mb-4">
                <span className="text-white">Trusted with by </span>
                <span className="bg-gradient-to-r from-[#3DFF88] to-[#80FFB1] bg-clip-text text-transparent">
                  5,000+ Happy Buyers
                </span>
              </h2>
              <p className="text-[#999] font-['Poppins'] text-sm md:text-base max-w-4xl">
                Join thousands of happy buyers who trust Rocart for their in-game items! From casual players to serious collectors, our customers keep coming back for quality and reliability. See some of our amazing supporters below:
              </p>
            </div>

            {/* Testimonials Slider */}
            <TrustedSlider />
          </div>
        </div>
      </section>

      {/* Why Choose Rocart */}
      <section className="relative py-16 md:py-20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern grid-fade-center opacity-30"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins'] mb-4">
                <span className="text-white">Why Choose </span>
                <span className="bg-gradient-to-r from-[#3DFF88] to-[#80FFB1] bg-clip-text text-transparent">
                  Rocart
                </span>
              </h2>
              <p className="text-[#999] font-['Poppins'] text-sm md:text-base max-w-4xl mx-auto">
                Enjoy lightning - fast delivery, unbeatable prices, and a safe, secure shopping experience for all your favorite Roblox item. Our dedicated support team is always here to help!
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 - Green */}
              <div className="relative bg-[#0E2514] border border-[#3DFF88] rounded-[26px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-['Poppins'] text-sm font-bold">Fast & Reliable</h3>
                  <div className="relative">
                    <svg className="w-5 h-5 text-[#3DFF88]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#D9D9D9] font-['Poppins'] text-xs leading-relaxed">
                  Choose a game to get started popular options include MM2, Toilet Tower Defence, Adopt Me....
                </p>
              </div>

              {/* Card 2 - Blue */}
              <div className="relative bg-[#0F1827] border border-[#32A6FF] rounded-[26px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-['Poppins'] text-sm font-bold">Fast & Reliable</h3>
                  <div className="relative">
                    <svg className="w-5 h-5 text-[#32A6FF]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#D9D9D9] font-['Poppins'] text-xs leading-relaxed">
                  Choose a game to get started popular options include MM2, Toilet Tower Defence, Adopt Me....
                </p>
              </div>

              {/* Card 3 - Purple */}
              <div className="relative bg-[#1B1028] border border-[#D026FF] rounded-[26px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-['Poppins'] text-sm font-bold">Fast & Reliable</h3>
                  <div className="relative">
                    <svg className="w-5 h-5 text-[#D026FF]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#D9D9D9] font-['Poppins'] text-xs leading-relaxed">
                  Choose a game to get started popular options include MM2, Toilet Tower Defence, Adopt Me....
                </p>
              </div>

              {/* Card 4 - Red */}
              <div className="relative bg-[#250E0E] border border-[#FF3D3D] rounded-[26px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-['Poppins'] text-sm font-bold">Fast & Reliable</h3>
                  <div className="relative">
                    <svg className="w-5 h-5 text-[#FF3D3D]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#D9D9D9] font-['Poppins'] text-xs leading-relaxed">
                  Choose a game to get started popular options include MM2, Toilet Tower Defence, Adopt Me....
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-16 md:py-24">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern grid-fade-center opacity-30"></div>
        </div>
        <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3DFF88] to-[#80FFB1] bg-clip-text text-transparent">
            How <span className="text-white">Rocart</span> <span className="text-white">Works</span>
          </h2>
          <p className="mt-4 text-sm text-[#999999] max-w-4xl mx-auto">
            Buying Items on RoCart is designed to be simple, fast, and reliable! Here's how you can get started
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Choose Your Game */}
          <div className="rounded-[26px] border border-[#D13BFF] bg-[#1B1028] p-6">
            <div className="flex items-start gap-4">
              <div className="w-[30px] h-[30px] flex items-center justify-center">
                <Gamepad2 className="w-[30px] h-[30px] text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-white mb-2">Choose Your Game</h3>
                <p className="text-[11px] text-[#D9D9D9] opacity-69">
                  Begin by selecting the game youre interested in such as Murder Mystery 2
                </p>
              </div>
            </div>
          </div>

          {/* Follow the Tutorial */}
          <div className="rounded-[26px] border border-[#32A6FF] bg-[#0F1827] p-6">
            <div className="flex items-start gap-4">
              <div className="w-[30px] h-[30px] flex items-center justify-center">
                <FileText className="w-[30px] h-[30px] text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-white mb-2">Follow the Tutorial</h3>
                <p className="text-[11px] text-[#D9D9D9] opacity-69">
                  Begin by selecting the game youre interested in such as Murder Mystery 2
                </p>
              </div>
            </div>
          </div>

          {/* Instant Delivery */}
          <div className="rounded-[26px] border border-[#3DFF88] bg-[#0E2514] p-6">
            <div className="flex items-start gap-4">
              <div className="w-[30px] h-[30px] flex items-center justify-center">
                <Zap className="w-[30px] h-[30px] text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-white mb-2">Instant Delivery</h3>
                <p className="text-[11px] text-[#D9D9D9] opacity-69">
                  Begin by selecting the game youre interested in such as Murder Mystery 2
                </p>
              </div>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="rounded-[26px] border border-[#FF3D3D] bg-[#250E0E] p-6">
            <div className="flex items-start gap-4">
              <div className="w-[30px] h-[30px] flex items-center justify-center">
                <Shield className="w-[30px] h-[30px] text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-white mb-2">24/7 support</h3>
                <p className="text-[11px] text-[#D9D9D9] opacity-69">
                  Begin by selecting the game youre interested in such as Murder Mystery 2
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="relative py-16 md:py-24">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern grid-fade-center opacity-30"></div>
        </div>
        <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-white">Have </span>
            <span className="text-[#3DFF88]">Questions? We Got You!</span>
          </h2>
          <p className="mt-4 text-sm text-[#999999]">Got questions? We've got answers!</p>
        </div>

        <Accordion type="multiple" className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
          {[
            {
              q: "Is Rocart a trusted place to buy game items?",
              a:
                "Absolutely. RoCart partners with vetted sellers and uses secure payment processing. Every purchase is protected and monitored, and our automated systems ensure that orders are fulfilled quickly and safely. If anything goes wrong, our support team is available 24/7 to help resolve it.",
            },
            {
              q: "What if I don't receive my items after purchasing?",
              a:
                "In the rare case your items don’t arrive, please contact support with your order ID. We’ll immediately investigate delivery logs, verify your account details, and either complete the delivery or issue a prompt refund according to our buyer protection policy.",
            },
            {
              q: "What is your refund policy?",
              a:
                "If an order cannot be fulfilled or there is a verified issue with the item delivered, you are eligible for a refund. Open a ticket through live chat or email within 24–48 hours of purchase, include your order ID and any evidence (screenshots, usernames), and our team will process it swiftly.",
            },
            {
              q: "Can I trade my in-game items for items on Rocart?",
              a:
                "Direct item-for-item trades are not supported at this time. However, you can list items for sale (where supported) and use the balance or proceeds to purchase other items across supported games.",
            },
            {
              q: "How do I receive my purchased items?",
              a:
                "Most items are delivered automatically to your account within minutes of successful payment. Some items may require you to accept a friend request or join a specific game/server; if so, we’ll guide you with clear steps inside your order page and via chat.",
            },
            {
              q: "Can I get free items?",
              a:
                "We regularly run promotions, giveaways, and loyalty rewards. Follow our social channels and check the site banner for active events. Joining our newsletter is the best way to be notified first.",
            },
          ].map((item, idx) => (
            <AccordionItem key={item.q} value={`faq-${idx}`} className="border-0">
              <div className="rounded-[20px] border border-[#D3D3D3]/33 bg-[#0E2514]">
                <AccordionTrigger className="group px-6 [&>svg]:hidden">
                  <span className="text-white font-semibold text-base md:text-lg text-left pr-4">{item.q}</span>
                  <div className="ml-4 w-12 h-12 shrink-0 rounded-lg bg-gradient-to-b from-[#3DFF88]/50 to-[#259951]/50 opacity-50 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white transition-transform duration-200 group-data-[state=open]:rotate-45" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-sm text-[#D9D9D9]">
                  {item.a}
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </section>
    </div>
  );
}

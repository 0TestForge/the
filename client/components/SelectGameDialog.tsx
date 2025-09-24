import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function SelectGameDialog({ children }: { children: React.ReactNode }) {
  const games = [
    {
      id: "blox",
      name: "Blox Fruits",
      route: "/blox",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/a83e8cf830b37047dd9f0d715ef24fd11f3a3596?width=162",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/a83e8cf830b37047dd9f0d715ef24fd11f3a3596?width=1600",
      titleGradient: "from-[#41A7FF] to-[#D9EDFF]",
      cardGradient: "from-[rgba(32,136,255,0)] via-[rgba(32,136,255,0)] to-[rgba(19,82,153,0.71)]",
      borderColor: "#3DFF88"
    },
    {
      id: "mm",
      name: "Murder Mystery 2",
      route: "/mm",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/e50bd3f636f6654ce1a96ac658d0446cf4d028eb?width=162",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/e50bd3f636f6654ce1a96ac658d0446cf4d028eb?width=1600",
      titleGradient: "from-[#E90303] to-[#FFA3A3]",
      cardGradient: "from-[rgba(255,32,32,0)] via-[rgba(255,32,32,0)] to-[rgba(153,19,19,0.71)]",
      borderColor: "#3DFF88"
    },
    {
      id: "adopt",
      name: "Adopt Me", 
      route: "/adopt",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/fc4be1bfcc842ba1435f76c9ad21707728b0ce9f?width=162",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/fc4be1bfcc842ba1435f76c9ad21707728b0ce9f?width=1600",
      titleGradient: "from-[#F9FF41] to-[#D9EDFF]",
      cardGradient: "from-[rgba(255,248,32,0)] via-[rgba(255,248,32,0)] to-[rgba(153,149,19,0.71)]",
      borderColor: "#3DFF88"
    },
    {
      id: "blade",
      name: "Blade Ball",
      route: "/blade",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/2b828c07e50b0f499652f749c547673538736625?width=162",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/2b828c07e50b0f499652f749c547673538736625?width=1600",
      titleGradient: "from-[#FF41A3] to-[#D9EDFF]",
      cardGradient: "from-[rgba(255,32,225,0)] via-[rgba(255,32,225,0)] to-[rgba(153,19,128,0.71)]",
      borderColor: "#3DFF88"
    },
    {
      id: "brainrot",
      name: "Steal A brainrot",
      route: "/brainrot",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/1f3b2e2efaba03d53cb55c6fd4327d740f27ec84?width=162",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/1f3b2e2efaba03d53cb55c6fd4327d740f27ec84?width=1600",
      titleGradient: "from-[#A641FF] to-[#D9EDFF]",
      cardGradient: "from-[rgba(218,32,255,0)] via-[rgba(218,32,255,0)] to-[rgba(95,19,153,0.71)]",
      borderColor: "#3DFF88"
    },
    {
      id: "grow",
      name: "Grow A garden",
      route: "/grow",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/71705b2787aa8f62b80ef3a1b35fd97d11c8dc1b?width=172",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/71705b2787aa8f62b80ef3a1b35fd97d11c8dc1b?width=1600",
      titleGradient: "from-[#3DFF88] to-[#D9EDFF]",
      cardGradient: "from-[rgba(61,255,136,0)] via-[rgba(61,255,136,0)] to-[rgba(19,153,39,0.71)]",
      borderColor: "#3DFF88"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl p-0 border-0 bg-transparent shadow-none max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
        <div
          className="relative w-full rounded-[2.5rem] border border-[#3DFF88] overflow-auto dialog-scroll max-h-[85vh] sm:max-h-[90vh]"
          style={{
            background: "linear-gradient(180deg, #06100A 0%, #031C0D 100%)"
          }}
        >
          {/* Background overlay image */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/87cf234f3a0741dabd5191a72432d412a139eccf?width=3118"
              alt=""
              className="w-full h-full object-cover opacity-45 blur-[1px] md:blur-sm"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 md:p-12">
            {/* Title */}
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold font-['Poppins'] mb-8 sm:mb-12 bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent">
              CHOOSE A GAME
            </h2>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              {games.map((game) => (
                <button
                  key={game.id}
                  className="group relative w-full aspect-[351/243] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] border border-[#3DFF88] bg-[#030904] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#3DFF88]/20"
                  onClick={() => {
                    const e = new CustomEvent("game:selected", { detail: game });
                    window.dispatchEvent(e);
                    window.location.assign(game.route);
                  }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src={game.backgroundImage}
                      srcSet={`${game.backgroundImage.replace('width=1600','width=800')} 800w, ${game.backgroundImage} 1600w`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover opacity-60 brightness-90 blur-[1px] md:blur-[1.5px] scale-105"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.45)_70%)]" />
                  </div>

                  {/* Gradient overlay */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-b ${game.cardGradient} rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 sm:p-6">
                    {/* Game icon */}
                    <div className="w-12 h-9 sm:w-16 sm:h-12 md:w-20 md:h-14 mb-3 sm:mb-4 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-[#D9D9D9] flex items-center justify-center">
                      <img
                        src={game.icon}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Game title */}
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold font-['Poppins'] mb-1 sm:mb-2 bg-gradient-to-r ${game.titleGradient} bg-clip-text text-transparent text-center`}>
                      {game.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-white text-xs sm:text-sm md:text-base font-semibold font-['Poppins'] text-center">
                      Tap to view Items
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Logo at bottom */}
            <div className="flex justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/b2165c0975c7a665f02be2422107fc3c07645a0b?width=244"
                alt="RoCart"
                className="h-6 sm:h-8 w-auto"
              />
            </div>

            {/* Bottom decorative lines */}
            <div className="flex justify-center mt-4 relative">
              <div className="absolute left-0 top-0 w-1/3 h-0.5 rounded-l-full bg-gradient-to-r from-transparent to-white opacity-30" />
              <div className="absolute right-0 top-0 w-1/3 h-0.5 rounded-r-full bg-gradient-to-l from-transparent to-white opacity-30" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

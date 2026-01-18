import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-24">
      {/* Main typography content */}
      <div className="relative z-10 max-w-5xl">
        {/* Artist name - large typography */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="font-serif text-[clamp(4rem,15vw,12rem)] leading-[0.85] text-primary tracking-tight">
            Kwon
          </h1>
          <h1 className="font-serif text-[clamp(4rem,15vw,12rem)] leading-[0.85] text-primary tracking-tight -mt-[7px] md:-mt-[15px]">
            GyoDong
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-2xl md:text-3xl lg:text-4xl text-muted-foreground mt-8 md:mt-12 max-w-xl leading-relaxed"
        >
          Contemporary
          <br />
          Acrylic
          <br />
          Paintings
        </motion.p>
      </div>

      {/* Floating artwork banner - right side */}
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 hidden lg:block pointer-events-none"
      >
        <div className="relative w-full h-full" style={{ backgroundColor: "transparent" }}>
          {/* IMK_HANNAM Banner Image - Supabase Storage */}
          <img
            src="https://gotdcbpobucrspqwyqgb.supabase.co/storage/v1/object/public/artworks/banner_0.png"
            alt="IMK Hannam Atelier"
            className="w-full h-full object-contain object-center"
            style={{
              filter: "brightness(0.95) contrast(1.05)",
              mixBlendMode: "normal",
            }}
            onError={(e) => {
              // 이미지 로드 실패 시 gradient fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = "w-full h-full bg-gradient-to-br from-muted to-secondary rounded-l-3xl opacity-60";
                parent.appendChild(fallbackDiv);
              }
            }}
          />
        </div>
      </motion.div>

      {/* Exhibition badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-12 left-8 md:left-16 lg:left-24"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-primary" />
          <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
            March 2025 Solo Exhibition
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 right-8 md:right-16 lg:right-24 hidden md:flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent"
        />
        <span className="text-xs tracking-widest uppercase text-muted-foreground rotate-90 origin-center translate-y-6">
          Scroll
        </span>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
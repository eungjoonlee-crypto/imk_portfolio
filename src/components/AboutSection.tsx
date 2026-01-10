import { motion } from "framer-motion";
import { Instagram, Mail, MapPin } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-8 md:px-16 lg:px-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Artist image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-serif text-4xl text-primary">A</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Artist Portrait</p>
                </div>
              </div>
            </div>

            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:right-6 bg-background rounded-xl p-5 shadow-lg"
            >
              <span className="font-serif text-3xl text-primary block">10+</span>
              <span className="text-sm text-muted-foreground">Years of Art</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary" />
              <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                The Artist
              </span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-8">
              Aurora Chen
            </h2>
            
            <div className="space-y-5 text-muted-foreground leading-relaxed mb-10">
              <p>
                Aurora Chen is a contemporary artist whose work explores the intersection of emotion and color through bold acrylic paintings. With over a decade of experience, her pieces have been featured in galleries across New York, London, and Tokyo.
              </p>
              <p>
                Her signature style combines thick impasto techniques with fluid color transitions, creating works that seem to glow from within. Each painting is a meditation on the human experience, inviting viewers to find their own meaning in the layers of pigment and light.
              </p>
            </div>

            {/* Contact/Social links */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
              >
                <Instagram className="w-5 h-5" />
                <span>@aurora.studio</span>
              </motion.a>
              
              <motion.a
                href="mailto:hello@aurorastudio.art"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-secondary/50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </motion.a>
            </div>

            {/* Location */}
            <div className="mt-8 flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Based in New York City</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
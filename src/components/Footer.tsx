import { motion } from "framer-motion";
import { Instagram, Mail, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="py-20 px-8 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Logo & tagline */}
          <div>
            <a href="#" className="font-serif text-2xl text-foreground block mb-3">
              Kwon GyoDong
            </a>
            <p className="text-sm text-muted-foreground max-w-xs">
              Contemporary acrylic art that captures emotion through color and texture.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            <motion.a
              href="https://www.instagram.com/imkhairshop?igsh=MWlsNmc5aTBvdXNtdA=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="mailto:imkhannam@gmail.com"
              whileHover={{ y: -3 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Top</span>
            </motion.button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2026 IMKEI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
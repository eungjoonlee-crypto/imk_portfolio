import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ArtworkCardProps {
  id?: string;
  image: string;
  title: string;
  year: string;
  medium: string;
  index: number;
}

const ArtworkCard = ({ id, image, title, year, medium, index }: ArtworkCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 20);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) {
      toast.success("Added to your favorites!");
    }
  };

  const handleDM = () => {
    window.open("https://instagram.com/direct/inbox", "_blank");
    toast.info("Opening Instagram DM...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="hover-lift rounded-lg overflow-hidden bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <div className="flex gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isLiked
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/90 text-foreground hover:bg-background"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDM}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/90 text-foreground hover:bg-background transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Card info */}
        <div className="p-5">
          <h3 className="font-serif text-xl text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {medium}{year ? `, ${year}` : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;

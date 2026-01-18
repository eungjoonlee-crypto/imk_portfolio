import { motion } from "framer-motion";

interface ArtworkCardProps {
  id?: string;
  image: string;
  title: string;
  year: string;
  medium: string;
  index: number;
}

const ArtworkCard = ({ id, image, title, year, medium, index }: ArtworkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="overflow-hidden bg-card break-inside-avoid mb-8 lg:mb-10" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Image container */}
        <div className="relative w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Card info */}
        <div className="p-5">
          <h3 className="text-xl text-foreground mb-1" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{title}</h3>
          <p className="text-sm text-muted-foreground">
            {medium}{year ? `, ${year}` : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;

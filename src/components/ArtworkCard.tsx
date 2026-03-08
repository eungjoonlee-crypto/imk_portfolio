import { motion } from "framer-motion";

interface ArtworkCardProps {
  id?: string;
  image: string;
  title: string;
  year: string;
  medium: string;
  index: number;
  onClick?: () => void;
}

const ArtworkCard = ({ image, title, year, medium, index, onClick }: ArtworkCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick?.())}
      className="relative z-10 overflow-hidden bg-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow hover:shadow-[var(--shadow-hover)] [touch-action:manipulation]"
      style={{ boxShadow: "var(--shadow-card)" }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover pointer-events-none"
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl text-foreground mb-1" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {medium}
          {year ? `, ${year}` : ""}
        </p>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;

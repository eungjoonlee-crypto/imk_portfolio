import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import HeroBanner from "@/components/HeroBanner";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Aurora Studio | Contemporary Acrylic Art by Aurora Chen</title>
        <meta
          name="description"
          content="Explore the vibrant acrylic paintings of Aurora Chen. Experience bold colors and emotional depth in contemporary art. March 2024 Solo Exhibition: Chromatic Dreams."
        />
        <meta name="keywords" content="acrylic paintings, contemporary art, Aurora Chen, art gallery, abstract art, solo exhibition" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroBanner />
          <GallerySection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

import Navbar from "@/components/layout/Navbar/Navbar.jsx";
import Footer from "@/components/layout/Footer/Footer.jsx";

const MarketingLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default MarketingLayout;

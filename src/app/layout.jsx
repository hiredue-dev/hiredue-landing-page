import Navbar from "@/components/layout/Navbar/Navbar.jsx";
import Footer from "@/components/layout/Footer/Footer.jsx";
import Providers from "./providers.jsx";
import "@/design-system/index.css";

export const metadata = {
  title: "HireDue",
  description: "HireDue — your AI-powered job application platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

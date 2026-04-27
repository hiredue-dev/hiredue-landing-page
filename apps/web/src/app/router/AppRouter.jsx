import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Home/HomePage.jsx";
import AboutPage from "@/pages/About/AboutPage.jsx";
import CareersPage from "@/pages/Careers/CareersPage.jsx";
import ContactPage from "@/pages/Contact/ContactPage.jsx";
import PrivacyPage from "@/pages/Privacy/PrivacyPage.jsx";
import TermsPage from "@/pages/Terms/TermsPage.jsx";
import ChangelogPage from "@/pages/Changelog/ChangelogPage.jsx";
import NotFoundPage from "@/pages/NotFound/NotFoundPage.jsx";
import MarketingLayout from "../layouts/MarketingLayout.jsx";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <MarketingLayout>
            <HomePage />
          </MarketingLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MarketingLayout>
            <AboutPage />
          </MarketingLayout>
        }
      />
      <Route
        path="/career"
        element={
          <MarketingLayout>
            <CareersPage />
          </MarketingLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MarketingLayout>
            <ContactPage />
          </MarketingLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <MarketingLayout>
            <PrivacyPage />
          </MarketingLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <MarketingLayout>
            <TermsPage />
          </MarketingLayout>
        }
      />
      <Route
        path="/changelog"
        element={
          <MarketingLayout>
            <ChangelogPage />
          </MarketingLayout>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;

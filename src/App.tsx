import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useCartSync } from "@/hooks/useCartSync";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";

const Products = lazy(() => import("./pages/Products").then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import("./pages/Products").then(m => ({ default: m.ProductDetail })));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Lifestyle = lazy(() => import("./pages/Lifestyle"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminFAQs = lazy(() => import("./pages/admin/AdminFAQs"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminBundles = lazy(() => import("./pages/admin/AdminBundles"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns"));
const CategoryPage = lazy(() => import("./pages/categories/CategoryPage"));

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/high-protein-meals" element={<CategoryPage categoryKey="high-protein-meals" />} />
        <Route path="/plant-based-meals" element={<CategoryPage categoryKey="plant-based-meals" />} />
        <Route path="/healthy-instant-meals" element={<CategoryPage categoryKey="healthy-instant-meals" />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="bundles" element={<AdminBundles />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

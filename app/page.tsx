"use client"
import Header from './components/Header'
import Footer from "./components/Footer";
import HeroFresh from "./components/HeroFresh";
import FeatureGrid from "./components/FeatureGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main>
        <HeroFresh />
        <FeatureGrid />

        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h3 className="text-lg font-semibold">Ready to get started?</h3>
            <p className="mt-3 text-gray-600">Login to continue and access your workspace.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";

export default function HeroFresh() {
  return (
    <section className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Modern collaboration for teams and clients</h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">A focused messaging workspace, project previews, and request management — built for agencies, freelancers, and internal teams.</p>

            <div className="mt-8 flex items-center gap-4">
              <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white text-sm font-medium hover:bg-indigo-500">Login</Link>
              <a href="#features" className="text-sm text-gray-600 hover:underline">Explore features</a>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <div className="w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <div className="relative bg-gradient-to-tr from-white via-gray-50 to-white p-6">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
                  alt="Team collaborating around a laptop"
                  className="w-full h-72 object-cover rounded-lg"
                  loading="lazy"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

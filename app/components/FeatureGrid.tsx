export default function FeatureGrid() {
  const features = [
    { title: "Unified Messaging", desc: "Two-pane conversations with role-aware contacts and fast search." },
    { title: "Project Previews", desc: "Share project snapshots and assign employees or clients quickly." },
    { title: "Service Requests", desc: "Track, comment and resolve service requests from clients." },
    { title: "Role Permissions", desc: "Admin/Employee/Client roles with tailored views and controls." },
  ];

  return (
    <section id="features" className="bg-gradient-to-b from-white via-indigo-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">What you can do</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Everything you need to run client work, centralize conversations, and keep teams aligned.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="relative overflow-hidden rounded-2xl p-6">
              <div className={`absolute inset-0 transform -translate-y-6 scale-110 blur-3xl opacity-60 ${i % 2 === 0 ? 'bg-gradient-to-tr from-indigo-300 to-sky-200' : 'bg-gradient-to-tr from-pink-300 to-rose-200'}`}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 h-full ring-1 ring-white/60">
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

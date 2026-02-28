"use client"
import { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import Input from "../components/ui/Input";
import  Button from "../components/ui/Button";
import { Toaster, toast } from 'sonner';
import Profile from "../components/Profile";
import Messages from "../components/Messages";

interface Project {
  id: string;
  name: string;
  status: string;
  client?: { name: string };
}

type View = "dashboard" | "profile" | "projects" | "messages";

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/employee/projects");
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message || "Unable to load");
        setProjects(payload.data || []);
        setUserName(payload.userName)
      } catch (err: any) {
        console.error(err);
        const msg = err.message || "Error fetching projects";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  console.log(userName)
  const total = projects.length;
  const delivered = projects.filter((p) => p.status === "DELIVERED").length;
  const inProgress = total - delivered;

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
              <h1 className="text-2xl font-bold mb-4">Hi, {userName}</h1>

          <div className="flex text-gray-700 space-x-4 mb-6">
            <div className="p-4 bg-white rounded shadow w-1/3">
              <span className="text-sm text-gray-500">Total projects</span>
              <p className="text-xl font-semibold">{total}</p>
            </div>
            <div className="p-4 bg-white rounded shadow w-1/3">
              <span className="text-sm text-gray-500">Delivered</span>
              <p className="text-xl font-semibold">{delivered}</p>
            </div>
            <div className="p-4 bg-white rounded shadow w-1/3">
              <span className="text-sm text-gray-500">In progress</span>
              <p className="text-xl font-semibold">{inProgress}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Recent projects</h2>
            {projects.length === 0 && <p>No projects found.</p>}
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="p-3 bg-white rounded mb-2 shadow">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">{p.client?.name || "No client"}</p>
                <p className="text-sm">{p.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/employee/projects");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setProjects(data.data || []);
      } catch (err: any) {
        const msg = err.message || "Error";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function changeStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/employee/projects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const d = await res.json();
      if(!res.ok) {
        throw new Error(d.message || "Failed");
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      toast.success(d.message);
    } catch (e: any) {
      const msg = e.message || "Update error";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && projects.length === 0 && <p>No assigned projects.</p>}
      {projects.length > 0 && (
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.client?.name || "-"}</td>
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={(e) => changeStatus(p.id, e.target.value)}
                    disabled={updatingId === p.id}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="PLANNING">PLANNING</option>
                    <option value="DEVELOPMENT">DEVELOPMENT</option>
                    <option value="TESTING">TESTING</option>
                    <option value="DEPLOYMENT">DEPLOYMENT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// function Profile() {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("")
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch('/api/profile')
//       .then((r) => r.json())
//       .then((d) => { if (d.name) setName(d.name); if(d.phone) setPhone(d.phone) })
//       .catch(() => {});
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, password, phone }),
//       });
//       const d = await res.json();
//       if (!res.ok) {
//         setError(d.message || 'Failed');
//       }
//       toast.success(d.message)
//     } catch (err) {
//       setError('Something went wrong');
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md">
//       <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
//       {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input label="Name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
//         <Input label="Password" name="name" value={password} type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
//         <Input label="Phone" name="name" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
//         <div className="text-sm text-gray-500">Type which field you want to update only</div>
//         <Button width="sm" type="submit">
//             Update
//         </Button>
//       </form>
//     </div>
//   );
// }

const page = () => {
  const [active, setActive] = useState<View>("dashboard");
  const router = useRouter();
  const links = [
    { label: "Dashboard", view: "dashboard" },
    { label: "Profile", view: "profile" },
    { label: "Projects", view: "projects" },
    { label: "Messages", view: "messages"}
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar
        links={links}
        logout={handleLogout}
        title="EMPLOYEE PAGE"
        active={active}
        setActive={(v: string) => setActive(v as View)}
      />

      <main className="flex-1 text-gray-600 p-10">
        {active === "dashboard" && <Dashboard />}
        {active === "projects" && <Projects />}
        {active === "profile" && <Profile employee={true} />}
        { active === "messages" && <Messages/>}
      </main>
    </div>
  );
};

export default page;
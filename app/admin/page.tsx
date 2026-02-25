"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SideBar from "../components/Sidebar";
import Profile from "../components/Profile";

type User= {
    id: string;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
    email: string;
}
type View = "dashboard" | "register" | "users" | "servies" | "projects" | "clients" | "requests" | "profile";



function RegisterForm(){
    const [form, setForm] = useState({ email: "", password: "", role: "EMPLOYEE" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setMessage("")
        setLoading(true);
        setError("")
        try{
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(form)
            })
            
            const data = await res.json()

            if(!res.ok){
                setError(data.message)
                setLoading(false);
                return;
            }

            setMessage(data.message);
            setForm({ email: "", password: "", role: "EMPLOYEE" });
        }
        catch(err){
            setError("Something went wrong.");
        } finally {
        setLoading(false);
        }
    }
    
    return(
        <div className="max-w-md">
            {message && (
                <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">
                {message}
                </div>
            )}
            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="CLIENT">Client</option>
                </select>
                </div>

                <Button type="submit" loading={loading} loadingText="Creating..." width="xl">
                Create User
                </Button>
            </form>
        </div>
    );
}

function UsersList(){
    const [users, setUsers] = useState<User[]>([]);
    const [load, setLoad] = useState(false)
    const [fetched, setFetched] = useState(false)
    const [error, setError] = useState("")
    const [deleting, setDeleting] = useState<string | null>(null);
    
    async function fetchUsers(){
        setLoad(true);
        try{
            // route need to be update
            const res = await fetch("/api/admin/users", {
                method: "GET"
            });

            const data = await res.json()
            
            setUsers(data.data || [])
            setFetched(true)
 
        }
        catch(err){
            setError("something went wrong")
            console.error(`${err instanceof Error ? err.message : "unknown error"}`)
        }finally{
            setLoad(false)
        }
    }
    
    async function handleDelete(userId: string){
        if(!confirm("Are you sure you want to delete this user?")) return;
        setDeleting(userId);
        try{
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE"
            });
            if(res.ok){
                setUsers(users.filter(u => u.id !== userId));
            } else {
                const data = await res.json();
                setError(data.message || "Failed to delete user");
            }
        }catch(err){
            setError("Something went wrong");
        }finally{
            setDeleting(null);
        }
    }
    
    if (!fetched) {
        return (
        <div>
            <h2 className="text-xl bg-center font-bold text-gray-800 mb-6">All Users</h2>
            <Button onClick={fetchUsers} loading={load} loadingText="Loading..." width="md">
            Load Users
            </Button>
        </div>
        );
    }
    
    return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Users</h2>
      {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">ID</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Role</th>
            <th className="text-center px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{u.id}</td>
              <td className="px-4 py-3 text-gray-500">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    u.role === "EMPLOYEE" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {u.role !== "ADMIN" && (
                  <Button 
                    variant="danger" 
                    width="auto" 
                    padding="2"
                    onClick={() => handleDelete(u.id)}
                    loading={deleting === u.id}
                    disabled={deleting === u.id}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

// function ProfilePage(){
//     const [name, setName] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(()=>{
//         fetch('/api/profile')
//         .then(r=>r.json())
//         .then(d=>{
//             if(d.name) setName(d.name);
//         });
//     },[]);

//     const handleSubmit = async (e:React.FormEvent)=>{
//         e.preventDefault();
//         setLoading(true); setError("");
//         try{
//             const res = await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,password})});
//             if(!res.ok){
//                 const data = await res.json();
//                 setError(data.message||'Failed');
//             } else {
//                 // maybe show toast
//             }
//         }catch(err){setError('Something went wrong');}
//         setLoading(false);
//     };

//     return (
//         <div className="max-w-md">
//             <h2 className="text-xl font-bold mb-4">Your Profile</h2>
//             {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <Input
//                     name="name"
//                     label="Name"
//                     value={name}
//                     onChange={e=>setName(e.target.value)}
//                 />
//                 <div>
//                     <Input
//                         type="password"
//                         name="password"
//                         label="Password"
//                         value={password}
//                         onChange={e=>setPassword(e.target.value)}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">leave blank to keep current password</p>
//                 </div>
//                 <Button type="submit" loading={loading} width="auto">Save Changes</Button>
//             </form>
//         </div>
//     );
// }

function Dashboard(){
    const [stats, setStats] = useState<{employeeCount:number,clientCount:number,projectCount:number,deliveredCount:number} | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [statsError, setStatsError] = useState("");

    useEffect(()=>{
        setLoadingStats(true);
        fetch('/api/admin/stats')
        .then(r=>r.json())
        .then(d=> setStats(d))
        .catch(()=>setStatsError('Failed to load stats'))
        .finally(()=>setLoadingStats(false));
    },[]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Dashboard</h2>
            {loadingStats && <div>Loading stats...</div>}
            {statsError && <div className="text-red-500">{statsError}</div>}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded shadow border">
                        <div className="text-sm text-gray-600">Employees</div>
                        <div className="text-2xl font-bold text-gray-800">{stats.employeeCount}</div>
                    </div>
                    <div className="p-4 bg-white rounded shadow border">
                        <div className="text-sm text-gray-600">Clients</div>
                        <div className="text-2xl font-bold text-gray-800">{stats.clientCount}</div>
                    </div>
                    <div className="p-4 bg-white rounded shadow border">
                        <div className="text-sm text-gray-600">Projects</div>
                        <div className="text-2xl font-bold text-gray-800">{stats.projectCount}</div>
                    </div>
                    <div className="p-4 bg-white rounded shadow border">
                        <div className="text-sm text-gray-600">Delivered</div>
                        <div className="text-2xl font-bold text-gray-800">{stats.deliveredCount}</div>
                    </div>
                </div>
            )}
            {/* include full tables below for quick access */}
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Employees</h3>
                <UsersList />
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Clients</h3>
                <ClientsList />
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Projects</h3>
                <ProjectsList />
            </div>
        </div>
    );
}

function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [load, setLoad] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState("");

  async function fetchClients() {
    setLoad(true);
    try {
      const res = await fetch("/api/admin/clients", { method: "GET" });
      const data = await res.json();
      setClients(data.data || []);
      setFetched(true);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoad(false);
    }
  }

  if (!fetched) return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Clients</h2>
      <Button onClick={fetchClients} loading={load} loadingText="Loading..." width="md">
        Load Clients
      </Button>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Clients</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Company</th>
            <th className="text-left px-4 py-3">Phone</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{c.name || "N/A"}</td>
              <td className="px-4 py-3 text-gray-800">{c.user?.email || "N/A"}</td>
              <td className="px-4 py-3 text-gray-600">{c.company || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function Services(){
    type Service= {
        id: string;
        name: string;
        price: number;
        description?: string;
    }
    const [services, setServices] = useState<Service[]>([])
    const [load, setLoad] = useState(false);
    const [fetched, setFetched] = useState(false)
    const [error, setError] = useState("")
    const [showAdd, setShowAdd] = useState(false)          // new state

    async function fetchServices(){
        setLoad(true);
        try{
            const res = await fetch("/api/admin/services", {method: "GET"})

            const data = await res.json();

            setServices(data.data || [])

            setFetched(true)
        }catch(err){
            setError("something went wrong")
            console.error(`${err instanceof Error ? err.message : "unknown error"}`)
        }finally{
            setLoad(false)
        }

    }

    // when user clicks create, show AddService component instead
    if (showAdd) {
        return <AddService onDone={() => { setShowAdd(false); fetchServices(); }} />
    }

    if(!fetched){
        return(
        <div>
            <h2 className="text-xl bg-center font-bold text-gray-800 mb-6">All Services</h2>
            <Button onClick={fetchServices} loading={load} loadingText="Loading..." width="md">
            Load Services
            </Button>
        </div>
        );
    }
    if(services.length === 0 ){
        return(

        <div>
            <h2 className="text-xl bg-center font-bold text-red-800 mb-6">No Services found</h2>
            
        </div>
        );
    }

    return(
        <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Services</h2>
      {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
    {load && (
        <div className="bg-red-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">
        loading...
        </div>
    )}
    <Button onClick={()=>{setShowAdd(true)}} disabled={load} type="submit" width="xl"> 
        Create Service
    </Button>
      <table className="w-full my-2 text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-3 py-3">ID</th>
            <th className="text-left px-5 py-3">NAME</th>
            <th className="text-left px-4 py-3">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {services.map((u) => (
            <tr key={u.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{u.id}</td>
              <td className="px-4 py-3">{u.name}
                <p>{u.description}</p>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium">
                    {u.price}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )

}

function AddService({ onDone }: { onDone: () => void }){
    const [form, setForm] = useState({ name: "", price: 0, description: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, type, value } = e.target as HTMLInputElement;
        const parsedValue = type === "number" ? (value === "" ? "" : +value): value
        setForm({ ...form, [name]: parsedValue });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setMessage("")
        setLoading(true);
        setError("")

        try{
            const res = await fetch("/api/admin/services", {
                method: "POST", 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if(!res.ok){
                setError(data.message)
                setLoading(false);
                return;
            }

            setMessage(data.message)
            setForm({ name: "", price: 0, description: "" })
            onDone();            
        }catch(err){
            setError("Something went wrong.");
        } finally {
        setLoading(false);
        }
    }
    return (
        <div className="max-w-md">
            {message && (
                <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">
                {message}
                </div>
            )}
            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input required label="Service Name" name="name" value={form.name} onChange={handleChange}/>
                <Input required label="Service Price" name="price" value={form.price} onChange={handleChange} type="number" />
                <Input required label="Service description" name="description" value={form.description} onChange={handleChange}/>

                <Button type="submit" loading={loading} loadingText="creating service..." disabled={loading}>
                    Create service    
                </Button>
            </form>
        </div>
    )
}

function StatusApproval({ request, onUpdated }: { request: any; onUpdated: () => void }){
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  async function updateStatus(state: "ACCEPTED" | "REJECTED"){
    setError("")
    setMessage("")
    try{
      const payload = { id: request.id, status: state }
      const res = await fetch("/api/admin/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if(!res.ok){
        setError(data.message || "Request update failed")
        return
      }
      setMessage(data.message || "Updated")
      onUpdated()
    }catch(err){
      setError("Something went wrong.")
    }
  }

  async function handleReject(){
    setLoading(true)
    await updateStatus("REJECTED")
    setLoading(false)
  }

  async function handleProjectCreated(){
    setLoading(true)
    await updateStatus("ACCEPTED")
    setShowAssign(false)
    setLoading(false)
  }

  return (
    <div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {message && <div className="text-green-600 text-sm mb-2">{message}</div>}
      <div className="w-full flex justify-between gap-2">
        <Button width="auto" padding="2" onClick={()=>setShowAssign(true)} disabled={loading}>
          Approve
        </Button>
        <Button width="2xs" onClick={handleReject} disabled={loading}>
          Reject
        </Button>
      </div>
      {showAssign && (
        <AssignModal
          request={request}
          onClose={() => setShowAssign(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}


function ProjectEmployeesModal({
    project,
    onClose,
    onUpdated,
}: {
    project: any;
    onClose: () => void;
    onUpdated: () => void;
}){
    // compute initially assigned employees from project data
    const initialAssigned = project.assignedProjects
        ? project.assignedProjects
              .filter((ap:any) => ap.createdAt === project.createdAt)
              .map((ap:any)=> ap.employees)
        : [];

    const [employees, setEmployees] = useState<any[]>([]);
    const [allEmployees, setAll] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        fetch(`/api/admin/projects/${project.id}/employees`)
        .then(r=>r.json())
        .then(d=>setEmployees(d.data||[]));
        // fetch all employees to add
        fetch(`/api/admin/employees`)
        .then(r=>r.json())
        .then(d=>setAll(d.data||[]));
    },[project.id]);

    const filtered = allEmployees.filter(e=>{
        if(!search) return true;
        const q = search.toLowerCase();
        const text = [e.user?.email,e.user?.name,e.email,e.name,e.id].filter(Boolean).join(" ").toLowerCase();
        return text.includes(q);
    }).filter(e=>!employees.find(emp=>emp.id===e.id));

    async function remove(empId:string){
        setLoading(true);
        try{
            await fetch(`/api/admin/projects/${project.id}/employees`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({employeeId:empId})});
            setEmployees(employees.filter(e=>e.id!==empId));
            onUpdated();
        }catch(e){setError("couldn't remove");}
        setLoading(false);
    }
    async function add(empId:string){
        setLoading(true);
        try{
            await fetch(`/api/admin/projects/${project.id}/employees`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({employeeId:empId})});
            const emp = allEmployees.find(e=>e.id===empId);
            if(emp) setEmployees([...employees, emp]);
            onUpdated();
        }catch(e){setError("couldn't add");}
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-lg text-gray-800">
                <h3 className="text-lg font-semibold mb-4">Manage Employees - {project.name}</h3>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                {initialAssigned.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-1">Originally assigned</h5>
                    <ul className="list-disc list-inside text-sm">
                      {initialAssigned.map((e:any)=>(
                        <li key={e.id}>{e.user?.email||e.email||e.id}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-4">
                    <Input
                      name="search"
                      label="Search to add"
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      placeholder="type name or email..."
                    />
                    <div className="max-h-36 overflow-auto border rounded mt-1">
                      {filtered.map(e=>(
                        <div key={e.id} className="flex justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={()=>add(e.id)}>
                          <span>{e.user?.email||e.email||e.id}</span>
                          <span className="text-blue-600">Add</span>
                        </div>
                      ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Assigned employees</h4>
+                    {employees.length === 0 && <div className="text-gray-500 text-sm">None assigned yet</div>}
                    <div className="max-h-40 overflow-auto border rounded">
                        {employees.map(e=>(
                            <div key={e.id} className="flex justify-between px-2 py-1">
                                <span>{e.user?.email||e.email||e.id}</span>
                                <Button variant="danger" width="auto" padding="2" onClick={()=>remove(e.id)}>Remove</Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" width="auto" padding="2" onClick={onClose} >Close</Button>
                </div>
            </div>
        </div>
    );
}

function ProjectsList(){
    const [projects, setProjects] = useState<any[]>([]);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    async function fetchProjects(){
        setLoad(true);
        try{
            const res = await fetch("/api/admin/projects",{method:"GET"});
            const data = await res.json();
            setProjects(data.data||[]);
        }catch(e){
            setError("Could not load projects");
        } finally{setLoad(false);}
    }

    useEffect(()=>{fetchProjects()},[]);

    const [editing, setEditing] = useState<any|null>(null);
    
    async function handleStatusChange(projectId: string, newStatus: string){
        setUpdatingStatus(projectId);
        try{
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if(res.ok){
                setProjects(projects.map(p => 
                    p.id === projectId ? {...p, status: newStatus} : p
                ));
            } else {
                setError("Failed to update status");
            }
        }catch(e){
            setError("Could not update status");
        } finally{
            setUpdatingStatus(null);
        }
    }

    return (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Projects</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {load && <div>Loading...</div>}
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-gray-800">Name</th>
                <th className="px-4 py-3 text-left text-gray-800">Client</th>
                <th className="px-4 py-3 text-left text-gray-800">Status</th>
                <th className="px-4 py-3 text-left text-gray-800">Employees</th>
                <th className="px-4 py-3 text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p=> (
                <tr key={p.id} className="border-t hover:bg-gray-50 text-gray-800">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.client?.name}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      disabled={updatingStatus === p.id}
                      className="border border-gray-300 text-gray-800 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PLANNING">PLANNING</option>
                      <option value="DEVELOPMENT">DEVELOPMENT</option>
                      <option value="TESTING">TESTING</option>
                      <option value="DEPLOYMENT">DEPLOYMENT</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{p.assignedProjects.length}</td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" width="auto" padding="2" onClick={()=>setEditing(p)} >Manage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editing && (
            <ProjectEmployeesModal project={editing} onClose={()=>setEditing(null)} onUpdated={fetchProjects} />
          )}
        </div>
    );
}


function Requests(){

    async function fetchRequests(){
        setLoad(true)
        try{
            const res = await fetch("/api/admin/requests", {method: "GET"})

            const data = await res.json()

            setRequests(data.data)
            setFetched(true)
        }catch (err) {
        setError("Something went wrong");
        } finally {
        setLoad(false);
        }
    }

    const [requests, setRequests] = useState<any>([])
    const [error, setError] = useState("");
    const [fetched, setFetched] = useState(false);
    const [load, setLoad] = useState(false)

    
    if(!fetched){
        return(
        <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Requests</h2>
      <Button onClick={fetchRequests} loading={load} loadingText="Loading..." width="md">
        Load Requests
      </Button>
    </div>)
    }
    
    return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Requests</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">ID</th>
            <th className="text-left px-4 py-3">SERVICE</th>
            <th className="text-left px-4 py-3">DESCRIPTION</th>
            <th className="text-left px-4 py-3">CLIENT</th>
            <th className="text-left px-4 py-3">COMPANY</th>
            <th className="text-left px-4 py-3">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((c:any) => (
            <tr key={c.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{c.id}</td>
              <td className="px-4 py-3">{c.service.name}</td>
              <td className="px-4 py-3">{c.service.description}</td>
              <td className="px-4 py-3">{c.client.name}</td>
              <td className="px-4 py-3">{c.client.company ? c.client.company : " - "}</td>
              <td className="px-4 py-3">
                    {c.status === "PENDING" ? (
                        <StatusApproval request={c} onUpdated={fetchRequests} />
                    ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                             ${c.status === "ACCEPTED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {c.status}
                        </span>
                    )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}

function AssignModal({ request, onClose, onProjectCreated }: { request: any; onClose: ()=> void; onProjectCreated: () => Promise<void> | void }){
    const [employees, setEmployees] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [openList, setOpenList] = useState(false)
    const [error, setError] = useState("")

    useEffect(()=>{
        fetch("/api/admin/employees")
        .then((r) => r.json())
        .then((d)=> setEmployees(d.data || []))
    },[])

    const toggleEmployee = (id:string)=>{
        setSelected((prev) => 
        prev.includes(id) ?  prev.filter((x)=> x!==id) : [...prev, id])
    }

    const filteredEmployees = employees.filter((emp) => {
      if (!search) return true
      const q = search.toLowerCase()
      const text = [
        emp.id,
        emp.name,
        emp.user?.name,
        emp.user?.email,
        emp.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return text.includes(q)
    })

    const removeSelected = (id: string) => {
      setSelected((prev) => prev.filter((empId) => empId !== id))
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("")
        try {
          const res = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
                clientId: request.clientId ?? request.client?.id,
                serviceRequestId: request.id,
                employeeIds: selected,
            }),
          });

          const data = await res.json()
          if (!res.ok) {
            setError(data.message || "Project creation failed")
            return
          }

          await onProjectCreated()
          onClose()
        } catch (err) {
          setError("Something went wrong.")
        } finally {
          setLoading(false)
        }
    };
    return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] border border-gray-100 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Create project</h3>
                <p className="text-sm text-gray-500 mt-1">Client: {request.client?.name ?? "Client"}</p>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>
                ×
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto bg-white">
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 gap-4">
            <Input
              required
              name="projectName"
              label="Project Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="e.g. Website Redesign"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                rows={3}
                placeholder="Brief project scope..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Assign Employees</label>
                <span className="text-xs text-gray-500">{selected.length} selected</span>
            </div>

            <div className="min-h-11 border border-gray-300 rounded-lg px-2 py-2 flex flex-wrap gap-2">
              {selected.length === 0 && <span className="text-sm text-gray-400 px-1">No employees selected</span>}
              {selected.map((id) => {
                const emp = employees.find((e) => e.id === id)
                const label = emp?.user?.name ?? emp?.user?.email ?? emp?.name ?? emp?.email ?? id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => removeSelected(id)}
                    className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full text-xs hover:bg-blue-100"
                  >
                    {label} ×
                  </button>
                )
              })}
            </div>

            <div className="mt-2 flex gap-2">
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setOpenList(true); }}
                  onFocus={() => setOpenList(true)}
                  placeholder="Search by employee id or name"
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
              {selected.length > 0 && (
                <Button variant="ghost" width="auto" padding="2" onClick={() => setSelected([])}>
                  Clear
                </Button>
              )}
            </div>

            <div className={`mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-sm max-h-56 overflow-auto ${openList ? '' : 'hidden'}`}>
              {employees.length === 0 && <div className="p-3 text-sm text-gray-500">No employees found</div>}
              {filteredEmployees.length === 0 && employees.length > 0 && (
                <div className="p-3 text-sm text-gray-500">No matches for "{search}"</div>
              )}
              {filteredEmployees.map((emp) => {
                const displayName = emp?.user?.name ?? emp?.name ?? "Unknown"
                const displayEmail = emp?.user?.email ?? emp?.email ?? ""
                return (
                  <button
                    key={emp.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => toggleEmployee(emp.id)}
                  >
                    <div>
                      <div className="text-sm text-gray-800">{displayName}</div>
                      <div className="text-xs text-gray-500">{displayEmail || emp.id}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${selected.includes(emp.id) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {selected.includes(emp.id) ? "Selected" : "Select"}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 bg-white sticky bottom-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={loading || !name.trim() || selected.length === 0}>
                {loading ? "Creating…" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function AdminPage(){
    const router = useRouter()
    const [active, setActive] = useState<string>("dashboard");

    async function handleLogout(){
        await fetch("/api/auth/logout", {method: "DELETE"})
        router.push("/login")

        
    }
    const links = [
        { label: "Dashboard", view: "dashboard"},
        { label: "Profile", view: "profile"},
        { label: "Register", view: "register" },
        { label: "Projects", view: "projects"},
        { label: "Services", view: "servies"},
        { label: "Requests", view: "requests"}
        ]

    return(
        <div className="flex min-h-screen bg-gray-50">
          
            <SideBar links={links} title="ADMIN PAGE" active={active} setActive={setActive} logout={handleLogout} />
            <main className="flex-1 text-gray-700 p-10"> 
                {
                    active === "dashboard" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, Admin</h2>
                            <p className="text-gray-500 text-sm">Use the sidebar to manage users.</p>
                            <Dashboard/>
                        </div>
                    )}
                    {
                    active === "register" && <RegisterForm />
                    }
                    { active === "users" && <UsersList/>}
                    { active === "servies" && <Services />}
                    { active === "clients"  && <ClientsList/>}
                    { active === "projects" && <ProjectsList />}
                    { active === "requests" && <Requests/>}
                    { active === "profile" && <Profile/>}
            </main>
        </div>
    );
}

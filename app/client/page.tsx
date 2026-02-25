"use client"
import React, { useEffect, useState } from 'react'
import SideBar from '../components/Sidebar'
import { useRouter } from 'next/navigation';
import Profile from '../components/Profile';
import { toast } from "sonner"
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Dropdown from '../components/ui/Dropdown';

type View = "dashboard" | "profile" | "requests";

function RequestForm({onClose}: {onClose: ()=> void}){
    const [service, setServices] = useState<any[]>([]);
    const [load, setLoad] = useState(false)
    
    const handleRequest = async(id: string)=>{
        setLoad(true)
        fetch("/api/client/requests", { method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id})
        }).then(()=> toast.success("Service requested"))
        .catch(()=>toast.error("something went wrong with request creation"))
        .finally(()=>setLoad(false))
    }

    useEffect(()=>{
        setLoad(true)
        fetch("/api/client/services")
        .then((r)=>r.json())
        .then((d)=> setServices(d.data))
        .catch(()=> toast.error("unable to fetch services"))
        .finally(()=> setLoad(false))
    },[])
        return(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] border border-gray-100 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col items-start justify-between">
                <div className='w-full flex justify-between'>
                    <h3 className="text-lg font-semibold text-gray-900">Create Request</h3>
                    <button type="button" className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>
                        ×
                    </button>
                </div>
                { load ? <div className="text-gray-700 p-2 text-sm mb-4">loading...</div>: (
                <table className="w-full mt-3 text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="text-left px-4 py-3">SERVICE</th>
                    <th className="text-left px-4 py-3">DESCRIPTION</th>
                    <th className="text-left px-4 py-3">PRICE</th>
                    <th className="text-left px-4 py-3">REQUEST</th>
                </tr>
                </thead>
                <tbody>
                {service.map((c:any) => (
                    <tr key={c.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">{c.name}</td>
                        <td className="px-4 py-3">{c.description}</td>
                        <td className="px-4 py-3">{c.price}</td>
                        <td className="px-4 py-3">
                            <Button width='sm' onClick={()=>handleRequest(c.id)}>
                                Request this service
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>)}
            </div>
            </div>

        </div>
        )
    }


function Dashboard(){
    const [requests, setRequests] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        async function loadData(){
            setLoad(true);
            try{
                const [rRes, pRes] = await Promise.all([
                    fetch("/api/client/requests"),
                    fetch("/api/client/projects")
                ]);
                const rJson = await rRes.json();
                const pJson = await pRes.json();
                if(rJson?.data) setRequests(rJson.data);
                if(pJson?.data) setProjects(pJson.data);
            } catch(e){
                setError("unable to fetch dashboard data");
            } finally{
                setLoad(false);
            }
        }
        loadData();
    },[]);

    const stats = requests.reduce((acc, r)=>{
        acc.total++;
        if(r.status === "ACCEPTED") acc.accepted++;
        else if(r.status === "REJECTED") acc.rejected++;
        else acc.pending++;
        return acc;
    }, {total:0,accepted:0,rejected:0,pending:0});

    if(load) return <div className="text-gray-700 p-2 text-sm mb-4">loading...</div>;
    if(error) return <div className="text-red-500 text-sm mb-4">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white rounded shadow">
                    <div className="text-sm text-gray-500">Total requests</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <div className="text-sm text-gray-500">Accepted</div>
                    <div className="text-2xl font-bold">{stats.accepted}</div>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <div className="text-sm text-gray-500">Rejected</div>
                    <div className="text-2xl font-bold">{stats.rejected}</div>
                </div>
                <div className="p-4 bg-white rounded shadow">
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects</h3>
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="text-left px-4 py-3">ID</th>
                        <th className="text-left px-4 py-3">NAME</th>
                        <th className="text-left px-4 py-3">DESCRIPTION</th>
                        <th className="text-left px-4 py-3">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p:any)=>(
                        <tr key={p.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">{p.id}</td>
                            <td className="px-4 py-3">{p.name}</td>
                            <td className="px-4 py-3">{p.description}</td>
                            <td className="px-4 py-3">{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Requests(){
    const [requests, setRequests] = useState<any[]>([]);
    const [load, setLoad] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [seleted, setSelected] = useState("");
    const [error, setError] = useState("");

    useEffect(()=>{
        setLoad(true)
        fetch("/api/client/requests", {method: "GET"})
        .then((r)=>r.json())
        .then((d)=>{ console.log(d.data);if(d?.data) setRequests(d.data)})
        .catch(()=> {toast.error("unable to fetech all requests")})
        .finally(()=> setLoad(false))
    },[showForm])

    

    return(
        <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">All Requests</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <Button width='md' onClick={()=>setShowForm(true)}>
        create request
      </Button>
      { load ? <div className="text-gray-700 p-2 text-sm mb-4">loading...</div> : (
      <table className="w-full mt-3 text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">ID</th>
            <th className="text-left px-4 py-3">SERVICE</th>
            <th className="text-left px-4 py-3">DESCRIPTION</th>
            <th className="text-left px-4 py-3">REQUESTED ON</th>
            <th className="text-left px-4 py-3">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((c:any) => (
            <tr key={c.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{c.id}</td>
              <td className="px-4 py-3">{c.service.name}</td>
              <td className="px-4 py-3">{c.service.description}</td>
              <td className="px-4 py-3">{c.createdAt}</td>
              <td className="px-4 py-3">{c.status === "PENDING" ? 
                                            (<div className='bg-amber-200 rounded-4xl py-2'>
                                                <div className=' text-amber-600 text-center'>PENDING</div>
                                            </div>) : (c.status === "ACCEPTED" ? 
                                            (<div className='bg-green-200 rounded-4xl py-2'>
                                                <div className=' text-green-600 text-center'>ACCEPTED</div>
                                            </div>): 
                                            (<div className='bg-red-200 rounded-4xl py-2'>
                                                <div className=' text-red-600 text-center'>REJECTED</div>
                                            </div>))}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {showForm && <RequestForm onClose={()=>setShowForm(false)}/>}
    </div>
    )
}

const page = () => {
    const [active, setActive] = useState<View>("dashboard")
    const router = useRouter()
    const link = [
        {label:"Dashboard", view: "dashboard"},
        { label: "Requests", view: "requests" },
        { label: "Profile", view: "profile"}
    ]

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "DELETE" });
        router.push("/login");
    }

  return (
    <div className="flex min-h-screen bg-gray-50">
        <SideBar 
            links={link} 
            title='CLIENT PAGE' 
            logout={handleLogout} 
            active={active} 
            setActive={(v: string)=> setActive(v as View)} />

        <main className="flex-1 text-gray-600 p-10">
            { active === "profile" && <Profile client={true}/>}
            { active === "requests" && <Requests/>}
            { active === "dashboard" && <Dashboard/>}
        </main>     
    </div>
  )
}

export default page
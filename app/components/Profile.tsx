import { useEffect, useState } from "react";
import { toast } from  "sonner"
import Input from "./ui/Input";
import Button from "./ui/Button";
import { boolean } from "zod";

interface profilepros{
    employee? : boolean;
    client?: boolean;
}

export default function Profile({employee = false, client = false}: profilepros) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("-")
  const [company, setCompany] = useState("-");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true)
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
            if(d?.users?.name){ setName(d.users.name); } else setName(d.email);
            if(client){
                if(d?.users?.phone) setPhone(d.users.phone); 
                if(d?.users?.company) setCompany(d.users.company)
                }
            if(employee){
                if(d?.users?.phone) setPhone(d.users.phone)
            }
            })
      .catch(() => {toast.error("Error in fetching profile")}).finally(()=>{setLoading(false)});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, phone, company }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.message || 'Failed');
      }
      toast.success(d.message)
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      { loading ?  <div className="text-gray-700 text-sm mb-2">loading...</div> : 
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <Input placeholder="Enter new password to update or just leave it blank" label="Password" name="password" value={password} type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
        { employee && <Input label="Phone" name="phone" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/> }
        { client && (
            <>
            <Input label="Phone" name="phone" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/> 
            <Input label="Company" name="cpmpany" value={company} onChange={(e)=>{setCompany(e.target.value)}}/>
            </>
        )
        }
        <div className="text-sm text-gray-500">Type which field you want to update only</div>
        <Button width="sm" type="submit">
            Update
        </Button>
      </form>

      }
    </div>
  );
}
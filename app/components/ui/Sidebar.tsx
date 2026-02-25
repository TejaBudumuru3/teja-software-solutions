import Button from "./Button";

interface SidebarLink { label: string; view: string }
interface SidebarProps {
  title?: string;
  links: SidebarLink[];
  active: string;
  setActive: (v: string) => void;
  logout: () => void;
}

export default function SideBar({
    active,
    setActive,
    logout,
    title,
    links
    }: SidebarProps){
    


    return(
        <aside className="w-60 max-h-screen h-screen sticky top-0 bg-gray-900 text-white flex flex-col justify-between p-6">
            <div className="h-full flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-8">{title}</h2>
                <div className="flex flex-col justify-between h-full">
                <nav className="flex flex-col gap-2">
                    {links.map((link)=>(
                        <button
                            key={link.view}
                            onClick={()=>setActive(link.view)}
                            className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition
                                ${active === link.view
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                {link.label}
                            </button>
                    ))}
                </nav>

                {/* profile link moved to nav above */}
                <Button
                    variant="danger"
                    width="full"
                    padding="2"
                    onClick={()=>logout()}
                >
                    Logout
                </Button>
                </div>
            </div>
        </aside>
    )
}
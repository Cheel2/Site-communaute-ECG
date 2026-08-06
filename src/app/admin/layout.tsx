export default function Layout({ children }: any) { return <>{children}</>; }
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";
import { RoleProvider } from "@/components/RoleContext";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: userData } = await supabase
    .from("utilisateur")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <RoleProvider initialRole={userData?.role || null}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </RoleProvider>
  );
}

function AdminLayoutContent({ children }: Props) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { name: "Tableau de bord", href: "/admin/tableau-de-bord" },
    { name: "Contenus", href: "/admin/contenus" },
    { name: "Rubriques", href: "/admin/rubriques" },
    { name: "Livres", href: "/admin/livres" },
    { name: "Événements", href: "/admin/evenements" },
    { name: "Partenaires", href: "/admin/partenaires" },
    { name: "Contacts", href: "/admin/contacts" },
    { name: "Utilisateurs", href: "/admin/utilisateurs" },
    { name: "Paramètres", href: "/admin/parametres" },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 z-50 w-64 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold">Ministère Pastoral</h1>
        </div>
        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu button */}
      <div className="absolute left-4 top-4 flex items-center lg:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

function AdminHeader() {
  const { role } = useRole();
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    const fetchUser = async () => {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">Back-office</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{userEmail}</span>
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            {role === "total" ? "Administrateur" : "Lecture seule"}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}

// Browser client for header
import { createBrowserClient } from "@/lib/supabase/client";

// Need to import React for the component functions
import React from "react";
import { useRole } from "@/components/RoleContext";
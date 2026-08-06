"use client";

import { useState } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/actions";
import { useRole } from "@/components/RoleContext";

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

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useRole();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Ministère Pastoral
          </h1>
        </div>
        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile menu button */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg
              className="h-6 w-6"
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
          <span className="truncate text-sm text-gray-600">{userEmail}</span>
        </div>

        {/* Desktop header */}
        <header className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:flex">
          <h2 className="text-lg font-medium text-gray-800">Back-office</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {role === "total" ? "Administrateur" : "Lecture seule"}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
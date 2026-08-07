"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

type Role = "total" | "lecture_seule" | null;

type RoleContextType = {
  role: Role;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ 
  children, 
  initialRole 
}: { 
  children: ReactNode; 
  initialRole: Role;
}) {
  const [role, setRole] = useState<Role>(initialRole);

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createBrowserClient();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("utilisateur")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          setRole(null);
        } else {
          setRole(data.role as Role);
        }
      } else {
        setRole(null);
      }
    };

    // Only fetch if initial role is null (for logged-in users without role)
    if (initialRole === null) {
      fetchUserRole();
    }
  }, [initialRole]);

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
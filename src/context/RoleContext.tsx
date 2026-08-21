"use client";

import { createContext, useContext, ReactNode } from "react";

type Role = "total" | "lecture_seule" | null;

const RoleContext = createContext<Role>(null);

type RoleProviderProps = {
  children: ReactNode;
  initialRole: Role;
};

export function RoleProvider({ children, initialRole }: RoleProviderProps) {
  return (
    <RoleContext.Provider value={initialRole}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): Role {
  return useContext(RoleContext);
}

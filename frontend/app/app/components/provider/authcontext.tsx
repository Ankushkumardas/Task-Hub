import React, { createContext, useContext, useState } from "react";
import type { User } from "~/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  setUser?: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setisAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    console.log("login data ", { email, password });
  };

  const logout = async () => {
    console.log("logout ");
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout,setisAuthenticated,setIsLoading,setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//custom hook to use the auth in every app for authenticationa nd get the user info
export const useAuth = () => {
  const context = useContext(AuthContext); //useContext: lets components read data from that context.
  if (!context) {
    throw Error("useauth must be used in auth provider");
  }
  return context;
};

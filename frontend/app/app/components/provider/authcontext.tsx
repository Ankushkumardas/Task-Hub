import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "~/types";
import { queryClient } from "./recatqueryProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRoutes } from "~/lib";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login?: any;
  logout?: () => Promise<void>;
  setUser?: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setisAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setisAuthenticated] = useState(false);

  //condition to make even if we refresh or reload teh page the user data should persist in all pages and conditon -->
  const navigate = useNavigate();
  const currentpath = useLocation().pathname;
  const ispublicRoute = publicRoutes.includes(currentpath);

  //check if user is authentcated or logged in
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const userinfo = localStorage.getItem("token");
      if (userinfo && userinfo !== "undefined") {
        try {
          // Decode JWT payload
          const base64Payload = userinfo.split('.')[1];
          const payload = JSON.parse(atob(base64Payload));
          const userdata = localStorage.getItem("user");
          if (isMounted) {
            setUser(userdata ? JSON.parse(userdata) : null);
            setisAuthenticated(true);
          }
        } catch (e) {
          if (isMounted) {
            setUser(null);
            setisAuthenticated(false);
          }
        }
      } else {
        if (isMounted) {
          setisAuthenticated(false);
          setUser(null);
        }
        if (!ispublicRoute && isMounted) {
          setTimeout(() => navigate('/login', { replace: true }), 0);
        }
      }
      if (isMounted) setIsLoading(false);
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  //
  const login = async (data: any) => {
    console.log(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data?.user));
    setUser(data?.user);
    setisAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    console.log("logout ");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setisAuthenticated(false);
    //clear all caache
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setisAuthenticated,
        setIsLoading,
        setUser,
      }}
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

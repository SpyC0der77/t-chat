import { useConvex, useConvexAuth } from "convex/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";

type SessionData = {
  id: string
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  session: SessionData | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

export const AUTH_COOKIE_NAME = 't4chat.csgo'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => { }
});


function readCookie(name: string): SessionData | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const cookieValue = c.substring(nameEQ.length, c.length);
      try {
        return JSON.parse(cookieValue) as SessionData;
      } catch (error) {
        console.error("Error parsing auth cookie:", error);
        return null;
      }
    }
  }
  return null;
}


function setAuthCookie(sessionData: SessionData | null) {
  if (typeof document === 'undefined') return;

  if (sessionData && Object.keys(sessionData).length > 0) {
    const cookieString = JSON.stringify(sessionData);
    document.cookie = `${AUTH_COOKIE_NAME}=${cookieString}; Max-Age=${AUTH_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(() => readCookie(AUTH_COOKIE_NAME));
  const isAuthenticated = !!session?.id;
  const { isAuthenticated: isConvexAuth, isLoading } = useConvexAuth();
  const convex = useConvex();

  useEffect(() => {
    if (isLoading) return;

    async function getUser() {
      try {
        const user = (await convex.query(api.auth.getCurrentUser))!;
        if (user) {
          const newSessionData: SessionData = {
            id: user.userId,
            name: user.name,
            picture: user.picture,
            email: user.email,
          };
          setSession(newSessionData);
          setAuthCookie(newSessionData);
        } else {
          setSession(null);
          setAuthCookie(null);
        }
      }
      catch (error) {
        console.error("Error fetching user from Convex:", error);
        setSession(null);
        setAuthCookie(null);
      }
    }

    if (isConvexAuth) {
      getUser();
    }
    else {
      setSession(null);
      setAuthCookie(null);
    }

  }, [isConvexAuth, isLoading, convex]);
  const logout = useCallback(() => { // Example logout function
    setSession(null);
    setAuthCookie(null);
    // Potentially call Convex logout here too
  }, [])
  return (
    <AuthContext.Provider value={{
      session,
      isAuthenticated,
      isLoading,
      logout
    }} > {children} </AuthContext.Provider>
  );
}

export function useCustomAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useCustomAuth must be used within an AuthProvider");
  }

  return context;
}


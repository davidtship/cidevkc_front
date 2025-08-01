import { createContext, useContext, useState, useEffect, useCallback, Suspense, } from 'react';
import { Preloader, PreloaderFull } from '@/components/Misc/Preloader';
const AuthContext = createContext({});
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
const authSessionKey = 'WINDOW_AUTH_SESSION';
export function AuthProvider({ children }) {
    const [user, setUser] = useState(localStorage.getItem(authSessionKey)
        ? JSON.parse(localStorage.getItem(authSessionKey) || '{}')
        : undefined);
    const saveSession = useCallback((user) => {
        localStorage.setItem(authSessionKey, JSON.stringify(user));
        setUser(user);
    }, [setUser]);
    const removeSession = useCallback(() => {
        localStorage.removeItem(authSessionKey);
        setUser(undefined);
    }, [setUser]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, []);
    return (<>
      {loading ? (<PreloaderFull />) : (<Suspense fallback={<Preloader />}>
          <AuthContext.Provider value={{
                user,
                isAuthenticated: Boolean(user),
                saveSession,
                removeSession,
            }}>
            {children}
          </AuthContext.Provider>
        </Suspense>)}
    </>);
}

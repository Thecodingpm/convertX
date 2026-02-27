"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { api } from "@/lib/api";

interface User {
    id: number;
    name: string;
    email: string;
    plan: string;
    avatar: string | null;
    daily_conversions: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: async () => { },
    isAuthenticated: false,
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = api.getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.getUser();
                if (res.success) {
                    setUser((res.data as { user: User }).user);
                } else {
                    api.setToken(null);
                }
            } catch {
                api.setToken(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await api.login(email, password);
            if (res.success) {
                const data = res.data as { user: User; token: string };
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: res.message || "Invalid credentials" };
        } catch {
            return { success: false, message: "Network error. Please try again." };
        }
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string, confirmPassword: string) => {
            try {
                const res = await api.register(name, email, password, confirmPassword);
                if (res.success) {
                    const data = res.data as { user: User; token: string };
                    setUser(data.user);
                    return { success: true };
                }
                return { success: false, message: res.message || "Registration failed" };
            } catch {
                return { success: false, message: "Network error. Please try again." };
            }
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await api.logout();
        } catch {
            // Still logout locally
        }
        setUser(null);
        api.setToken(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

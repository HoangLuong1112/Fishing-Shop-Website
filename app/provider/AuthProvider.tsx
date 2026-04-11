"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>({ user: null });

// provider chỉ để lưu thông tin, không gọi API ở đây
export function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: any;
}) {
    const [user, setUser] = useState<any>(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
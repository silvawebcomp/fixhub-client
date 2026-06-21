import {
    createContext,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import type {
    User,
} from "../types/user";

type AuthContextType = {

    user: User | null;

    login: (user: User) => void;

    logout: () => void;

    isAuthenticated: boolean;

};

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

type AuthProviderProps = {

    children: ReactNode;

};

export function AuthProvider({

    children,

}: AuthProviderProps) {

    const [user, setUser] = useState<User | null>(() => {

        const storedUser = localStorage.getItem(
            "fixhub-user"
        );

        return storedUser
            ? JSON.parse(storedUser)
            : null;

    });

    function login(user: User) {

        localStorage.setItem(
            "fixhub-user",
            JSON.stringify(user)
        );

        setUser(user);

    }

    function logout() {

        localStorage.removeItem(
            "fixhub-user"
        );

        localStorage.removeItem(
            "fixhub-token"
        );

        setUser(null);

    }

    return (

        <AuthContext.Provider

            value={{

                user,

                login,

                logout,

                isAuthenticated: !!user,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}
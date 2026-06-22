import {
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import type {
    User,
} from "../types/user";
import { AuthContext } from "./authContextValue";

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

    function login(user: User, token?: string) {

        localStorage.setItem(
            "fixhub-user",
            JSON.stringify(user)
        );

        if (token) {

            localStorage.setItem(
                "fixhub-token",
                token
            );

        }

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

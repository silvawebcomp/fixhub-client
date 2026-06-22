import { createContext } from "react";
import type { User } from "../types/user";

export type AuthContextType = {
    user: User | null;
    login: (user: User, token?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

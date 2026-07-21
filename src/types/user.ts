export interface User {

    id: number;

    name: string;

    email: string;

    role?: "Owner" | "Admin" | "Manager" | "Technician" | "Front Desk" | "Receptionist";

    token?: string;

}

export interface LoginForm {

    email: string;

    password: string;

}

export interface RegisterForm {

    name: string;

    email: string;

    password: string;

}

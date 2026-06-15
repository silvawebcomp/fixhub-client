export interface User {

    id: number;

    name: string;

    email: string;

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
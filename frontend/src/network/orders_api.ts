import { User } from "../types/users";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData('http://localhost:5000/api/users', {method: 'GET'});
    return response.json();
}

export interface SignUpCredentials {
    name: string,
    surname: string,
    email: string,
    phone_number: string,
    occupation: string,
    role: string,
};

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData('http:localhost:5000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export interface LoginCredentials {
    email: string,
    password: string,
};

export async function signIn(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData('http:localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export async function logout() {
    await fetchData('http:localhost:5000/api/logout', {method: 'POST'});
}


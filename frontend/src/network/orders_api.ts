import { User } from "../types/users";
const baseURL = 'http://localhost:5000';

async function fetchData(input: RequestInfo, init?: RequestInit) {

    const response = await fetch(input, init);    
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
};

export async function getLoggedInUser(): Promise<string> {
    const response = await fetchData(`${baseURL}/api/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const user = await response.json();;
    return user._id;
};

export interface SignUpCredentials {
    name: string,
    surname: string,
    email: string,
    password: string,
    confirmPassword?: string,
    phone_number: string,
    occupation: string,
    role: string,
};

export async function getUsersEmail(): Promise<User[]> {
    const response = await fetch(`${baseURL}/api/users/allUsers`, {method: 'GET'});
    return response.json();
};

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData(`${baseURL}/api/users/signup`, {
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
    
    const response = await fetchData(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export async function logout() {
    await fetchData(`${baseURL}/api/users/logout`, {method: 'POST'});
}


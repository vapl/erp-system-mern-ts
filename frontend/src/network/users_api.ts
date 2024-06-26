import { User } from "../models/user";
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

export async function userProfileImage(user: User): Promise<string> {
    const response = await fetchData(`${baseURL}/uploads/profile-images/${user.profile_image}`, { method: 'GET', credentials: 'include' });
    return response.json();
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData(`${baseURL}/api/users/`, { method: 'GET', credentials: 'include' });
    return response.json();
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
    profile_image: string,
    submit: string,
};

export async function getAllUsersData(): Promise<User[]> {
    const response = await fetchData(`${baseURL}/api/users/allUsers`, {method: 'GET'});
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
    submit: string
};

export async function signIn(credentials: LoginCredentials): Promise<User> {    
    const response = await fetchData(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    return response.json();
};

export interface updateUserDataCredentials {
    name: string,
    surname: string,
    email: string,
    phone_number: string,
    occupation: string,
    profile_image: string,
    submit: string,
}

export async function updateUserData(credentials: FormData): Promise<void> {
    const formData = new FormData();
    Object.entries(credentials).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const response = await fetchData(`${baseURL}/api/users/userUpdate`, {
        method: 'PUT',
        body: credentials,
        credentials: 'include',
    });
    return response.json();
};

export async function updateUserDataByAdmin(userId: string, credentials: SignUpCredentials): Promise<User> {
    try {
        const response = await fetchData(`${baseURL}/api/users/user/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(credentials),
            credentials: 'include',
        })
        return response.json();
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

export async function logout() {
    await fetchData(`${baseURL}/api/users/logout`, {method: 'POST', credentials: 'include',});
};

// delete file
export async function deleteFile(profileImage: string) {
    try {
        const response = await fetch(`${baseURL}/api/users/delete`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({profile_image: profileImage}),
      credentials: 'include',
    });
    return response;
    } catch (error) {
        console.error('Error deleting file', error);
        throw error;
    }
};

// delete user
export async function deleteUser(userId: string) {
    try {
        const response = await fetchData(`${baseURL}/api/users/deleteUser`, {
            method: 'DELETE',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ _id: userId }),
        });
        return response;
    } catch (error) {
        console.error('Error deleting user', error);
        throw error;
    }
}


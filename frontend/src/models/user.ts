
export interface User {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string,
    phone_number: string;
    occupation: string;
    role: string;
    profile_image: string;
    orders: [];
}
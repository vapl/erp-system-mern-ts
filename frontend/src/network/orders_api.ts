import { Order } from "../models/orders";
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


export async function getOrders(): Promise<Order[]> {
    const response = await fetchData(`${baseURL}/api/orders`, {method: 'GET'});
    return response.json();
};

// Create order
export interface CreateOrderCredentials {
    reg_num: string,
    order_name: string,
    order_export?: boolean,
}

export async function createOrder(credentials: CreateOrderCredentials): Promise<Order> {
    try {
        const response = await fetchData(`${baseURL}/api/orders/newOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
        
    } catch (error) {
        console.error('Error creating new order', error);
        throw error;
    }
};

// Delete order
export async function deleteOrder(orderId: string) {
    try {
        const response = await fetchData(`${baseURL}/api/orders/deleteOrder`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ _id: orderId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        return response;
    } catch (error) {
        console.error('Error deleting order', error);
        throw error;
    }
};
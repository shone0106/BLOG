import Post from '../models/Post'
import User from '../models/User'
import { UnauthorizedError, ConflictError } from '../errors/http_errors'



async function fetchResponse(endPoint: RequestInfo, init?: RequestInit){
    const response = await fetch(endPoint, init)
    if (response.ok) return response

    const errorBody = await response.json()
    const errorMessage = errorBody.error 

    if (response.status === 401) {
        throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
        throw new ConflictError(errorMessage);
    } else {
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchResponse("/api/users", { method: "GET" });
    const body = await response.json()
    return body
}

export interface SignUpCredentials {
    username: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchResponse("/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchResponse("/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout() {
    await fetchResponse("/api/users/logout", { method: "POST" });
}


export async function getPosts(): Promise<Post[]>{
    const response = await fetchResponse('/api/posts', {method: "GET"})
    const body = await response.json()
    return body
}

export async function getPost(postId: string): Promise<Post>{
    const response = await fetchResponse(`/api/posts/${postId}`, {method: "GET"})
    const body = await response.json()
    return body
}

export interface PostInput {
    title: string,
    text?: string,
}

export async function createPost(post: PostInput): Promise<Post>{
    const response = await fetchResponse('/api/posts',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    })
    const body = await response.json()
    return body
}

export async function updatePost(postId: string, post: PostInput): Promise<Post>{
    const response = await fetchResponse('/api/posts/'+postId,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    })
    const body = await response.json()
    return body
}

export async function deletePost(postId: string) {
    await fetchResponse("/api/posts/" + postId, { method: "DELETE" });
}
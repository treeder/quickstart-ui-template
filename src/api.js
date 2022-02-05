import fetch from "node-fetch";

const prod = process.env.NODE_ENV === 'production';
console.log("PROD?", prod)
const apiURL = process.env.API_URL ? process.env.API_URL.replace(/\/$/, "") : 'http://localhost:8080';

export async function api(url, { method = 'GET', body = null, formData = null, headers = {}, sessionCookie = '' }) {
    // console.log("np:", np)
    method = method.toUpperCase()
    headers = {
        'content-type': 'application/json'
    }
    if (sessionCookie && sessionCookie !== '') {
        headers['Authorization'] = `Cookie ${sessionCookie}`
    }

    let fetchData = {
        method: method,
        headers: headers
    }
    if (body) {
        fetchData.body = JSON.stringify(np.body)
    }
    const res = await fetch(url, fetchData);

    if (!res.ok) {
        let json = await res.json()
        throw new ApiError(res.status, json.error.message)
    }

    return await res.json()
}

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    get code() {
        return this.status
    }

    get statusCode() {
        return this.status
    }

    toString() {
        return `${this.message}`;
    }
}

export { apiURL }

import fetch from "node-fetch";

const prod = process.env.NODE_ENV === 'production';
console.log("PROD?", prod)
const apiURL = process.env.API_URL ? process.env.API_URL.replace(/\/$/, "") : 'http://localhost:8080';

export async function api(url, np = { method: 'GET', body: null, formData: null, headers: {}, sessionCookie: '' }) {
    let method = np.method.toUpperCase()
    let headers = {
        'content-type': 'application/json'
    }
    if (np.sessionCookie && np.sessionCookie !== '') {
        headers['Authorization'] = `Cookie ${np.sessionCookie}`
    }

    let fetchData = {
        method: method,
        headers: headers
    }
    if (np.body) {
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

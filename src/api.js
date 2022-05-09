import fetch from "node-fetch";

const prod = process.env.NODE_ENV === 'production';
console.log("PROD?", prod)
const apiURL = process.env.API_URL ? process.env.API_URL.replace(/\/$/, "") : 'http://localhost:8080';
console.log("API_URL:", apiURL)

var defaultParams = { method: 'GET', body: null, formData: null, headers: {}, sessionCookie: '' }

export async function api(url, o = {}) {
    o = Object.assign(defaultParams, o)
    let method = o.method.toUpperCase()
    let headers = o.headers
    if (!headers['content-type']) {
        headers['content-type'] = 'application/json'
    }
    if (o.sessionCookie && o.sessionCookie !== '') {
        headers['Authorization'] = `Cookie ${o.sessionCookie}`
    }

    let fetchData = {
        method: method,
        headers: headers
    }
    if (o.body) {
        fetchData.body = JSON.stringify(o.body)
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

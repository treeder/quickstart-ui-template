import fetch from "node-fetch";

const prod = process.env.NODE_ENV === 'production';
console.log("PROD?", prod)
const apiURL = process.env.API_URL ? process.env.API_URL.replace(/\/$/, "") : 'http://localhost:8080';

export async function api(method, url, data) {

    const res = await fetch(url, {
        method: method,
        headers: {
            'content-type': 'application/json'
        },
        body: data && JSON.stringify(data)
    });

    // if the request came from a <form> submission, the browser's default
    // behaviour is to show the URL corresponding to the form's "action"
    // attribute. in those cases, we want to redirect them back to the
    // /todos page, rather than showing the response
    // if (res.ok && method !== 'GET') {// && request.headers.accept !== 'application/json') {
    //     return {
    //         status: 303,
    //         headers: {
    //             location: '/collections'
    //         }
    //     };
    // }

    // console.log("BODY:", await res.text())

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
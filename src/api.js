const prod = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';
// // console.log("PROD?", prod)
const apiURL = process.env.API_URL ? process.env.API_URL.replace(/\/$/, "") : 'http://localhost:8080';

export async function api(
    url,
    {
        method = "GET",
        body = null,
        formData = null,
        headers = { "Content-Type": "application/json" },
        sessionCookie = "",
    },
) {
    method = method.toUpperCase();
    //   let headers = {
    //     "Content-Type": "application/json",
    //   };
    // console.log("COOKIE:", np.sessionCookie)
    if (sessionCookie && sessionCookie !== "") {
        headers["Authorization"] = `Cookie ${sessionCookie}`;
        // headers['cookie'] = sessionCookie
        // headers['Cookie'] = cookies;
    }
    let fetchData = {
        method: method,
        headers: headers,
    };
    if (body) {
        fetchData.body = JSON.stringify(body);
    }
    const res = await fetch(url, fetchData);

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
         try {
            let json = await res.json()
            throw new ApiError(res.status, json.error.message)
        } catch (e2) {
            // can't parse json
            throw new ApiError(res.status, res.statusText)
        }
    }

    return await res.json();
}

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    get code() {
        return this.status;
    }

    get statusCode() {
        return this.status;
    }

    toString() {
        return `${this.message}`;
    }
}

export { apiURL, ApiError }

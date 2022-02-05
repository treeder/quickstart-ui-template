import { auth } from './firebase.js'

// zapi calls the API with auth token if logged in
export default async function zapi(path, np = { method: 'GET', body: {}, formData: null, headers: {} }) {
    let headers = np.headers;
    if (!headers) {
        headers = {}
    }
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
    }
    let user = auth.currentUser;
    console.log("CURRENT USER:", user)
    if (user != null && !headers['Authorization']) {
        let token = await user.getIdToken();
        headers['Authorization'] = "Bearer " + token;
    }
    let data = {
        method: np.method,
        headers: headers
    };
    if (np.formData) {
        data.body = np.formData
        delete headers['Content-Type'] // see https://github.com/github/fetch/issues/505#issuecomment-293064470
    } else if (!(np.method === 'GET' || np.method === 'HEAD')) {
        data.body = JSON.stringify(np.body);
    }
    try {
        let response = await fetch(apiURL + path, data);
        console.log("RESPONSE STATUS:", response.status)
        switch (response.status) {
            case 413: // too large
                throw new ApiError(response.status, "Request too large")
        }
        let j = await response.json();
        if (response.status >= 400) {
            // then we got an error
            throw new ApiError(response.status, j.error.message);
        }
        return j;
    } catch (e) {
        console.log("CAUGHT ERROR:", e)
        throw e
    }
}

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    toString() {
        return `${this.message}`;
    }
}

export { zapi };


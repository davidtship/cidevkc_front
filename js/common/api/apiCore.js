import jwtDecode from 'jwt-decode';
import axios from 'axios';
import config from '@/config';
// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = config.API_URL;
// intercepting to capture errors
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    let message;
    if (error && error.response && error.response.status === 404) {
        // Do nothing here intentionally, as 404 errors are expected in certain cases.
    }
    else if (error && error.response && error.response.status === 403) {
        window.location.href = '/access-denied';
    }
    else {
        switch (error.response.status) {
            case 401:
                message = 'Invalid credentials';
                break;
            case 403:
                message = 'Access Forbidden';
                break;
            case 404:
                message = 'Sorry! the data you are looking for could not be found';
                break;
            default: {
                message =
                    error.response && error.response.data
                        ? error.response.data['message']
                        : error.message || error;
            }
        }
        return Promise.reject(message);
    }
});
const AUTH_SESSION_KEY = 'user';
const setAuthorization = (token) => {
    if (token)
        axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
    else
        delete axios.defaults.headers.common['Authorization'];
};
const getUserFromSession = () => {
    const user = sessionStorage.getItem(AUTH_SESSION_KEY);
    return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};
class APICore {
    constructor() {
        Object.defineProperty(this, "get", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, params) => {
                let response;
                if (params) {
                    const queryString = params
                        ? Object.keys(params)
                            .map((key) => key + '=' + params[key])
                            .join('&')
                        : '';
                    response = axios.get(`${url}?${queryString}`, params);
                }
                else {
                    response = axios.get(`${url}`, params);
                }
                return response;
            }
        });
        Object.defineProperty(this, "getFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, params) => {
                let response;
                if (params) {
                    const queryString = params
                        ? Object.keys(params)
                            .map((key) => key + '=' + params[key])
                            .join('&')
                        : '';
                    response = axios.get(`${url}?${queryString}`, { responseType: 'blob' });
                }
                else {
                    response = axios.get(`${url}`, { responseType: 'blob' });
                }
                return response;
            }
        });
        Object.defineProperty(this, "getMultiple", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (urls, params) => {
                const reqs = [];
                let queryString = '';
                if (params) {
                    queryString = params
                        ? Object.keys(params)
                            .map((key) => key + '=' + params[key])
                            .join('&')
                        : '';
                }
                for (const url of urls) {
                    reqs.push(axios.get(`${url}?${queryString}`));
                }
                return axios.all(reqs);
            }
        });
        Object.defineProperty(this, "create", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, data) => {
                return axios.post(url, data);
            }
        });
        Object.defineProperty(this, "updatePatch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, data) => {
                return axios.patch(url, data);
            }
        });
        Object.defineProperty(this, "update", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, data) => {
                return axios.put(url, data);
            }
        });
        Object.defineProperty(this, "delete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url) => {
                return axios.delete(url);
            }
        });
        Object.defineProperty(this, "createWithFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, data) => {
                const formData = new FormData();
                for (const k in data) {
                    formData.append(k, data[k]);
                }
                const config = {
                    headers: {
                        ...axios.defaults.headers,
                        'content-type': 'multipart/form-data',
                    },
                };
                return axios.post(url, formData, config);
            }
        });
        Object.defineProperty(this, "updateWithFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (url, data) => {
                const formData = new FormData();
                for (const k in data) {
                    formData.append(k, data[k]);
                }
                const config = {
                    headers: {
                        ...axios.defaults.headers,
                        'content-type': 'multipart/form-data',
                    },
                };
                return axios.patch(url, formData, config);
            }
        });
        Object.defineProperty(this, "isUserAuthenticated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const user = this.getLoggedInUser();
                if (!user || (user && !user.token)) {
                    return false;
                }
                const decoded = jwtDecode(user.token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    console.warn('access token expired');
                    return false;
                }
                else {
                    return true;
                }
            }
        });
        Object.defineProperty(this, "setLoggedInUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (session) => {
                if (session)
                    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
                else {
                    sessionStorage.removeItem(AUTH_SESSION_KEY);
                }
            }
        });
        Object.defineProperty(this, "getLoggedInUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return getUserFromSession();
            }
        });
        Object.defineProperty(this, "setUserInSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (modifiedUser) => {
                const userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
                if (userInfo) {
                    const { token, user } = JSON.parse(userInfo);
                    this.setLoggedInUser({ token, ...user, ...modifiedUser });
                }
            }
        });
    }
}
const user = getUserFromSession();
if (user) {
    const { token } = user;
    if (token) {
        setAuthorization(token);
    }
}
export { APICore, setAuthorization };

import { HttpClient } from '../helpers';
function AuthService() {
    return {
        login: (values) => {
            return HttpClient.post('/login', values);
        },
        register: (values) => {
            return HttpClient.post('/register', values);
        },
        forgetPassword: (values) => {
            return HttpClient.post('/forgot-password', values);
        },
    };
}
export default AuthService();

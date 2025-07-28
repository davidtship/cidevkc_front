import { authApi, useAuthContext } from '@/common';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
export default function useLogin() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, saveSession } = useAuthContext();
    const redirectUrl = useMemo(() => (location.state && location.state.from ? location.state.from.pathname : '/'), [location.state]);
    const login = async (event, { email, password }) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.login({ email, password });
            setLoading(false);
            toast.success('Login successful!');
            setTimeout(() => {
                if (res.token) {
                    saveSession({ ...(res.user ?? {}), token: res.token });
                    navigate(redirectUrl);
                }
            }, 1500);
        }
        catch (error) {
            setLoading(false);
            toast.error('Adresse email incorrecte ou mot de passe!');
        }
    };
    return { loading, login, redirectUrl, isAuthenticated };
}

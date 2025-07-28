import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/Layouts/AuthLayout';
import TitleHelmet from '@/components/Common/TitleHelmet';
import { Button, Form, Stack } from 'react-bootstrap';
import AuthMinmal from './AuthMinmal';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const navigate = useNavigate();
    async function submitHandler(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        if (fd.get('username') != '' && fd.get('password') != '') {
            const formData = {
                email: fd.get('username'),
                password: fd.get('password'),
            };
            const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/auth/jwt/create/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json ',
                },
            });
            const resData = await res.json();
            console.log(resData);
            if (resData.email == fd.get('username')) {
                var access = resData.access;
                var profil = resData.image;
                var firstname = resData.first_name;
                var lastname = resData.last_name;
                var id = resData.id;
                document.cookie = 'access' + '=' + access + ';' + ' path=/';
                document.cookie = 'profilpicpath' + '=' + profil + ';' + ' path=/';
                document.cookie = 'firstname' + '=' + firstname + ';' + ' path=/';
                document.cookie = 'lastname' + '=' + lastname + ';' + ' path=/';
                document.cookie = 'id' + '=' + id + ';' + ' path=/';
                alert('Connexion reussi !!');
                navigate('/');
            }
            else if (resData.detail == 'No active account found with the given credentials') {
                alert('Votre compte a ete desactiver vous ne pouver pas vous connecter');
            }
            else if (resData.error == '21') {
                alert('Vous ne pouvez pas vous connecter avec cet equipement');
            }
            else {
                alert('Mot de passe ou utilisateur incorrectes !!');
            }
            var access = resData.access;
            var refresh = resData.refresh;
            document.cookie = 'access' + '=' + access + ';' + ' path=/';
        }
        else {
            ;
            <Alert severity="success">Veuillez remplir tout les champs!!!</Alert>;
            alert('Veuillez remplir tout les champs!!!');
        }
    }
    return (<>
      <TitleHelmet title="Login"/>
      <AuthLayout>
        <AuthMinmal>
          <div className="">
            <h4 className="fw-bold ">Connectez-vous à votre compte</h4>
            <p className="">Entrez vos coordonnées pour vous connecter à votre compte.</p>
          </div>
          <Form onSubmit={submitHandler}>
            <Form.Group className="">
              <Form.Control type="text" placeholder="Email" required name="username" id="username"/>
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Control type="password" name="password" id="password" placeholder="Password" required/>
            </Form.Group>
            <Stack direction="horizontal">
              <Form.Check type="checkbox" id="check-api-checkbox">
                <Form.Check.Input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                <Form.Check.Label>Se souvenir</Form.Check.Label>
              </Form.Check>
              <Link to="/auth/minimal/forgot-password" className="link-primary ms-auto">
                Mot de passe oublié?
              </Link>
            </Stack>
            <div className="d-grid gap-2 my-4">
              <Button type="submit" variant="primary" className="text-white">
                Se connecter
              </Button>
            </div>

            <div className="d-grid flex-wrap d-sm-flex gap-2"></div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </>);
};
export default Login;

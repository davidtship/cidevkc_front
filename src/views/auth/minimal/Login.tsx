import { useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/common'
import AuthLayout from '@/Layouts/AuthLayout'
import TitleHelmet from '@/components/Common/TitleHelmet'
import { Button, Form, Stack } from 'react-bootstrap'
import AuthMinmal from './AuthMinmal'

const API_URL = import.meta.env.VITE_API_URL;

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const navigate = useNavigate()

   useEffect(() => {
   document.cookie = "access"+"="+";"+" path=/";
     document.cookie = "profilpicpath"+"="+";"+" path=/";
     document.cookie = "firstname"+"="+";"+" path=/";
    document.cookie = "lastname" + "=" + ";" + " path=/";
  }, [])


  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const username = fd.get('username')?.toString() || ''
    const password = fd.get('password')?.toString() || ''

    if (username !== '' && password !== '') {
      const formData = {
        email: username,
        password: password,
      }

      try {
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/auth/jwt/create/', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const resData = await res.json()

        if (resData.email === username) {
          const { access, image, first_name, last_name, id } = resData
          document.cookie = `access=${access}; path=/`
          document.cookie = `profilpicpath=${image}; path=/`
          document.cookie = `firstname=${first_name}; path=/`
          document.cookie = `lastname=${last_name}; path=/`
          document.cookie = `id=${id}; path=/`
          alert('Connexion réussie !!')
          navigate('/')
        } else if (
          resData.detail === 'No active account found with the given credentials'
        ) {
          alert('Votre compte a été désactivé, vous ne pouvez pas vous connecter')
        } else if (resData.error === '21') {
          alert('Vous ne pouvez pas vous connecter avec cet équipement')
        } else {
          alert('Mot de passe ou utilisateur incorrect !!')
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('Erreur lors de la connexion')
      }
    } else {
      alert('Veuillez remplir tous les champs !!!')
    }
  }

  return (
    <>
      <TitleHelmet title="Login" />
      <AuthLayout>
        <AuthMinmal>
          <div>
            <h4 className="fw-bold">Connectez-vous à votre compte</h4>
            <p>Entrez vos coordonnées pour vous connecter à votre compte.</p>
          </div>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Email"
                required
                name="username"
                id="username"
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3 position-relative">
              <Form.Control
                type="password"
                name="password"
                id="password"
                placeholder="Mot de passe"
                required
              />
            </Form.Group>

            <Stack direction="horizontal">
              <Form.Check type="checkbox" id="check-api-checkbox">
                <Form.Check.Input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Form.Check.Label>Se souvenir</Form.Check.Label>
              </Form.Check>
              <Link to="/auth/minimal/forgot-password" className="link-primary ms-auto">
                Mot de passe oublié ?
              </Link>
            </Stack>

            <div className="d-grid gap-2 my-4">
              <Button type="submit" variant="primary" className="text-white">
                Se connecter
              </Button>
            </div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </>
  )
}

export default Login

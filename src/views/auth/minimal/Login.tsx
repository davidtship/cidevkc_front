import { useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Stack, Alert } from 'react-bootstrap'
import AuthLayout from '@/Layouts/AuthLayout'
import TitleHelmet from '@/components/Common/TitleHelmet'
import AuthMinmal from './AuthMinmal'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const API_URL = "https://cidevkc-09c92764069d.herokuapp.com"

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [variant, setVariant] = useState<'success' | 'danger' | 'warning' | 'info'>('info')
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.cookie = "access=; path=/"
    document.cookie = "profilpicpath=; path=/"
    document.cookie = "firstname=; path=/"
    document.cookie = "lastname=; path=/"
    document.cookie = "id=; path=/"

    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setDeviceId(result.visitorId)
    }

    loadFingerprint()
  }, [])

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const username = fd.get('username')?.toString() || ''
    const password = fd.get('password')?.toString() || ''

    if (!username || !password) {
      setVariant('warning')
      setMessage('Veuillez remplir tous les champs.')
      return
    }

    if (!deviceId) {
      setVariant('danger')
      setMessage("Impossible d’identifier l’appareil.")
      return
    }

    try {
      setLoading(true)

      // Étape 1 : Connexion - Récupération du token
      const loginRes = await fetch(`${API_URL}/auth/jwt/create/`, {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      const resData = await loginRes.json()

      if (!loginRes.ok) {
        if (resData?.detail?.includes('No active account')) {
          setVariant('warning')
          setMessage('Votre compte est désactivé.')
        } else if (resData?.error === '18') {
          setVariant('warning')
          setMessage('Utilisateur inexistant.')
        } else if (resData?.error === '19') {
          setVariant('warning')
          setMessage('Mot de passe incorrect.')
        } else {
          setVariant('danger')
          setMessage("Échec de connexion.")
        }
        return
      }

      const { access, image, first_name, last_name, id } = resData

      // Étape 2 : Vérification de l'appareil
      const deviceRes = await fetch(`${API_URL}/api/check_device/?fingerprint=${deviceId}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      const deviceData = await deviceRes.json()

      // Étape 2.1 : Vérifier le rôle de l'utilisateur
      const userRes = await fetch(`${API_URL}/auth/users/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      const userData = await userRes.json()
      const isSuperAdmin = userData?.type_user === 'super_admin'

      // Étape 2.2 : Refuser si appareil non autorisé et pas super admin
      alert(isSuperAdmin);
      if (!deviceData.allowed && !isSuperAdmin) {
        setVariant('danger')
        setMessage("Appareil non autorisé. Contactez votre administrateur.")
        return
      }

      // Étape 3 : Stockage des cookies
      document.cookie = `access=${access}; path=/`
      document.cookie = `profilpicpath=${image}; path=/`
      document.cookie = `firstname=${first_name}; path=/`
      document.cookie = `lastname=${last_name}; path=/`
      document.cookie = `id=${id}; path=/`

      setVariant('success')
      setMessage('Connexion réussie ! Redirection...')
      setTimeout(() => navigate('/'), 1500)

    } catch (error) {
      console.error('Erreur de connexion :', error)
      setVariant('danger')
      setMessage('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
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

          {message && (
            <Alert variant={variant} onClose={() => setMessage(null)} dismissible>
              {message}
            </Alert>
          )}

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
              <Button type="submit" variant="primary" className="text-white" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </Form>
        </AuthMinmal>
      </AuthLayout>
    </>
  )
}

export default Login

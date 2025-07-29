import { Button, Col, Card, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

// Utility to get a cookie value by name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts[1].split(';')[0]
  }
  return undefined
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<any[]>([]) // Placeholder, not used in form yet
  const navigate = useNavigate()
  const token = getCookie('access')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget)

const nom = fd.get('nom')
const postnom = fd.get('postnom')
const emailRaw = fd.get('email')
const motdepasseRaw = fd.get('motdepass')
const type_userRaw = fd.get('type_user')

if (!nom || !postnom || !emailRaw || !motdepasseRaw || !type_userRaw) {
  alert('Veuillez remplir tous les champs.')
  return
}

const first_name = nom.toString().trim()
const last_name = postnom.toString().trim()
const email = emailRaw.toString().trim()
const password = motdepasseRaw.toString().trim()
const type_user = type_userRaw.toString().trim()

const username = first_name + last_name

    const formData = {
      first_name,
      last_name,
      email,
      password,
      type_user,
      username
    }

    try {
      const res  =  await fetch('http://127.0.0.1:8000/auth/users/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const resData = await res.json()
      console.log(resData)
      window.location.reload()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erreur lors de l’envoi du formulaire.')
    }
  }

  return (
    <>
      <h4 style={style1}>Ajout d&apos;utilisateur</h4>

      <Col xl={12} className="d-flex justify-content-center">
        <Card style={{ width: '60%', padding: '20px' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formNom">
              <Form.Label column sm={3}>Nom:</Form.Label>
              <Col sm={9}>
                <Form.Control name="nom" type="text" placeholder="Entrez le nom" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPostnom">
              <Form.Label column sm={3}>Postnom:</Form.Label>
              <Col sm={9}>
                <Form.Control name="postnom" type="text" placeholder="Entrez le postnom" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={3}>Adresse email:</Form.Label>
              <Col sm={9}>
                <Form.Control name="email" type="email" placeholder="Entrez l'email" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPassword">
              <Form.Label column sm={3}>Mot de passe:</Form.Label>
              <Col sm={9}>
                <Form.Control name="motdepass" type="password" placeholder="Entrez le mot de passe" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formTypeUser">
              <Form.Label column sm={3}>Type d'utilisateur:</Form.Label>
              <Col sm={9}>
                <Form.Select name="type_user" required>
                  <option value="">-- Sélectionnez un type --</option>
                  <option value="admin">Admin</option>
                  <option value="simple">Simple</option>
                  <option value="super_admin">Super_admin</option>
                </Form.Select>
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary" style={{ width: '200px', height: '38px' }}>
                Ajouter
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </>
  )
}

export default Formulaire

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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const nom = fd.get('nom')?.toString().trim()
    const postnom = fd.get('postnom')?.toString().trim()
    const email = fd.get('email')?.toString().trim()
    const motdepasse = fd.get('motdepass')?.toString().trim()
    const image = fd.get('image') as File

    if (!nom || !postnom || !email || !motdepasse) {
      alert('Veuillez remplir tous les champs requis.')
      return
    }

    const formData = new FormData()
    formData.append('nom', nom)
    formData.append('postnom', postnom)
    formData.append('email', email)
    formData.append('motdepasse', motdepasse)
    if (image) {
      formData.append('image', image)
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/utilisateur', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const resData = await res.json()
      console.log('User added:', resData)
      navigate('/liste_utilisateurs')
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error)
      alert("Une erreur s'est produite lors de l'ajout.")
    }
  }

  return (
    <>
      <h4 style={style1}>Ajout d&apos;utilisateur</h4>

      <Col xl={12} className="d-flex justify-content-center">
        <Card style={{ width: '60%', padding: '20px' }}>
          <Form onSubmit={submitHandler}>
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

            <Form.Group as={Row} className="mb-4" controlId="formFile">
              <Form.Label column sm={3}>Fichier:</Form.Label>
              <Col sm={9}>
                <Form.Control name="image" type="file" />
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

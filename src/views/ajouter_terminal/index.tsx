import { Button, Col, Card, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// Optional: For consistent spacing
const style1: React.CSSProperties = {
  marginBottom: '3%',
}

// Utility to get cookie by name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts[1].split(';')[0]
  }
  return undefined
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<any[]>([]) // Not used in this component, but typed
  const navigate = useNavigate()
  const token = getCookie('access')

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const model = fd.get('model')?.toString().trim()
    const adresse = fd.get('adresse')?.toString().trim()

    if (model && adresse) {
      const formData = {
        model,
        adresse,
      }

      try {
        const res = await fetch('http://127.0.0.1:/api/terminal', {
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
    } else {
      alert('Veuillez remplir tout champs !!!')
    }
  }

  return (
    <>
      <h4 style={style1}>Ajout d&apos;un terminal</h4>

      <Col xl={12} className="d-flex justify-content-center">
        <Card style={{ width: '60%', padding: '20px' }}>
          <Form onSubmit={submitHandler}>
            {/* Model */}
            <Form.Group as={Row} className="mb-3" controlId="formModel">
              <Form.Label column sm={3}>
                Model
              </Form.Label>
              <Col sm={9}>
                <Form.Control name="model" type="text" placeholder="Entrez le model" required />
              </Col>
            </Form.Group>

            {/* Adresse MAC */}
            <Form.Group as={Row} className="mb-3" controlId="formAdresse">
              <Form.Label column sm={3}>
                Adresse MAC
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="adresse"
                  type="text"
                  placeholder="Entrez l'adresse de votre équipement"
                  required
                />
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

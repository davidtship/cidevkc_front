import { Button, Col, Card, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const style1 = {
  marginBottom: '3%',
}

const Formulaire = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()

 function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts[1].split(';')[0];
  }
  return undefined;
}

  const token = getCookie('access')

  async function submitHandler(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    var model = fd.get('model')
    var adresse = fd.get('adresse')

    if (fd.get('model') != '' && fd.get('adresse') != '') {
      const formData = {
        model: model,
        adresse: adresse,
      }

      const res = await fetch('http://127.0.0.1:8000/api/terminal', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json ',
        },
      })
      const resData = await res.json()
      location.reload()
    } else {
      alert('Veuillez remplir tout champs !!!')
    }
  }

  return (
    <>
      <h4 style={style1}>Ajout d'un terminal</h4>

      <Col xl={12} className="d-flex justify-content-center">
        <Card style={{ width: '60%', padding: '20px' }}>
          <Form onSubmit={submitHandler}>
            {/* Nom */}
            <Form.Group as={Row} className="mb-3" controlId="formNom">
              <Form.Label column sm={3}>
                Model
              </Form.Label>
              <Col sm={9}>
                <Form.Control name="model" id="model" type="text" placeholder="Entrez le model" />
              </Col>
            </Form.Group>

            {/* Postnom */}
            <Form.Group as={Row} className="mb-3" controlId="formPostnom">
              <Form.Label column sm={3}>
                Adresse mac
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="adresse"
                  id="adresse"
                  type="text"
                  placeholder="Entrez l'adresse de votre equipement"
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

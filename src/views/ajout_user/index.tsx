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
    var nom = fd.get('nom')
    var postnom = fd.get('nom')
    var email = fd.get('nom')
    var motpasse = fd.get('nom')

    if (fd.get('codech') != '' && fd.get('datec') != '') {
      const formData = {
        date_finale: fd.get('datef'),
        mois_echeance: mois,
      }

      const res = await fetch(baseUrl + 'api/echeances/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json ',
        },
      })
      const resData = await res.json()

      if (resData.code_ech == formData.code_ech) alert('Cette echeance a ete creer avec success !!')
      router.push('/echeances', { scroll: false })
    } else {
      alert('Veuillez remplir tout champs !!!')
    }
  }
  return (
    <>
      <h4 style={style1}>Ajout d'utilisateur</h4>

      <Col xl={12} className="d-flex justify-content-center">
        <Card style={{ width: '60%', padding: '20px' }}>
          <Form>
            {/* Nom */}
            <Form.Group as={Row} className="mb-3" controlId="formNom">
              <Form.Label column sm={3}>
                Nom:
              </Form.Label>
              <Col sm={9}>
                <Form.Control name="nom" id="nom" type="text" placeholder="Entrez le nom" />
              </Col>
            </Form.Group>

            {/* Postnom */}
            <Form.Group as={Row} className="mb-3" controlId="formPostnom">
              <Form.Label column sm={3}>
                Postnom:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="postnom"
                  id="postnom"
                  type="text"
                  placeholder="Entrez le postnom"
                />
              </Col>
            </Form.Group>

            {/* Adresse email */}
            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={3}>
                Adresse email:
              </Form.Label>
              <Col sm={9}>
                <Form.Control name="email" id="email" type="email" placeholder="Entrez l'email" />
              </Col>
            </Form.Group>

            {/* Mot de passe */}
            <Form.Group as={Row} className="mb-3" controlId="formPassword">
              <Form.Label column sm={3}>
                Mot de passe:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="motdepass"
                  id="motdepasse"
                  type="password"
                  placeholder="Entrez le mot de passe"
                />
              </Col>
            </Form.Group>

            {/* Fichier (Upload) */}
            <Form.Group as={Row} className="mb-4" controlId="formFile">
              <Form.Label column sm={3}>
                Fichier:
              </Form.Label>
              <Col sm={9}>
                <Form.Control name="image" id="image" type="file" />
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                style={{ width: '200px', height: '38px' }}
                onClick={() => navigate('/ajout_user')}>
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

import {
  Button,
  Col,
  Dropdown,
  DropdownDivider,
  Card,
  Table,
  ProgressBar,
  Row,
  Stack,
  Pagination,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'

const style1 = {
  marginBottom: '3%',
}

const Formulaire = () => {
  const [data, setdata] = useState([])
  async function changestatus(pk) {
    const res = await fetch('http://localhost:8000/api/changestatus/' + pk, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
    location.reload()
  }
  useEffect(() => {
    async function fetchMyAPI() {
      const res = await fetch('http://localhost:8000/api/form', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      setdata(resData)
    }
    fetchMyAPI()
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <h4 style={style1}>Questionnaires</h4>
      <Button
        style={{ width: '10%', marginBottom: '2.5%' }}
        onClick={() => navigate('/ajouter_formulaire')}
        variant="primary">
        Ajouter
      </Button>
      <Col xl={18}>
        <Card>
          <Card.Header className="py-3 pe-3 d-flex justify-content-between align-items-center">
            <Card.Title>Questionnaire</Card.Title>
            <Dropdown className="ms-auto" drop="down">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" style={{ marginTop: '0.875rem' }}>
                <Dropdown.Item>
                  <i className="fi fi-rr-share"></i>
                  <span className="ms-3">Share</span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="fi fi-rr-refresh"></i>
                  <span className="ms-3">Refresh</span>
                </Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item>
                  <i className="fi fi-rr-stats"></i>
                  <span className="ms-3">All Channels</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Table responsive className="mb-0">
            <thead>
              <tr className="border-b">
                <th>Titre</th>
                <th>Status</th>
                <th>Action</th>
                <th>Lien</th>
                <th>Date</th>
                <th scope="row">Utilisateurs</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ title, lien, id, created_at, statut }, index) => (
                <tr key={index}>
                  <td>{title}</td>
                  <td>
                    {statut ? (
                      <span className={`badge bg-primary-subtle text-primary`}>Publié</span>
                    ) : (
                      <span className={`badge bg-primary-subtle text-primary`}>Non publié</span>
                    )}
                  </td>
                  <td>
                    {statut ? (
                      <Button
                        onClick={() => changestatus(id)}
                        style={{ marginRight: '10px' }}
                        variant="secondary">
                        <span className="">Retirer</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => changestatus(id)}
                        style={{ marginRight: '10px' }}
                        variant="success">
                        <span className="">Publier</span>
                      </Button>
                    )}
                    <Link to={`/voir_formulaire/` + id}>
                      <Button style={{ marginRight: '10px' }} variant="primary">
                        <span className="">Voir</span>
                      </Button>
                    </Link>
                    <Button style={{ marginRight: '10px' }} variant="secondary">
                      <span className="">Modifier</span>
                    </Button>
                    <Button style={{ marginRight: '10px' }} variant="danger">
                      <span className="">Supprimer</span>
                    </Button>
                  </td>
                  <td>
                    {statut ? (
                      <Link to={`/apercu/` + id}>
                        <Button style={{ marginRight: '10px' }} variant="success">
                          <span className="">Apercu</span>
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => changestatus(id)}
                        style={{ marginLeft: '-20px' }}
                        variant="contained">
                        <span className="">Non disponible</span>
                      </Button>
                    )}
                  </td>

                  <td>{created_at}</td>
                  <td>davidtship</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Card.Footer className="border-top-0">
            <Pagination className="mb-0">
              <Pagination.Prev />
              {[...Array(4)].map((_, index) => (
                <Pagination.Item key={index}>{index + 1}</Pagination.Item>
              ))}
              <Pagination.Next />
            </Pagination>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default Formulaire

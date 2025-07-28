import {
  Button,
  Col,
  Dropdown,
  DropdownDivider,
  Card,
  Table,
  Pagination,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Define the shape of each form item
interface FormulaireData {
  id: number
  title: string
  lien: string
  created_at: string
  statut: boolean
  // You can add more fields like 'user' if needed
}

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<FormulaireData[]>([])
  const navigate = useNavigate()

  // Fetch all forms
  useEffect(() => {
    async function fetchMyAPI(): Promise<void> {
      try {
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/form', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resData: FormulaireData[] = await res.json()
        setData(resData)
      } catch (err) {
        console.error('Failed to fetch forms:', err)
      }
    }

    fetchMyAPI()
  }, [])

  // Change publication status
  async function changestatus(pk: number): Promise<void> {
    try {
      const res = await fetch(`http://localhost:8000/api/changestatus/${pk}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await res.json()
      location.reload()
    } catch (err) {
      console.error('Failed to change status:', err)
    }
  }

  return (
    <>
      <h4 style={style1}>Questionnaires</h4>

      <Button
        style={{ width: '10%', marginBottom: '2.5%' }}
        onClick={() => navigate('/ajouter_formulaire')}
        variant="primary"
      >
        Ajouter
      </Button>

      <Col xl={18 as any}>
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
                <th>Utilisateurs</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ title, lien, id, created_at, statut }, index) => (
                <tr key={id}>
                  <td>{title}</td>
                  <td>
                    {statut ? (
                      <span className="badge bg-primary-subtle text-primary">Publié</span>
                    ) : (
                      <span className="badge bg-primary-subtle text-primary">Non publié</span>
                    )}
                  </td>
                  <td>
                    <Button
                      onClick={() => changestatus(id)}
                      style={{ marginRight: '10px' }}
                      variant={statut ? 'secondary' : 'success'}
                    >
                      <span>{statut ? 'Retirer' : 'Publier'}</span>
                    </Button>

                    <Link to={`/voir_formulaire/${id}`}>
                      <Button style={{ marginRight: '10px' }} variant="primary">
                        Voir
                      </Button>
                    </Link>

                    <Button style={{ marginRight: '10px' }} variant="secondary">
                      Modifier
                    </Button>

                    <Button style={{ marginRight: '10px' }} variant="danger">
                      Supprimer
                    </Button>
                  </td>

                  <td>
                    {statut ? (
                      <Link to={`/apercu/${id}`}>
                        <Button style={{ marginRight: '10px' }} variant="success">
                          Aperçu
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        style={{ marginLeft: '-20px' }}
                        variant="secondary"
                      >
                        Non disponible
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

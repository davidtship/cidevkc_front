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

// Define the type of each item in the response
interface FormData {
  id: number
  user: {
    first_name: string
    last_name: string
  }
  form: {
    id: number
    title: string
  }
  created_at: string
  statut: boolean
}

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<FormData[]>([])
 

  // Get cookie value by name
  function getCookie(name: string): string {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  const token = getCookie('access')

  // Fetch data from API
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/returndataformuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const resData: FormData[] = await res.json()
        setData(resData)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [token])

  // Toggle published status
  async function changeStatus(pk: number): Promise<void> {
    try {
      await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/changestatus/${pk}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Refresh data
      const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/returndataformuser/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const resData: FormData[] = await res.json()
      setData(resData)
    } catch (err) {
      console.error('Failed to change status:', err)
    }
  }

  return (
    <>
      <h4 style={style1}>Réponses</h4>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Réponses Utilisateurs</Card.Title>
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Share</Dropdown.Item>
                <Dropdown.Item>Refresh</Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item>All Channels</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>

          <Table responsive bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Utilisateur</th>
                <th>Questionnaire</th>
                <th>Date de soumission</th>
                <th>Voir les réponses</th>
                <th>Date de création</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Aucun formulaire trouvé.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {item.user.first_name} {item.user.last_name}
                    </td>
                    <td>{item.form.title}</td>
                    <td>{item.created_at}</td>
                    <td>
                      <Link to={`/voir_reponses/${item.form.id}`}>
                        <Button className="me-2" variant="success">
                          Voir
                        </Button>
                      </Link>
                    </td>
                    <td>
                      {item.statut ? (
                        <Link to={`/apercu/${item.id}`}>
                          <Button variant="success">Aperçu</Button>
                        </Link>
                      ) : (
                        <Button disabled variant="secondary">
                          Non disponible
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

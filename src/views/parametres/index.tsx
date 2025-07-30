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

// Type des données reçues depuis l'API
interface TerminalData {
  device_uuid: string
  device_name: string
  fingerprint: string
  created_at: string
}

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

const ListeTerminaux: React.FC = () => {
  const [data, setData] = useState<TerminalData[]>([])
  const navigate = useNavigate()

  const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  const token = getCookie('access')

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/terminal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const resData: TerminalData[] = await res.json()
        setData(resData)
        console.log('Terminaux récupérés:', resData)
      } catch (err) {
        console.error('Erreur lors du chargement des terminaux:', err)
      }
    }

    fetchData()
  }, [token])

  return (
    <>
      <h4 style={style1}>Paramètres</h4>
      <Button
        style={{ width: '10%', marginBottom: '2.5%' }}
        onClick={() => navigate('/ajout_terminal')}
        variant="primary"
      >
        Ajouter
      </Button>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Liste des terminaux</Card.Title>
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Exporter</Dropdown.Item>
                <Dropdown.Item>Rafraîchir</Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item>Tous les appareils</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>

          <Table responsive bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nom de l’appareil</th>
                <th>UUID</th>
                <th>Fingerprint</th>
                <th>Date d’ajout</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Aucun terminal enregistré.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.device_name}</td>
                    <td>{item.device_uuid}</td>
                    <td>{item.fingerprint}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>
                      <Button className="me-2" variant="danger" size="sm">
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <Card.Footer className="border-top-0">
            <Pagination className="mb-0">
              <Pagination.Prev />
              {[...Array(3)].map((_, index) => (
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

export default ListeTerminaux

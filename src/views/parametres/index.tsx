import {
  Button,
  Col,
  Dropdown,
  DropdownDivider,
  Card,
  Table,
  Pagination,
  Spinner,
  Modal,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
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
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedTerminal, setSelectedTerminal] = useState<TerminalData | null>(null)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()

  const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  const token = getCookie('access')

  const fetchTerminals = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/terminal`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const resData: TerminalData[] = await res.json()
      setData(resData)
    } catch (err) {
      console.error('Erreur lors du chargement des terminaux:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTerminals()
  }, [token])

  const handleDeleteClick = (terminal: TerminalData) => {
    setSelectedTerminal(terminal)
    setShowModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedTerminal) return

    try {
      const res = await fetch(
        `${baseUrl}/api/terminal/${selectedTerminal.device_uuid}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.ok) {
        setData((prev) =>
          prev.filter((item) => item.device_uuid !== selectedTerminal.device_uuid)
        )
      } else {
        console.error('Échec de la suppression')
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    } finally {
      setShowModal(false)
      setSelectedTerminal(null)
    }
  }

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

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Chargement des terminaux...</p>
            </div>
          ) : (
            <>
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
                          <Button
                            className="me-2"
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                          >
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
            </>
          )}
        </Card>
      </Col>

      {/* Modal de confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTerminal ? (
            <p>
              Voulez-vous vraiment supprimer le terminal{' '}
              <strong>{selectedTerminal.device_name}</strong> ?
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ListeTerminaux

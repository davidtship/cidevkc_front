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
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  type_user: string
  date_joined: string
}

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

const Formulaire = () => {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()

  function getCookie(name: string): string {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  const token = getCookie('access')

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${baseUrl}/api/listeusers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const resData: User[] = await res.json()
        setData(resData)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id)
    setShowModal(true)
  }

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      // TODO: supprimer l'utilisateur via l'API
      console.log(`Suppression de l'utilisateur avec l'id ${userToDelete}`)

      setShowModal(false)
      setUserToDelete(null)

      // Optionnel : recharger les données après suppression
      // await fetchData()
    }
  }

  return (
    <>
      <h4 style={style1}>Utilisateurs</h4>
      <Button
        style={{ width: '10%', marginBottom: '2.5%' }}
        onClick={() => navigate('/ajout_user')}
        variant="primary">
        Ajouter
      </Button>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Liste des utilisateurs</Card.Title>
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

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Chargement...</span>
                </Spinner>
                <div className="mt-2 text-muted">Chargement des utilisateurs...</div>
              </div>
            ) : (
              <Table responsive bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Postnom</th>
                    <th>Adresse email</th>
                    <th>Type d'utilisateur</th>
                    <th>Action</th>
                    <th>Date d'inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    data.map(({ id, first_name, last_name, email, type_user, date_joined }, index) => (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{first_name}</td>
                        <td>{last_name}</td>
                        <td>{email}</td>
                        <td>{type_user}</td>
                        <td>
                          <Link to={`/voir_reponses/${id}`}>
                            <Button className="me-2" variant="primary">Activer</Button>
                          </Link>
                          <Link to={`/voir_reponses/${id}`}>
                            <Button className="me-2" variant="warning">Modifier</Button>
                          </Link>
                          <Link to={`/voir_reponses/${id}`}>
                            <Button className="me-2" variant="secondary">Changer de mot de passe</Button>
                          </Link>
                          <Button
                            className="me-2"
                            variant="danger"
                            onClick={() => handleDeleteClick(id)}
                          >
                            Supprimer
                          </Button>
                        </td>
                        <td>{new Date(date_joined).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>

          {!loading && (
            <Card.Footer className="border-top-0">
              <Pagination className="mb-0">
                <Pagination.Prev />
                {[...Array(4)].map((_, index) => (
                  <Pagination.Item key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next />
              </Pagination>
            </Card.Footer>
          )}
        </Card>
      </Col>

      {/* Modal de confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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

export default Formulaire

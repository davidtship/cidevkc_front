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

interface FormulaireData {
  id: number
  title: string
  lien: string
  created_at: string
  statut: boolean
}

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<FormulaireData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchMyAPI(): Promise<void> {
      try {
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/form', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const resData: FormulaireData[] = await res.json()
        setData(resData)
      } catch (err) {
        console.error('Failed to fetch forms:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyAPI()
  }, [])

  async function changestatus(pk: number): Promise<void> {
    try {
      const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/changestatus/${pk}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      await res.json()
      location.reload()
    } catch (err) {
      console.error('Failed to change status:', err)
    }
  }

  // ✅ Supprimer formulaire
  const handleDelete = async () => {
    if (!selectedFormId) return

    try {
      // 👉 Implémente ici la suppression API avec selectedFormId
      // Exemple :
      // await fetch(`https://yourapi.com/api/deleteform/${selectedFormId}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      // })

      console.log(`Formulaire supprimé avec l'ID: ${selectedFormId}`)

      // Après suppression, mets à jour les données localement :
      setData(prev => prev.filter(form => form.id !== selectedFormId))
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    } finally {
      setShowModal(false)
      setSelectedFormId(null)
    }
  }

  return (
    <>
      <h4 style={style1}>Questionnaires</h4>

      <Button
        style={{ width: '10%', marginBottom: '2.5%' }}
        onClick={() => navigate('/ajouter_formulaire')}
        variant="primary">
        Ajouter
      </Button>

      <Col xl={12}>
        <Card>
          <Card.Header className="py-3 pe-3 d-flex justify-content-between align-items-center">
            <Card.Title>Questionnaire</Card.Title>
            <Dropdown className="ms-auto" drop="down">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" style={{ marginTop: '0.875rem' }}>
                <Dropdown.Item><i className="fi fi-rr-share"></i> <span className="ms-3">Share</span></Dropdown.Item>
                <Dropdown.Item><i className="fi fi-rr-refresh"></i> <span className="ms-3">Refresh</span></Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item><i className="fi fi-rr-stats"></i> <span className="ms-3">All Channels</span></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary" />
              <div className="mt-2 text-muted">Chargement des questionnaires...</div>
            </div>
          ) : (
            <>
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
                  {data.map(({ title, lien, id, created_at, statut }) => (
                    <tr key={id}>
                      <td>{title}</td>
                      <td>
                        {statut ? (
                          <span className="badge bg-primary-subtle text-primary">Publié</span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary">Non publié</span>
                        )}
                      </td>
                      <td>
                        <Button
                          onClick={() => changestatus(id)}
                          className="me-2"
                          variant={statut ? 'secondary' : 'success'}>
                          {statut ? 'Retirer' : 'Publier'}
                        </Button>
                        <Link to={`/voir_formulaire/${id}`}>
                          <Button className="me-2" variant="primary">Voir</Button>
                        </Link>
                        <Button className="me-2" variant="secondary">Modifier</Button>
                        <Button
                          className="me-2"
                          variant="danger"
                          onClick={() => {
                            setSelectedFormId(id)
                            setShowModal(true)
                          }}>
                          Supprimer
                        </Button>
                      </td>
                      <td>
                        {statut ? (
                          <Link to={`/apercu/${id}`}>
                            <Button variant="success">Aperçu</Button>
                          </Link>
                        ) : (
                          <Button disabled variant="secondary">Non disponible</Button>
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
            </>
          )}
        </Card>
      </Col>

      {/* ✅ MODAL DE CONFIRMATION */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Es-tu sûr de vouloir supprimer ce questionnaire ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Formulaire

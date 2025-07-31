import { useState, useEffect } from 'react'
import { Button, Card, Table, Spinner, Row, Col, Modal, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface Option {
  id: number
  texte: string
}

interface Question {
  id: number
  texte: string
  type: string
  options: Option[]
}

interface Section {
  id: number
  titre: string
  questions: Question[]
  sous_sections: Section[]
}

interface FormulaireData {
  id: number
  titre: string
  sections: Section[]
  etat: boolean
  date_creation: string
}

const ITEMS_PER_PAGE = 5

const ListeFormulaires = () => {
  const [data, setData] = useState<FormulaireData[]>([])
  const [filtered, setFiltered] = useState<FormulaireData[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  // Filtres date + état
  const [filterDay, setFilterDay] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterEtat, setFilterEtat] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [formulaireASupprimer, setFormulaireASupprimer] = useState<number | null>(null)

  const handleShowModal = (id: number) => {
    setFormulaireASupprimer(id)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormulaireASupprimer(null)
  }

  const handleDelete = async () => {
    if (!formulaireASupprimer) return

    try {
      const response = await fetch(`${baseUrl}/api/formulaires/${formulaireASupprimer}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const updated = data.filter((form) => form.id !== formulaireASupprimer)
        setData(updated)
      } else {
        alert("Échec de la suppression.")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Une erreur est survenue.")
    } finally {
      handleCloseModal()
    }
  }

  useEffect(() => {
    async function fetchFormulaires() {
      try {
        const response = await fetch(`${baseUrl}/api/list-formulaires/`, {
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) throw new Error('Erreur de chargement')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFormulaires()
  }, [])

  // Filtres appliqués
  useEffect(() => {
    let results = data

    if (search) {
      results = results.filter((f) => f.titre.toLowerCase().includes(search.toLowerCase()))
    }

    if (filterEtat !== '') {
      const boolValue = filterEtat === 'publie'
      results = results.filter((f) => f.etat === boolValue)
    }

    results = results.filter((f) => {
      const date = new Date(f.date_creation)
      const matchesDay = filterDay ? date.getDate() === parseInt(filterDay) : true
      const matchesMonth = filterMonth ? date.getMonth() + 1 === parseInt(filterMonth) : true
      const matchesYear = filterYear ? date.getFullYear() === parseInt(filterYear) : true
      return matchesDay && matchesMonth && matchesYear
    })

    results.sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())

    setFiltered(results)
    setPage(1)
  }, [search, data, filterDay, filterMonth, filterYear, filterEtat])

  const paginatedData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  return (
    <>
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col><h4>📋 Liste des formulaires</h4></Col>
            <Col className="text-end">
              <Link to="/ajouter_formulaire">
                <Button variant="primary">Ajouter un formulaire</Button>
              </Link>
            </Col>
          </Row>

          <Row className="mb-3 g-2">
            <Col md={3}>
              <Form.Control
                placeholder="🔍 Rechercher par titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                placeholder="Jour (1-31)"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                placeholder="Mois (1-12)"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                placeholder="Année (ex: 2025)"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={filterEtat} onChange={(e) => setFilterEtat(e.target.value)}>
                <option value="">Tous les états</option>
                <option value="publie">Publié</option>
                <option value="non_publie">Non publié</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <>
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Contenu</th>
                    <th>État</th>
                    <th>Action</th>
                    <th>Date</th>
                    <th>Auteur</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((formulaire) => (
                    <tr key={formulaire.id}>
                      <td>{formulaire.titre}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary">
                          {formulaire.sections.length > 0 ? 'Contenu présent' : 'Vide'}
                        </span>
                      </td>
                      <td>
                        {formulaire.etat
                          ? <span className="badge bg-success-subtle text-success">Publié</span>
                          : <span className="badge bg-danger-subtle text-danger">Non publié</span>
                        }
                      </td>
                      <td>
                        <Link to={`/voir_formulaire/${formulaire.id}`}>
                          <Button size="sm" variant="success" className="me-1">Publier</Button>
                        </Link>
                        <Link to={`/apercu/${formulaire.id}`}>
                          <Button size="sm" variant="secondary" className="me-1">Essayer</Button>
                        </Link>
                        <Link to={`/voir_formulaire/${formulaire.id}`}>
                          <Button size="sm" variant="primary" className="me-1">Voir</Button>
                        </Link>
                        <Link to={`/modifier/${formulaire.id}`}>
                          <Button size="sm" variant="warning" className="me-1">Modifier</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleShowModal(formulaire.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                      <td>{new Date(formulaire.date_creation).toLocaleDateString()}</td>
                      <td>davidtship</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>{filtered.length} résultats</div>
                <div>
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="me-2"
                  >
                    Précédent
                  </Button>
                  Page {page} / {totalPages}
                  <Button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="ms-2"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal suppression */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Voulez-vous vraiment supprimer ce formulaire ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ListeFormulaires

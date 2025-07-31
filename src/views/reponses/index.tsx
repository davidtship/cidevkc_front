import {
  Button,
  Col,
  Dropdown,
  DropdownDivider,
  Card,
  Table,
  Pagination,
  Spinner,
  Row,
  Form,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface Reponse {
  question: string
  valeur: string | string[]
}

interface FormulaireReponse {
  id: number
  formulaire: {
    id: number
    titre: string
  }
  utilisateur: string
  date_soumission: string
  reponses: Reponse[]
}

const Formulaire: React.FC = () => {
  const [data, setData] = useState<FormulaireReponse[]>([])
  const [filteredData, setFilteredData] = useState<FormulaireReponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  // Filtres
  const [search, setSearch] = useState<string>('')
  const [jour, setJour] = useState<string>('')
  const [mois, setMois] = useState<string>('')
  const [annee, setAnnee] = useState<string>('')

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  function getCookie(name: string): string {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  const token = getCookie('access')

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await fetch(`${baseUrl}/api/formulaires-reponses-liste/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const resData: FormulaireReponse[] = await res.json()
        setData(resData)
        setFilteredData(resData)
      } catch (err) {
        console.error('Échec du chargement des données:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    let results = data

    // Recherche globale
    if (search.trim() !== '') {
      results = results.filter(
        item =>
          item.utilisateur.toLowerCase().includes(search.toLowerCase()) ||
          item.formulaire.titre.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Tri par date (jour, mois, année)
    results = results.filter((item) => {
      const date = new Date(item.date_soumission)
      const matchJour = jour ? date.getDate() === parseInt(jour) : true
      const matchMois = mois ? date.getMonth() + 1 === parseInt(mois) : true
      const matchAnnee = annee ? date.getFullYear() === parseInt(annee) : true
      return matchJour && matchMois && matchAnnee
    })

    setFilteredData(results)
    setCurrentPage(1) // reset page on filter
  }, [search, jour, mois, annee, data])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <h4 style={{ marginBottom: '3%' }}>Réponses</h4>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-2">
            <Col md={3}>
              <Form.Control
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Jour"
                value={jour}
                onChange={(e) => setJour(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Mois"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Année"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button variant="secondary" onClick={() => {
                setSearch('')
                setJour('')
                setMois('')
                setAnnee('')
              }}>
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Réponses Utilisateurs</Card.Title>
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Partager</Dropdown.Item>
                <Dropdown.Item>Rafraîchir</Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item>Autres</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2 text-muted">Chargement des réponses...</div>
            </div>
          ) : (
            <>
              <Table responsive bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Utilisateur</th>
                    <th>Questionnaire</th>
                    <th>Date de soumission</th>
                    <th>Voir les réponses</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        Aucun résultat trouvé.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{item.utilisateur}</td>
                        <td>{item.formulaire.titre}</td>
                        <td>{new Date(item.date_soumission).toLocaleString()}</td>
                        <td>
                          <Link to={`/voir_reponses/${item.id}`}>
                            <Button variant="success" size="sm">Voir</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              <Card.Footer className="border-top-0">
                <Pagination className="mb-0 justify-content-center">
                  <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i}
                      active={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                </Pagination>
              </Card.Footer>
            </>
          )}
        </Card>
      </Col>
    </>
  )
}

export default Formulaire

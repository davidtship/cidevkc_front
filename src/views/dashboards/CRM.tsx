import PageDashBreadcrumb from '@/components/Common/PageDashBreadcrumb'
import { Col, Row, Button, Card, ProgressBar, Stack, Spinner } from 'react-bootstrap'
import { LatestLeads, LeadOverview, ProjectStatisticChart } from '@/components/Dashboards/CRM'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface CountData {
  formulaire?: number
  user?: number
  terminal?: number
}

const CRM: React.FC = () => {
  const [number, setNumber] = useState<CountData>({})
  const [loading, setLoading] = useState<boolean>(true)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()

  useEffect(() => {
    function getCookie(cname: string) {
      let name = cname + '='
      let decodedCookie = decodeURIComponent(document.cookie)
      let ca = decodedCookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }

    const token = getCookie('access')
    if (token !== '') {
      async function fetchForm() {
        try {
          const res = await fetch(`${baseUrl}/api/get_count`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const resData: CountData = await res.json()
          setNumber(resData)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchForm()
    } else {
      navigate('/login')
    }
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Chargement du tableau de bord...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <>
      <PageDashBreadcrumb title="Dashboard" subName="Dashboards" />
      <Row className="g-3 g-md-4">
        <Col xl={12}>
          <Row xl={3}>
            {/* Formulaires */}
            <Col>
              <Card>
                <Card.Body>
                  <Stack direction="horizontal" gap={4} className="mb-12 align-items-start">
                    <Stack direction="horizontal" gap={4}>
                      <div className="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary" style={{ width: '3.5rem', height: '3.5rem' }}>
                        <i className="fs-4 fi fi-rr-interrogation"></i>
                      </div>
                      <div>
                        <div className="fs-24 fw-bold text-dark">{number.formulaire ?? 0}</div>
                        <div>Formulaires</div>
                      </div>
                    </Stack>
                    <Button variant="light" className="btn-icon btn-md ms-auto">
                      <i className="fi fi-br-menu-dots-vertical"></i>
                    </Button>
                  </Stack>
                  <div>
                    <Stack direction="horizontal" gap={2} className="mb-2">
                      <div>Formulaires</div>
                      <div className="fs-13 ms-auto">Publié <span className="text-muted">(67%)</span></div>
                    </Stack>
                    <ProgressBar variant="primary" now={67} style={{ height: '0.25rem' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Utilisateurs */}
            <Col>
              <Card>
                <Card.Body>
                  <Stack direction="horizontal" gap={4} className="mb-12 align-items-start">
                    <Stack direction="horizontal" gap={4}>
                      <div className="d-flex align-items-center justify-content-center rounded bg-danger-subtle text-danger" style={{ width: '3.5rem', height: '3.5rem' }}>
                        <i className="fs-4 fi fi-rr-users"></i>
                      </div>
                      <div>
                        <div className="fs-24 fw-bold text-dark">{number.user ?? 0}</div>
                        <div>Utilisateurs</div>
                      </div>
                    </Stack>
                    <Button variant="light" className="btn-icon btn-md ms-auto">
                      <i className="fi fi-br-menu-dots-vertical"></i>
                    </Button>
                  </Stack>
                  <div>
                    <Stack direction="horizontal" gap={2} className="mb-2">
                      <div>Utilisateurs</div>
                      <div className="fs-13 ms-auto">Publié <span className="text-muted">(67%)</span></div>
                    </Stack>
                    <ProgressBar variant="danger" now={67} style={{ height: '0.25rem' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Terminals */}
            <Col>
              <Card>
                <Card.Body>
                  <Stack direction="horizontal" gap={4} className="mb-12 align-items-start">
                    <Stack direction="horizontal" gap={4}>
                      <div className="d-flex align-items-center justify-content-center rounded bg-success-subtle text-success" style={{ width: '3.5rem', height: '3.5rem' }}>
                        <i className="fs-4 fi fi-rr-laptop-mobile"></i>
                      </div>
                      <div>
                        <div className="fs-24 fw-bold text-dark">{number.terminal ?? 0}</div>
                        <div>Terminals</div>
                      </div>
                    </Stack>
                    <Button variant="light" className="btn-icon btn-md ms-auto">
                      <i className="fi fi-br-menu-dots-vertical"></i>
                    </Button>
                  </Stack>
                  <div>
                    <Stack direction="horizontal" gap={2} className="mb-2">
                      <div>Terminals</div>
                      <div className="fs-13 ms-auto">En utilisation <span className="text-muted">(67%)</span></div>
                    </Stack>
                    <ProgressBar variant="success" now={67} style={{ height: '0.25rem' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={8}>
          <ProjectStatisticChart />
        </Col>
        <Col xl={4}>
          <LeadOverview />
        </Col>
        <Col xl={18}>
          <LatestLeads />
        </Col>
      </Row>
    </>
  )
}

export default CRM

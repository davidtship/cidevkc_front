import PageDashBreadcrumb from '@/components/Common/PageDashBreadcrumb'
import { Col, Row, Button, Card, ProgressBar, Stack } from 'react-bootstrap'
import { LatestLeads, LeadOverview, ProjectStatisticChart } from '@/components/Dashboards/CRM'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Define the shape of your API response
interface CountData {
  formulaire?: number
  user?: number
  terminal?: number
}

const CRM: React.FC = () => {
  const [number, setNumber] = useState<CountData>({})
  const navigate = useNavigate()
  useEffect(() => {

    async function fetchForm() {
   function getCookie(cName: string) {
        const name = cName + "=";
        const cDecoded = decodeURIComponent(document.cookie); //to be careful
        const cArr = cDecoded .split('; ');
        let res;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        })
        return res;
      }
      var access = getCookie("access");
       if(access !=""){
   const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/auth/users/me/`,{
        'method':'GET',
        'headers':{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+access
        }
      });
      const resData = await res.json();
      
      if(resData.detail=="Given token not valid for any token type")
      {
        navigate('/login')
      }
      else{
        navigate('/')
      }
    }
    else{
      navigate('/login')
    }
      try {
        const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/get_count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resData: CountData = await res.json()
        console.log(resData)
        setNumber(resData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchForm()
  }, [])

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
                      <div
                        className="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary"
                        style={{ width: '3.5rem', height: '3.5rem' }}>
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
                      <div className="fs-13 ms-auto">
                        Publié <span className="text-muted">(67%)</span>
                      </div>
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
                      <div
                        className="d-flex align-items-center justify-content-center rounded bg-danger-subtle text-danger"
                        style={{ width: '3.5rem', height: '3.5rem' }}>
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
                      <div className="fs-13 ms-auto">
                        Publié <span className="text-muted">(67%)</span>
                      </div>
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
                      <div
                        className="d-flex align-items-center justify-content-center rounded bg-success-subtle text-success"
                        style={{ width: '3.5rem', height: '3.5rem' }}>
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
                      <div className="fs-13 ms-auto">
                        En utilisation <span className="text-muted">(67%)</span>
                      </div>
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

import { Button, Col, Dropdown, DropdownDivider, Card, Table, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const style1 = {
  marginBottom: '3%',
}

const Formulaire = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()

  // Get cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return ''
  }

  const token = getCookie('access')

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:8000/api/returndataformuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const resData = await res.json()
        setData(resData)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [token])

  // Toggle published status
  async function changeStatus(pk) {
    try {
      await fetch(`http://localhost:8000/api/changestatus/${pk}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Refresh data
      const res = await fetch('http://localhost:8000/api/returndataformuser/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const resData = await res.json()
      setData(resData)
    } catch (err) {
      console.error('Failed to change status:', err)
    }
  }

  return (
    <>
      <h4 style={style1}>Information</h4>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>
              <h3>Accuser de reception</h3>
            </Card.Title>
          </Card.Header>
          <div style={{ padding: '30px', textAlign: 'justify' }}>
            <h5>
              Vos informations ont été bien enregistrées et seront intégrées à la base de données de
              la cartographie des interventions au Kasaï central. Si vous souhaitez transmettre des
              informations complémentaires ou corriger des informations, vous pouvez nous contacter
              à l’adresse suivante : ou par téléphone +234 816 629 748.<br></br> Votre contribution
              est précieuse pour améliorer la coordination et efficacité des interventions dans la
              province. Merci encore pour votre temps et votre engagement. Merci d’avoir rempli le
              formulaire.
            </h5>
          </div>
        </Card>
      </Col>
    </>
  )
}

export default Formulaire

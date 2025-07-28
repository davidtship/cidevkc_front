import { Button, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const style1: React.CSSProperties = {
  marginBottom: '3%',
}

// Utility: get cookie by name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts[1].split(';')[0]
  }
  return undefined
}

interface FormDataItem {
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

const Formulaire: React.FC = () => {
  const [data, setData] = useState<FormDataItem[]>([])
  const navigate = useNavigate()
  const token = getCookie('access')

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

    if (token) fetchData()
  }, [token])

  const changeStatus = async (pk: number) => {
    try {
      await fetch(`http://localhost:8000/api/changestatus/${pk}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

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
    <div>
      <h4 style={style1}>Information</h4>

      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>
              <h3>Accusé de réception</h3>
            </Card.Title>
          </Card.Header>
          <div style={{ padding: '30px', textAlign: 'justify' }}>
            <h5>
              Vos informations ont été bien enregistrées et seront intégrées à la base de données de
              la cartographie des interventions au Kasaï central. Si vous souhaitez transmettre des
              informations complémentaires ou corriger des informations, vous pouvez nous contacter
              à l’adresse suivante : ou par téléphone +234 816 629 748.<br />
              Votre contribution est précieuse pour améliorer la coordination et efficacité des
              interventions dans la province. Merci encore pour votre temps et votre engagement.
              Merci d’avoir rempli le formulaire.
            </h5>
          </div>
        </Card>
      </Col>
    </div>
  )
}

export default Formulaire

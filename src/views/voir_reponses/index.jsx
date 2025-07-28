import { Button, Col, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react'

const style1 = {
  marginBottom: '3%',
}

const Formulaire = () => {
  const { id } = useParams()
  const [form, setForm] = useState([])
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  // Get cookie value by name
  function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts[1].split(';')[0];
  }
  return undefined;
}
  const token = getCookie('access')

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8000/api/returndataformuser/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const resData = await res.json()
        setForm(resData[0]?.form)
        setUser(resData[0]?.user)
        //console.log(JSON.stringify(resData))
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [token, id])

  if (!form) return <p>Chargement...</p>

  return (
    <div>
      <h1>{form.title}</h1>
      <h6 style={{marginTop:"10px",marginLeft:'50px'}}>Utilisateur : {user.first_name} {user.last_name}</h6>
      <Col xl={12}>
        {form.categories?.map((category, catIndex) => (
        <div key={category.id ?? catIndex} style={{ padding: 20, marginBottom: 30 }}>
          <Card style={{ width: '60%' }}>
            <Card.Body>
              <h2 style={{ fontSize: '1.6em' }}>
                Section {catIndex + 1}: {category.title}
              </h2>

              {category.questions?.map((question, qIndex) => (
                <div key={question.id ?? qIndex} style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: '1.2em' }}>{question.label}</h4>
                  <p>{question.reponse}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      ))}
      </Col>
    </div>
  )
}

export default Formulaire

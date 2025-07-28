import { Form, Button, Col, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Formulaire = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState([])
  const [token, settoken] = useState('')

  const [shortAnswers, setShortAnswers] = useState({})
  const [checkboxAnswers, setCheckboxAnswers] = useState({})
  const [radioAnswers, setRadioAnswers] = useState({})

  useEffect(() => {
    function getCookie(cname) {
      let name = cname + '='
      let decodedCookie = decodeURIComponent(document.cookie)
      let ca = decodedCookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }

    settoken(getCookie('access'))

    let cookies = document.cookie

    async function fetchForm() {
      const res = await fetch(`http://localhost:8000/api/getFormbyid/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      setTitle(resData.title)
      console.log(title)
      setCategories(resData.categories)
    }
    fetchForm()
  }, [id])

  const handleShortAnswerChange = (questionId, value) => {
    setShortAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (questionId, value, checked) => {
    setCheckboxAnswers((prev) => {
      const current = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...current, value] }
      } else {
        return {
          ...prev,
          [questionId]: current.filter((v) => v !== value),
        }
      }
    })
  }

  const handleRadioChange = (questionId, value) => {
    setRadioAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      shortAnswers,
      checkboxAnswers,
      radioAnswers,
    }

    var data = {
      form: id,
    }

    const res1 = await fetch('http://localhost:8000/api/save_form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const resData1 = await res1.json()

    const res2 = await fetch('http://localhost:8000/api/save_response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const resData2 = await res2.json()
    console.log(resData2)
    navigate('/accuser_reception')
  }

  return (
    <div style={{}}>
      <Form onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <Col xl={18}>
          {categories.map(({ questions, title }, sectionIndex) => (
            <Card style={{ width: '70%', marginBottom: '20px' }}>
              <Card.Body>
                <div key={sectionIndex}>
                  <h2>
                    Section {sectionIndex + 1}: {title}
                  </h2>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {questions.map(({ id, question_type, label, choices }) => (
                      <li key={id}>
                        <h4 style={{ fontSize: '1.5em' }}>{label}</h4>

                        {question_type === 'short_answer' && (
                          <Form.Control
                            style={{
                              fontSize: '1.3em',
                              width: '200px',
                              border: '0.1px black solid',
                              marginBottom: '10px',
                            }}
                            type="text"
                            onChange={(e) => handleShortAnswerChange(id, e.target.value)}
                          />
                        )}

                        {question_type === 'checkboxes' &&
                          choices.map(({ option }, i) => (
                            <Form.Check
                              style={{ fontSize: '1.3em' }}
                              key={i}
                              type="checkbox"
                              label={option}
                              value={option}
                              onChange={(e) => handleCheckboxChange(id, option, e.target.checked)}
                            />
                          ))}

                        {question_type === 'multiple_choice' &&
                          choices.map(({ option }, i) => (
                            <Form.Check
                              style={{ fontSize: '1.3em' }}
                              key={i}
                              type="radio"
                              name={`radio-${id}`} // important for grouping
                              label={option}
                              value={option}
                              checked={radioAnswers[id] === option}
                              onChange={(e) => handleRadioChange(id, e.target.value)}
                            />
                          ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          ))}

          <Button
            type="submit"
            style={{ width: '10%', marginLeft: '2%', marginTop: '2.5%' }}
            variant="primary">
            Envoyer
          </Button>
        </Col>
      </Form>
    </div>
  )
}

export default Formulaire

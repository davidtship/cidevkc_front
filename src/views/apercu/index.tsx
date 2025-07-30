import { Form, Button, Col, Card, Spinner, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'

// Types
interface Choice {
  option: string
}

type QuestionType = 'short_answer' | 'checkboxes' | 'multiple_choice'

interface Question {
  id: number
  label: string
  question_type: QuestionType
  choices: Choice[]
}

interface Category {
  title: string
  questions: Question[]
}

interface FormData {
  title: string
  categories: Category[]
}

// Component
const Formulaire: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [token, setToken] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)

  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({})
  const [checkboxAnswers, setCheckboxAnswers] = useState<Record<number, string[]>>({})
  const [radioAnswers, setRadioAnswers] = useState<Record<number, string>>({})

  // Get access token from cookie
  useEffect(() => {
    function getCookie(cname: string): string {
      const name = cname + '='
      const decodedCookie = decodeURIComponent(document.cookie)
      const ca = decodedCookie.split(';')
      for (let c of ca) {
        c = c.trim()
        if (c.startsWith(name)) {
          return c.substring(name.length)
        }
      }
      return ''
    }

    setToken(getCookie('access'))

    async function fetchForm() {
      try {
        const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/getFormbyid/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resData: FormData = await res.json()
        setTitle(resData.title)
        setCategories(resData.categories)
      } catch (err) {
        console.error('Erreur lors de la récupération du formulaire', err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [id])

  const handleShortAnswerChange = (questionId: number, value: string) => {
    setShortAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (questionId: number, value: string, checked: boolean) => {
    setCheckboxAnswers((prev) => {
      const current = prev[questionId] || []
      return {
        ...prev,
        [questionId]: checked
          ? [...current, value]
          : current.filter((v) => v !== value),
      }
    })
  }

  const handleRadioChange = (questionId: number, value: string) => {
    setRadioAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      shortAnswers,
      checkboxAnswers,
      radioAnswers,
    }

    const data = { form: id }

    await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/save_form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/save_response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    navigate('/accuser_reception')
  }

  return (
    <Container className="my-5">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">{title}</h2>
          <Row className="justify-content-center">
            <Col lg={10}>
              {categories.map((category, sectionIndex) => (
                <Card key={sectionIndex} className="mb-4 shadow-sm">
                  <Card.Body>
                    <h4 className="mb-3">
                      Section {sectionIndex + 1}: {category.title}
                    </h4>
                    {category.questions.map((question) => (
                      <div key={question.id} className="mb-4">
                        <h5>{question.label}</h5>

                        {question.question_type === 'short_answer' && (
                          <Form.Control
                            type="text"
                            className="mt-2"
                            placeholder="Votre réponse"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleShortAnswerChange(question.id, e.target.value)
                            }
                          />
                        )}

                        {question.question_type === 'checkboxes' &&
                          question.choices.map((choice, i) => (
                            <Form.Check
                              className="mt-2"
                              key={i}
                              type="checkbox"
                              label={choice.option}
                              value={choice.option}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleCheckboxChange(question.id, choice.option, e.target.checked)
                              }
                            />
                          ))}

                        {question.question_type === 'multiple_choice' &&
                          question.choices.map((choice, i) => (
                            <Form.Check
                              className="mt-2"
                              key={i}
                              type="radio"
                              name={`radio-${question.id}`}
                              label={choice.option}
                              value={choice.option}
                              checked={radioAnswers[question.id] === choice.option}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleRadioChange(question.id, e.target.value)
                              }
                            />
                          ))}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              ))}

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary" className="px-5 py-2">
                  Envoyer
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  )
}

export default Formulaire

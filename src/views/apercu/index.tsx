import { Form, Button, Col, Card } from 'react-bootstrap'
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
      const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/getFormbyid/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData: FormData = await res.json()
      setTitle(resData.title)
      setCategories(resData.categories)
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

    const data = {
      form: id,
    }

    // Save form instance
    const res1 = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/save_form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const resData1 = await res1.json()

    // Save user responses
    const res2 = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/save_response', {
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
    <div>
      <Form onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <Col xl={18 as any}>
          {categories.map((category, sectionIndex) => (
            <Card key={sectionIndex} style={{ width: '70%', marginBottom: '20px' }}>
              <Card.Body>
                <h2>
                  Section {sectionIndex + 1}: {category.title}
                </h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {category.questions.map((question) => (
                    <li key={question.id}>
                      <h4 style={{ fontSize: '1.5em' }}>{question.label}</h4>

                      {question.question_type === 'short_answer' && (
                        <Form.Control
                          style={{
                            fontSize: '1.3em',
                            width: '200px',
                            border: '0.1px black solid',
                            marginBottom: '10px',
                          }}
                          type="text"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleShortAnswerChange(question.id, e.target.value)
                          }
                        />
                      )}

                      {question.question_type === 'checkboxes' &&
                        question.choices.map((choice, i) => (
                          <Form.Check
                            style={{ fontSize: '1.3em' }}
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
                            style={{ fontSize: '1.3em' }}
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
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}

          <Button
            type="submit"
            style={{ width: '10%', marginLeft: '2%', marginTop: '2.5%' }}
            variant="primary"
          >
            Envoyer
          </Button>
        </Col>
      </Form>
    </div>
  )
}

export default Formulaire

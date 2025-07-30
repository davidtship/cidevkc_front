import { useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react'

interface Choice {
  option: string
}

interface Question {
  label: string
  choices: Choice[]
}

interface Category {
  title: string
  questions: Question[]
}

const Formulaire = () => {
  const { id } = useParams()
  const [title, setTitle] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const res = await fetch(`https://cidevkc-09c92764069d.herokuapp.com/api/getFormbyid/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resData = await res.json()
        setTitle(resData.title)
        setCategories(resData.categories)
      } catch (err) {
        console.error('Erreur lors du chargement du formulaire', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyAPI()
  }, [id])

  return (
    <Container className="my-5">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2 className="text-center mb-4">{title}</h2>

          <Row className="justify-content-center">
            <Col lg={10}>
              {categories.map((category, index) => (
                <Card key={index} className="mb-4 shadow-sm">
                  <Card.Body>
                    <h4 className="mb-3">
                      Section {index + 1} : {category.title}
                    </h4>

                    {category.questions.map((question, qIndex) => (
                      <div key={qIndex} className="mb-3">
                        <h5>{question.label}</h5>
                        <ul className="ps-3">
                          {question.choices.map((choice, cIndex) => (
                            <li key={cIndex} style={{ fontSize: '1.1em' }}>
                              {cIndex + 1}. {choice.option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default Formulaire

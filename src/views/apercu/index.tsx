import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Button, Alert, Card } from 'react-bootstrap'

interface Question {
  id: number
  texte: string
  type: string
  options: { id: number; texte: string }[]
}

interface Section {
  id: number
  titre: string
  questions: Question[]
  sous_sections: Section[]
}

interface Formulaire {
  id: number
  titre: string
  sections: Section[]
}

const RepondreFormulaire = () => {
  const { id } = useParams()
  const [formulaire, setFormulaire] = useState<Formulaire | null>(null)
  const [reponses, setReponses] = useState<{ [key: number]: any }>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')
  const baseUrl = import.meta.env.VITE_API_BASE_URL
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

    setToken(getCookie('access'));
    const fetchFormulaire = async () => {
      const res = await fetch(`${baseUrl}/api/formulaires/${id}/`)
      const data = await res.json()
      setFormulaire(data)
    }

    fetchFormulaire()
  }, [id])

  const handleChange = (questionId: number, value: any) => {
    setReponses({ ...reponses, [questionId]: value })
  }

  const renderQuestion = (q: Question) => {
    const name = `question-${q.id}`
    const value = reponses[q.id] || ''

    switch (q.type) {
      case 'short_text':
        return (
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        )
      case 'paragraph':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            value={value}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        )
      case 'multiple_choice':
        return (
          <div>
            {q.options.map((opt) => (
              <Form.Check
                key={opt.id}
                type="radio"
                name={name}
                label={opt.texte}
                value={opt.texte}
                checked={value === opt.texte}
                onChange={() => handleChange(q.id, opt.texte)}
              />
            ))}
          </div>
        )
      case 'checkbox':
        const checkedValues: string[] = value || []
        return (
          <div>
            {q.options.map((opt) => (
              <Form.Check
                key={opt.id}
                type="checkbox"
                label={opt.texte}
                checked={checkedValues.includes(opt.texte)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...checkedValues, opt.texte]
                    : checkedValues.filter((v) => v !== opt.texte)
                  handleChange(q.id, updated)
                }}
              />
            ))}
          </div>
        )
      case 'date':
        return (
          <Form.Control
            type="date"
            value={value}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        )
      default:
        return null
    }
  }

  const renderSection = (section: Section, depth = 0) => (
    <Card key={section.id} className="mb-4 border-start border-4 border-primary" style={{ marginLeft: depth * 20 }}>
      <Card.Body>
        <h5 className="fw-bold">{section.titre}</h5>
        {section.questions.map((q) => (
          <div key={q.id} className="mb-3">
            <Form.Label className="fw-semibold">{q.texte}</Form.Label>
            {renderQuestion(q)}
          </div>
        ))}
        {section.sous_sections.map((sous) => renderSection(sous, depth + 1))}
      </Card.Body>
    </Card>
  )

  const handleSubmit = async () => {
    if (submitted) return
    setSubmitted(true)

    const payload = {
      formulaire: formulaire?.id,
      reponses: Object.entries(reponses).map(([questionId, valeur]) => ({
        question: parseInt(questionId),
        valeur,
      })),
    }
    console.log(JSON.stringify(payload))
    try {
      const res = await fetch(`${baseUrl}/api/reponses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        alert('Erreur lors de la soumission')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!formulaire) return <p>Chargement...</p>

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">{formulaire.titre}</h2>

      <Form>
        {formulaire.sections.map((section) => renderSection(section))}

        {success && (
          <Alert variant="success" className="mt-4">
            ✅ Réponses enregistrées avec succès !
          </Alert>
        )}

        {!success && (
          <div className="text-center mt-5">
            <Button variant="success" size="lg" onClick={handleSubmit} disabled={submitted}>
              Envoyer les réponses
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}

export default RepondreFormulaire

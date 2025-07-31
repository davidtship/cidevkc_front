import React, { useEffect, useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'

interface Question {
  id?: number
  text: string
  type: string
  options?: string[]
}

interface Section {
  id: string
  titre: string
  questions: Question[]
  sous_sections: Section[]
}

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

const FormBuilder: React.FC = () => {
  const [formName, setFormName] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [user, setUser] = useState<User | null>(null)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
    useEffect(() => {
    const fetchUser = async () => {
      try {
        function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts[1].split(';')[0];
    }
    return undefined;
  }
  
  const token = getCookie('access');

        const res = await fetch(`${baseUrl}/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          console.error('Échec de récupération de l’utilisateur')
        }
      } catch (error) {
        console.error('Erreur utilisateur:', error)
      }
    }
    fetchUser()
  }, [])


  const generateId = () => Math.random().toString(36).substr(2, 9)

  const updateSectionTree = (tree: Section[], targetId: string, updated: Section): Section[] => {
    return tree.map(section => {
      if (section.id === targetId) return updated
      if (section.sous_sections.length > 0) {
        return {
          ...section,
          sous_sections: updateSectionTree(section.sous_sections, targetId, updated),
        }
      }
      return section
    })
  }

  const addSection = (parent?: Section) => {
    const newSection: Section = {
      id: generateId(),
      titre: '',
      questions: [],
      sous_sections: [],
    }

    if (parent) {
      const updatedParent = {
        ...parent,
        sous_sections: [...parent.sous_sections, newSection],
      }
      setSections(updateSectionTree(sections, parent.id, updatedParent))
    } else {
      setSections([...sections, newSection])
    }
  }

  const deleteSection = (target: Section, parent?: Section) => {
    if (parent) {
      const updatedParent = {
        ...parent,
        sous_sections: parent.sous_sections.filter(s => s.id !== target.id),
      }
      setSections(updateSectionTree(sections, parent.id, updatedParent))
    } else {
      setSections(sections.filter(s => s.id !== target.id))
    }
  }

  const handleQuestionChange = (section: Section, i: number, field: Partial<Question>) => {
    const updatedQuestions = [...section.questions]
    updatedQuestions[i] = { ...updatedQuestions[i], ...field }
    const updated = { ...section, questions: updatedQuestions }
    setSections(updateSectionTree(sections, section.id, updated))
  }

  const renderSection = (section: Section, depth: number = 0, parent?: Section) => (
    <Card key={section.id} className="mb-4 shadow-sm border-start border-4 border-primary" style={{ marginLeft: depth * 20 }}>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Titre de la section"
            className="fw-bold"
            value={section.titre}
            onChange={(e) => {
              const updated = { ...section, titre: e.target.value }
              setSections(updateSectionTree(sections, section.id, updated))
            }}
          />
        </Form.Group>

        <div className="mb-3 d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => addSection(section)}>
            + Sous-section
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => {
              const updated = {
                ...section,
                questions: [...section.questions, { text: '', type: 'short_text', options: [] }],
              }
              setSections(updateSectionTree(sections, section.id, updated))
            }}
          >
            + Question
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => deleteSection(section, parent)}>
            Supprimer section
          </Button>
        </div>

        {section.questions.map((q, i) => (
          <div key={i} className="mb-3 border p-3 rounded bg-light">
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="Texte de la question"
                value={q.text}
                onChange={(e) => handleQuestionChange(section, i, { text: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex gap-2 mb-2">
              <Form.Select
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(section, i, { type: e.target.value, options: [] })
                }
              >
                <option value="short_text">Réponse courte</option>
                <option value="paragraph">Paragraphe</option>
                <option value="multiple_choice">Choix multiple</option>
                <option value="checkbox">Case à cocher</option>
                <option value="date">Date</option>
              </Form.Select>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  const updated = {
                    ...section,
                    questions: section.questions.filter((_, idx) => idx !== i),
                  }
                  setSections(updateSectionTree(sections, section.id, updated))
                }}
              >
                Supprimer question
              </Button>
            </div>

            {['multiple_choice', 'checkbox'].includes(q.type) && (
              <div className="ms-2">
                {(q.options || []).map((opt, optIdx) => (
                  <div key={optIdx} className="d-flex gap-2 mb-1">
                    <Form.Control
                      type="text"
                      placeholder={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updatedOptions = [...(q.options || [])]
                        updatedOptions[optIdx] = e.target.value
                        handleQuestionChange(section, i, { options: updatedOptions })
                      }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        const updatedOptions = (q.options || []).filter((_, o) => o !== optIdx)
                        handleQuestionChange(section, i, { options: updatedOptions })
                      }}
                    >
                      Suppr
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(q.options || []), '']
                    handleQuestionChange(section, i, { options: newOptions })
                  }}
                >
                  + Ajouter une option
                </Button>
              </div>
            )}
          </div>
        ))}

        {section.sous_sections.map((sub) => renderSection(sub, depth + 1, section))}
      </Card.Body>
    </Card>
  )

const formatSection = (section: Section): any => ({
  titre: section.titre,
  questions: section.questions.map((q) => ({
    texte: q.text,
    type: q.type,
    options: (q.options || []).map((opt) => ({ texte: opt })),
  })),
  sous_sections: section.sous_sections.map(formatSection),
})


  const handleSubmit = async () => {
  if (!user) {
    alert("Utilisateur non connecté")
    return
  }

  const finalData = {
    titre: formName,
    user: user.id,
    sections: sections.map(formatSection),
  }

  console.log("Payload envoyé :", JSON.stringify(finalData))

  try {
    const response = await fetch(`${baseUrl}/api/formulaires/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Erreur backend:', err)
      alert('Erreur à l’envoi du formulaire')
    } else {
      const data = await response.json()
      console.log('Formulaire créé :', data)
      alert('Formulaire envoyé avec succès')
    }
  } catch (error) {
    console.error('Erreur réseau ou serveur:', error)
    alert('Erreur lors de l’envoi du formulaire')
  }
}


  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Questionnaire</h2>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Titre"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="form-control-lg fw-bold"
        />
      </Form.Group>

      <div className="mb-4">
        <Button variant="primary" onClick={() => addSection()}>
          + Ajouter une section principale
        </Button>
      </div>

      <div>{sections.map((section) => renderSection(section))}</div>

      <div className="text-center mt-5">
        <Button variant="success" size="lg" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </div>
    </div>
  )
}

export default FormBuilder

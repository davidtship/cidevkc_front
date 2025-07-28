import React, { useState } from 'react'
import { Form, Col, Card, ProgressBar, Row, Stack } from 'react-bootstrap'
import { Button } from '@mui/material'
const QUESTION_TYPES = {
  SHORT_ANSWER: 'short_answer',
  MULTIPLE_CHOICE: 'multiple_choice',
  CHECKBOXES: 'checkboxes',
}

const DynamicForm = () => {
  const [questionnaire, setquestionnaire] = useState('')
  const [sections, setSections] = useState([
    {
      id: Date.now(),
      title: 'Section 1',
      questions: [
        {
          id: Date.now() + 1,
          label: '',
          type: QUESTION_TYPES.SHORT_ANSWER,
          options: [''],
        },
      ],
    },
  ])

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: `Section ${sections.length + 1}`,
        questions: [],
      },
    ])
  }

  const removeSection = (sectionIndex) => {
    const newSections = [...sections]
    newSections.splice(sectionIndex, 1)
    setSections(newSections)
  }

  const handleSectionTitleChange = (index, value) => {
    const newSections = [...sections]
    newSections[index].title = value
    setSections(newSections)
  }

  const addQuestion = (sectionIndex) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.push({
      id: Date.now(),
      label: '',
      type: QUESTION_TYPES.SHORT_ANSWER,
      options: [''],
    })
    setSections(newSections)
  }

  const removeQuestion = (sectionIndex, questionIndex) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.splice(questionIndex, 1)
    setSections(newSections)
  }

  const handleQuestionChange = (sectionIndex, questionIndex, field, value) => {
    const newSections = [...sections]
    const question = newSections[sectionIndex].questions[questionIndex]
    question[field] = value

    // Reset options if question type changes
    if (field === 'type') {
      if (value === QUESTION_TYPES.MULTIPLE_CHOICE || value === QUESTION_TYPES.CHECKBOXES) {
        question.options = ['']
      } else {
        delete question.options
      }
    }

    setSections(newSections)
  }

  const handleOptionChange = (sectionIndex, questionIndex, optionIndex, value) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions[questionIndex].options[optionIndex] = value
    setSections(newSections)
  }

  const addOption = (sectionIndex, questionIndex) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions[questionIndex].options.push('')
    setSections(newSections)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    var questionnaire = fd.get('quest')
    var data = {
      form: questionnaire,
      sections: sections,
    }

    const res = await fetch('http://localhost:8000/api/custcreatecategorie', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json ',
      },
    })
    const resData = await res.json()
    console.log(JSON.stringify(data))
    location.reload()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Questionnaire</h1>
      <Form.Control
        type="text"
        name="quest"
        placeholder="Titre du questionnaire"
        style={{
          border: '0.5px solid black',
          marginTop: '2%',
          marginLeft: '2%',
          fontSize: 18,
          fontWeight: 'bold',
          width: '50%',
        }}
      />
      {sections.map((section, sectionIndex) => (
        <div key={section.id} style={{ padding: 20, marginBottom: 30 }}>
          <Card style={{ width: '80%' }}>
            <Card.Body>
              <Form.Control
                type="text"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                placeholder="Titre de la section"
                style={{
                  border: '0.5px solid black',
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '50%',
                  marginBottom: 15,
                }}
              />
              {section.questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  style={{ border: '1px solid #eee', padding: 10, marginBottom: 20 }}>
                  <Form.Control
                    type="text"
                    placeholder="Texte de la question"
                    value={question.label}
                    onChange={(e) =>
                      handleQuestionChange(sectionIndex, questionIndex, 'label', e.target.value)
                    }
                    style={{ border: '0.5px solid black', width: '50%', marginBottom: 10 }}
                  />

                  <Form.Select
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(sectionIndex, questionIndex, 'type', e.target.value)
                    }
                    style={{ marginBottom: 10, border: '0.5px solid black', width: '50%' }}>
                    <option value={QUESTION_TYPES.SHORT_ANSWER}>Réponse courte</option>
                    <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>Choix multiple</option>
                    <option value={QUESTION_TYPES.CHECKBOXES}>Cases à cocher</option>
                  </Form.Select>

                  {question.type === QUESTION_TYPES.MULTIPLE_CHOICE ||
                  question.type === QUESTION_TYPES.CHECKBOXES ? (
                    <div>
                      <strong>Options :</strong>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{ marginBottom: 5 }}>
                          <Form.Control
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                sectionIndex,
                                questionIndex,
                                optionIndex,
                                e.target.value,
                              )
                            }
                            style={{ marginTop: '1%', width: '50%', border: '0.5px solid black' }}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => addOption(sectionIndex, questionIndex)}
                        style={{ marginTop: 5 }}>
                        ➕ Ajouter une option
                      </Button>
                    </div>
                  ) : null}

                  <div style={{ marginTop: 10 }}>
                    <Button
                      type="button"
                      onClick={() => removeQuestion(sectionIndex, questionIndex)}
                      style={{ color: 'red' }}>
                      ❌ Supprimer la question
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => addQuestion(sectionIndex)}>
                ➕ Ajouter une question
              </Button>
              <br />
              <Button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                style={{ marginTop: 15, color: 'red' }}>
                🗑️ Supprimer la section
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}

      <Button type="button" onClick={addSection} style={{ fontSize: 18 }}>
        ➕ Ajouter une section
      </Button>

      <br />
      <br />
      <Button type="submit" style={{ fontSize: 18 }}>
        ✅ Soumettre le formulaire
      </Button>
    </form>
  )
}

export default DynamicForm

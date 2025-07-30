import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { v4 as uuidv4 } from 'uuid'
import { Button, Card, Spinner, Alert, Row, Col, Form } from 'react-bootstrap'

const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
  return ''
}

const DeviceIdentifier = () => {
  const [visitorId, setVisitorId] = useState('')
  const [deviceUUID, setDeviceUUID] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')
  const [alreadyAuthorized, setAlreadyAuthorized] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const init = async () => {
      const token = getCookie('access')
      if (!token) {
        setStatus('error')
        setMessage('Utilisateur non authentifié.')
        setLoading(false)
        return
      }

      try {
        // Étape 1 : Récupérer le rôle de l'utilisateur
        const userRes = await fetch('https://cidevkc-09c92764069d.herokuapp.com/auth/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = await userRes.json()
        if (userRes.ok) {
          if (userData.type_user === 'super_admin') {
            setIsSuperAdmin(true)
          }
        }

        // Étape 2 : Générer fingerprint et UUID
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        const fingerprint = result.visitorId
        setVisitorId(fingerprint)

        let localUUID = localStorage.getItem('device_uuid')
        if (!localUUID) {
          localUUID = uuidv4()
          localStorage.setItem('device_uuid', localUUID)
        }
        setDeviceUUID(localUUID)

        // Étape 3 : Vérifier si l’appareil est déjà autorisé
        const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/terminal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const devices = await res.json()
        const found = devices.some(
          (device: any) =>
            device.device_uuid === localUUID || device.fingerprint === fingerprint
        )

        if (found) {
          setAlreadyAuthorized(true)
          setMessage('Cet appareil est déjà autorisé pour accéder à ce site.')
          setStatus('success')
        }
      } catch (err) {
        console.error('Erreur lors de la vérification :', err)
        setStatus('error')
        setMessage('Erreur lors de la vérification.')
      }

      setLoading(false)
    }

    init()
  }, [])

  const handleSave = async () => {
    if (!deviceName.trim()) {
      setStatus('error')
      setMessage('Veuillez entrer un nom pour l’appareil.')
      return
    }

    const token = getCookie('access')
    if (!token) {
      setStatus('error')
      setMessage('Utilisateur non authentifié.')
      return
    }

    setSending(true)
    setStatus(null)
    setMessage('')

    try {
      const res = await fetch('https://cidevkc-09c92764069d.herokuapp.com/api/save-device/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fingerprint: visitorId,
          device_uuid: deviceUUID,
          device_name: deviceName.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.detail || 'Appareil enregistré avec succès.')
        setAlreadyAuthorized(true)
      } else {
        setStatus('error')
        setMessage(data.detail || 'Une erreur est survenue.')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Erreur réseau. Veuillez réessayer.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Row className="justify-content-center mt-5">
      <Col md={8} lg={6}>
        <Card className="shadow rounded-3 p-4">
          <h4 className="mb-4 text-center">Enregistrement de l'appareil</h4>

          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" />
              <p className="mt-2">Chargement...</p>
            </div>
          ) : (
            <>
              {alreadyAuthorized && !isSuperAdmin ? (
                <Alert variant="success" className="text-center">
                  ✅ {message}
                </Alert>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de l’appareil</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Mon téléphone perso"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="mb-3">
                    <strong>Empreinte (Fingerprint) :</strong>
                    <div className="text-muted small word-break-all">{visitorId}</div>
                  </div>

                  <div className="mb-4">
                    <strong>UUID local de l'appareil :</strong>
                    <div className="text-muted small word-break-all">{deviceUUID}</div>
                  </div>

                  {status && (
                    <Alert variant={status === 'success' ? 'success' : 'danger'}>
                      {message}
                    </Alert>
                  )}

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={sending}
                    >
                      {sending ? 'Enregistrement en cours...' : 'Enregistrer l’appareil'}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default DeviceIdentifier

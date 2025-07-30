import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const DeviceAuth = ({ children }: { children: React.ReactNode }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkDevice = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      const fingerprint = result.visitorId

      let deviceUUID = localStorage.getItem('device_uuid') || ''

      const response = await fetch('https://cidevkc-backend.herokuapp.com/api/check-device/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: fingerprint, device_uuid: deviceUUID })
      })

      const data = await response.json()

      if (data.allowed) {
        if (data.new_uuid) {
          localStorage.setItem('device_uuid', data.new_uuid)
        }
        setAuthorized(true)
      } else {
        console.warn(data.reason || 'Appareil non autorisé')
        setAuthorized(false)
      }
    }

    checkDevice()
  }, [])

  if (authorized === null) return <p>Chargement...</p>
  if (!authorized) return <p>Appareil non autorisé à accéder au site.</p>

  return <>{children}</>
}

export default DeviceAuth

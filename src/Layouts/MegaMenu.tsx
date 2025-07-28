
import { useState } from 'react'

const MegaMenu = () => {
  const [homeOpen, setHomeOpen] = useState(false)
  const [appsOpen, setAppsOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  function megaMenuClose() {
    document.body.classList.remove('megamenu-open')
    const backdrop = document.getElementById('megaMenuBackdrop')
    if (backdrop) {
      document.body.removeChild(backdrop)
    }
  }

  return (
    <>
    
    </>
  )
}

export default MegaMenu

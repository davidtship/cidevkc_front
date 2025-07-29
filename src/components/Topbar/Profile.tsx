import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Dropdown } from 'react-bootstrap'
import { profileDataGroup1, profileDataGroup2 } from './data/profileData'
import NotificationOffcanvas from './Notifications/NotificationOffcanvas'
import profilePic from '@/assets/images/avatars/1.png'
import Avatar from './../UiElements/Base/Avatars/Avatar'
import Status from '../Misc/Status'
import userAvatar from "../../assets/images/avatars/user-avatar.png"

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
  const [path, setpath] = useState('')
  const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    function getCookie(cname: string) {
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
    const token = getCookie('access')

    setpath(getCookie('profilpicpath'))
    setfirstname(getCookie('firstname'))
    setlastname(getCookie('lastname'))
    let cookies = document.cookie
  }, [])
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true)
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)
  const [showOffcanvas, setShowOffcanvas] = useState<boolean>(false)
  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen)
  }
  const [status, setStatus] = useState('Online')
  const statusOptions = [
    { label: 'Busy', color: 'warning' },
    { label: 'Online', color: 'success' },
    { label: 'Offline', color: 'secondary' },
    { label: 'Inactive', color: 'danger' },
    { label: 'Invisible', color: 'black' },
    { label: 'Always', color: 'info' },
  ]
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }
  const toggleSound = () => {
    setIsSoundOn(!isSoundOn)
    const message = isSoundOn ? 'Sound turned off' : 'Sound turned on'

    toast(message, {
      icon: isSoundOn ? '🔕' : '🔔',
    })
  }
  const openOffcanvas = () => {
    setShowOffcanvas(true)
    setDropDownOpen(false)
  }

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false)
  }

  return (
    <>
      <Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
        <Dropdown.Toggle
          className="arrow-none header-btn px-2"
          as="a"
          role="button"
          onClick={toggleDropDown}>
          <Avatar type="image" src={userAvatar} size="md">
            <div
              className={`avatar-status bg-${
                statusOptions.find((opt) => opt.label === status)?.color
              }`}></div>
          </Avatar>
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className="dropdown-md px-0 py-0">
          <div className="px-4 py-3 d-flex border-bottom">
            <Avatar type="image" src={userAvatar} size="md" shape="2" className="flex-shrink-0" />
            <div className="flex-grow-1 ms-3">
              <h6 className="text-dark mb-0">
                {firstname}
                <span style={{ marginLeft: '5%' }}></span>
                {lastname}
              </h6>
              <Status status={status} changeStatus={handleStatusChange} />
            </div>
          </div>
          <div className="px-2 pt-2">
            {profileDataGroup1.map(({ redirectTo, icon, label }, idx) => (
              <Link to={redirectTo} className="dropdown-item" key={idx}>
                <i className={icon}></i>
                <span className="ms-3">{label}</span>
              </Link>
            ))}
          </div>

          <div className="px-2 pb-2">
            {profileDataGroup2.map(({ redirectTo, icon, label }, idx) => (
              <Link to={redirectTo} className="dropdown-item text-danger" key={idx}>
                <i className={icon}></i>
                <span className="ms-3">{label}</span>
              </Link>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      {showOffcanvas && (
        <NotificationOffcanvas
          show={showOffcanvas}
          handleClose={handleCloseOffcanvas}
          toggleSound={toggleSound}
          isSoundOn={isSoundOn}
        />
      )}
    </>
  )
}

export default Profile

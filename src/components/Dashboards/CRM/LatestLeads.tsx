import { Link } from 'react-router-dom'
import { Card, Dropdown, DropdownDivider, Table, Button, Pagination } from 'react-bootstrap'

// Avatar Images
import avatar1 from '@/assets/images/avatars/1.png'
import avatar2 from '@/assets/images/avatars/2.png'
import avatar3 from '@/assets/images/avatars/3.png'

const LatestLeads = () => {
  const leads = [
    {
      avatar: avatar1,
      name: 'Archie Cantones',
      email: 'arcie.tones@gmail.com',
      proposal: 'Non Publié',
      date: '11/06/2023 10:53',
      status: 'Publié',
      color: 'success',
      titre:"recolte"
    },
    {
      avatar: avatar2,
      name: 'Holmes Cherryman',
      email: 'golms.chan@gmail.com',
      proposal: 'Publié',
      date: '11/06/2023 10:53',
      status: 'Non Publié',
      color: 'warning',
      titre:"recouvrement"
    },
    {
      avatar: avatar3,
      name: 'Malanie Hanvey',
      email: 'lanie.nveyn@gmail.com',
      proposal: 'Non Publié',
      date: '11/06/2023 10:53',
      status: 'Publié',
      color: 'success',
      titre:"suivis"
    },
    
  ]

  return (
    <Card>
      <Card.Header className="py-3 pe-3 d-flex justify-content-between align-items-center">
        <Card.Title>Questionnaire</Card.Title>
        <Dropdown className="ms-auto" drop="down">
          <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
            <i className="fi fi-bs-menu-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" style={{ marginTop: '0.875rem' }}>
            <Dropdown.Item>
              <i className="fi fi-rr-share"></i>
              <span className="ms-3">Share</span>
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fi fi-rr-refresh"></i>
              <span className="ms-3">Refresh</span>
            </Dropdown.Item>
            <DropdownDivider />
            <Dropdown.Item>
              <i className="fi fi-rr-stats"></i>
              <span className="ms-3">All Channels</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      <Table responsive className="mb-0">
        <thead>
          <tr className="border-b">
            <th scope="row">Utilisateurs</th>
            <th>Titre</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(({ avatar, name, email, proposal,titre, date, status, color }, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <Link to="#!">
                    <p className="mb-1">{name}</p>
                   
                  </Link>
                </div>
              </td>
             
              <td>{titre}</td>
              <td>{date}</td>
              <td>
                <span className={`badge bg-${color}-subtle text-${color}`}>{status}</span>
              </td>
              <td className="text-end">
                 <Button variant="primary">
              <span className="ms-2">Voir</span>
            </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Card.Footer className="border-top-0">
        <Pagination className="mb-0">
          <Pagination.Prev />
          {[...Array(4)].map((_, index) => (
            <Pagination.Item key={index}>{index + 1}</Pagination.Item>
          ))}
          <Pagination.Next />
        </Pagination>
      </Card.Footer>
    </Card>
  )
}

export default LatestLeads

import { Button, Col, Dropdown, DropdownDivider, Card, Table, Pagination } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const style1 = {
    marginBottom: '3%',
};
const Formulaire = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    // Get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2)
            return parts.pop().split(';').shift();
        return '';
    }
    const token = getCookie('access');
    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('http://localhost:8000/api/listeusers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const resData = await res.json();
                setData(resData);
                console.log(JSON.stringify(resData));
            }
            catch (err) {
                console.error('Failed to fetch data:', err);
            }
        }
        fetchData();
    }, [token]);
    return (<>
      <h4 style={style1}>Utilisateurs</h4>
      <Button style={{ width: '10%', marginBottom: '2.5%' }} onClick={() => navigate('/ajout_user')} variant="primary">
        Ajouter
      </Button>
      <Col xl={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Liste des utilisateurs</Card.Title>

            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="light" className="p-0 btn-icon btn-md arrow-none">
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Share</Dropdown.Item>
                <Dropdown.Item>Refresh</Dropdown.Item>
                <DropdownDivider />
                <Dropdown.Item>All Channels</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>

          <Table responsive bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Postnom</th>
                <th>Adresse email</th>
                <th>Type d'utilisateur</th>
                <th>Action</th>
                <th>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (<tr>
                 <td colSpan={6} className="text-center text-muted">
                    Aucun formulaire trouvé.
                  </td>
                </tr>) : (data.map(({ id, first_name, last_name, type_user, email, date_joined }, index) => (<tr key={index}>
                    <td>{index + 1}</td>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                    <td>{email}</td>
                    <td>{type_user}</td>

                    <td>
                      <Link to={`/voir_reponses/1`}>
                        <Button className="me-2" variant="success">
                          Voir
                        </Button>
                      </Link>
                      <Link to={`/voir_reponses/1`}>
                        <Button className="me-2" variant="primary">
                          Activer
                        </Button>
                      </Link>
                    </td>

                    <td>{date_joined}</td>
                  </tr>)))}
            </tbody>
          </Table>

          <Card.Footer className="border-top-0">
            <Pagination className="mb-0">
              <Pagination.Prev />
              {[...Array(4)].map((_, index) => (<Pagination.Item key={index}>{index + 1}</Pagination.Item>))}
              <Pagination.Next />
            </Pagination>
          </Card.Footer>
        </Card>
      </Col>
    </>);
};
export default Formulaire;

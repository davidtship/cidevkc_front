import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListGroup, Stack } from 'react-bootstrap';
import Loading from '@/components/Misc/Loading';
import Avatar from '@/components/UiElements/Base/Avatars/Avatar';
const ContactList = ({ filteredContacts, selectedContact, handleContactItemClick, setLoading, setFilteredContacts, handleStarChange, setContainerToggle, setSidebarMiniToggle, }) => {
    const handleClick = (contact) => {
        setSidebarMiniToggle(false);
        setContainerToggle(true);
        setLoading(true);
        setTimeout(() => {
            handleContactItemClick(contact);
            setLoading(false);
            setFilteredContacts((prevFilteredContacts) => prevFilteredContacts.map((item) => item.id === contact.id ? { ...item, unread: false } : item));
        }, 1000);
    };
    return (<>
      <PerfectScrollbar className="h-100 d-flex flex-column">
        {filteredContacts.length === 0 ? (<ListGroup.Item className="py-4 text-center flex-grow-1">No items found</ListGroup.Item>) : (<ListGroup variant="flush" className="flex-grow-1">
            {filteredContacts.map((contact, idx) => (<ListGroup.Item className={`py-4 ${selectedContact && selectedContact.id === contact.id ? 'bg-secondary-subtle' : ''}`} key={idx} onClick={() => handleClick(contact)} style={{ cursor: 'pointer' }}>
                <Stack direction="horizontal" gap={3} className="w-100 align-items-start">
                  <div className="flex-grow-1">
                    <Avatar type="image" size="md" src={contact.image} alt="User Avatar"/>
                  </div>
                  <div className="w-100">
                    <h6>{contact.name}</h6>
                    <span className="fs-13 fw-light d-block">{contact.phone}</span>
                  </div>
                </Stack>
              </ListGroup.Item>))}
          </ListGroup>)}
        <div className="m-4">
          <Loading className="w-100"/>
        </div>
      </PerfectScrollbar>
    </>);
};
export default ContactList;

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { Preloader } from '@/components/Misc/Preloader';
import { Button, Card, Stack } from 'react-bootstrap';
import { ContactDetails, ContactDetailsHeader, ContactHeader, ContactList, ContactSearchBar, ContactSidebar, } from '@/components/Apps/Contact';
import AddContactModal from '@/components/Apps/Contact/AddContactModal';
import contactItems from '@/components/Apps/Contact/data/contactItems';
import TitleHelmet from '@/components/Common/TitleHelmet';
const Contact = () => {
    const [selectedCategory, setSelectedCategory] = useState('alls');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState(contactItems);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedContactIndex, setSelectedContactIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [containerToggle, setContainerToggle] = useState(false);
    const [sidebarLeftToggle, setSidebarLeftToggle] = useState(false);
    const [sidebarMiniToggle, setSidebarMiniToggle] = useState(false);
    const handleAddContact = (contactData) => {
        console.log('Add New Contact:', contactData);
    };
    const categories = [
        {
            name: 'Alls',
            value: 'alls',
            icon: 'fi-rr-user',
            badge: 255,
            badgeClassName: 'bg-primary-subtle text-primary',
        },
        { name: 'Starred', value: 'starred', icon: 'fi-rr-star' },
        {
            name: 'Archive',
            value: 'archive',
            icon: 'fi-rr-box',
            badge: 4,
            badgeClassName: 'bg-success-subtle text-success',
        },
        { name: 'Others', value: 'others', icon: 'fi-rr-folder-upload' },
    ];
    const labels = [
        { name: 'Important', value: 'important', gradient: 'success' },
        { name: 'Personal', value: 'personal', gradient: 'warning' },
        { name: 'Private', value: 'private', gradient: 'danger' },
    ];
    useEffect(() => {
        setFilteredContacts(contactItems.filter((item) => item.alls));
    }, []);
    const handleSearch = (value) => {
        setSearchTerm(value);
        const filteredContactsByCategory = contactItems.filter((item) => item[selectedCategory]);
        const filteredContactsBySearch = filteredContactsByCategory.filter((item) => item.message.toLowerCase().includes(value.toLowerCase()));
        setFilteredContacts(filteredContactsBySearch);
    };
    const handleCategoryChange = (categoryValue) => {
        setSelectedCategory(categoryValue);
        setSearchTerm('');
        if (labels.find((label) => label.value === categoryValue)) {
            setFilteredContacts(contactItems.filter((item) => {
                if (typeof item.label === 'object') {
                    return item.label.value === categoryValue;
                }
                else {
                    return item.label && item.label.includes(categoryValue);
                }
            }));
        }
        else {
            setFilteredContacts(contactItems.filter((item) => item[categoryValue]));
        }
    };
    const handleContactItemClick = (contact) => {
        setSelectedContact(contact);
    };
    const handleStarChange = (contactId, isStarred) => {
        const updatedContacts = filteredContacts.map((item) => item.id === contactId ? { ...item, starred: isStarred } : item);
        setFilteredContacts(updatedContacts);
    };
    const handleDeleteContact = () => {
        if (selectedContact) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this contact!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3E97FF',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    setTimeout(() => {
                        const updatedContacts = contactItems.filter((item) => item.id !== selectedContact.id);
                        contactItems.splice(0, contactItems.length, ...updatedContacts);
                        const filteredContactsByCategory = updatedContacts.filter((item) => item[selectedCategory]);
                        setFilteredContacts(filteredContactsByCategory);
                        if (filteredContactsByCategory.length === 0) {
                            setFilteredContacts([]);
                        }
                        setSelectedContact(null);
                        setContainerToggle(false);
                        setSidebarLeftToggle(false);
                        setLoading(false);
                        toast.success('Contact deleted successfully');
                    }, 1500);
                }
            });
        }
    };
    useEffect(() => {
        const index = filteredContacts.findIndex((contact) => contact.id === (selectedContact?.id || ''));
        setSelectedContactIndex(index);
    }, [filteredContacts, selectedContact]);
    const handleNext = () => {
        if (selectedContactIndex < filteredContacts.length - 1) {
            const nextIndex = selectedContactIndex + 1;
            setSelectedContact(filteredContacts[nextIndex]);
        }
    };
    const handlePrev = () => {
        if (selectedContactIndex > 0) {
            const prevIndex = selectedContactIndex - 1;
            setSelectedContact(filteredContacts[prevIndex]);
        }
    };
    useEffect(() => {
        if (sidebarMiniToggle) {
            document.querySelector('.apps-card')?.classList.add('apps-sidebar-mini-toggle');
        }
        else {
            document.querySelector('.apps-card')?.classList.remove('apps-sidebar-mini-toggle');
        }
    }, [sidebarMiniToggle]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 991.98 && sidebarLeftToggle) {
                document.querySelector('.apps-card')?.classList.remove('apps-sidebar-left-toggle');
            }
        };
        if (sidebarLeftToggle) {
            document.querySelector('.apps-card')?.classList.add('apps-sidebar-left-toggle');
        }
        else {
            document.querySelector('.apps-card')?.classList.remove('apps-sidebar-left-toggle');
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [sidebarLeftToggle]);
    useEffect(() => {
        if (containerToggle) {
            document.querySelector('.apps-card')?.classList.add('apps-container-toggle');
        }
        else {
            document.querySelector('.apps-card')?.classList.remove('apps-container-toggle');
        }
    }, [containerToggle]);
    return (<>
      <TitleHelmet title="Contact"/>
      <Card className={`apps-card ${sidebarMiniToggle ? 'apps-sidebar-mini-toggle' : ''}`}>
        <div className="apps-sidebar-mini">
          <ContactSidebar categories={categories} labels={labels} selectedCategory={selectedCategory} handleCategoryChange={handleCategoryChange} setSidebarMiniToggle={setSidebarMiniToggle}/>
        </div>
        <div className="apps-sidebar apps-sidebar-left  apps-sidebar-md">
          <ContactHeader labels={labels} categories={categories} selectedCategory={selectedCategory} sidebarMiniToggle={sidebarMiniToggle} setSidebarMiniToggle={setSidebarMiniToggle}/>
          <ContactSearchBar searchTerm={searchTerm} handleSearch={handleSearch}/>
          <ContactList filteredContacts={filteredContacts} selectedContact={selectedContact} handleContactItemClick={handleContactItemClick} setLoading={setLoading} setFilteredContacts={setFilteredContacts} handleStarChange={handleStarChange} setContainerToggle={setContainerToggle} setSidebarMiniToggle={setSidebarMiniToggle}/>
        </div>
        <div className="apps-container">
          <div className="apps-container-inner">
            {loading ? (<Stack className="align-items-center justify-content-center flex-grow-1 h-100 ">
                <Preloader />
              </Stack>) : !selectedContact ? (<Stack className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center" style={{ maxWidth: '320px' }}>
                <i className="fi fi-rr-address-book fs-48 mb-6"></i>
                <h4 className="fw-bold">Select a contact to read</h4>
                <p className="fs-15 fw-light text-muted mb-4">
                  Select a contact to read from left sidebar contact list, and start your
                  conversation.
                </p>
                <Button variant="" className="btn-neutral" onClick={() => setShowAddContactModal(true)}>
                  <i className="fi fi-br-plus fs-10"></i>
                  <span className="ms-2">Add New Contact</span>
                </Button>
              </Stack>) : (<>
                <ContactDetailsHeader onDelete={handleDeleteContact} handlePrev={handlePrev} handleNext={handleNext} selectedContactIndex={selectedContactIndex} filteredContacts={filteredContacts} selectedContact={selectedContact} setSelectedContact={setSelectedContact} onStarChange={handleStarChange} setFilteredContacts={setFilteredContacts} setContainerToggle={setContainerToggle} sidebarLeftToggle={sidebarLeftToggle} setSidebarLeftToggle={setSidebarLeftToggle}/>
                <ContactDetails onDelete={handleDeleteContact} key={selectedContact?.id} selectedContact={selectedContact}/>
              </>)}
          </div>
        </div>
        <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)}></div>
      </Card>
      <AddContactModal show={showAddContactModal} onHide={() => setShowAddContactModal(false)} onAddContact={handleAddContact}/>
    </>);
};
export default Contact;

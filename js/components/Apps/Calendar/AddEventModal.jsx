import 'flatpickr/dist/themes/airbnb.css';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import EventUpdateModal from './EventUpdateModal';
import { colorOption } from './data/colorOption';
const AddEventModal = ({ showModal, handleCloseModal, handleAddEvent, events, setEvents, showUpdateEventModal, setShowUpdateEventModal, selectedEventForEdit, }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartDate, setEventStartDate] = useState(new Date());
    const [eventEndDate, setEventEndDate] = useState(new Date());
    const [eventDescription, setEventDescription] = useState('');
    const [eventColor, setEventColor] = useState(null);
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isDescValid, setIsDescValid] = useState(true);
    const [isColorValid, setIsColorValid] = useState(true);
    const handleSave = () => {
        if (!eventTitle) {
            setIsTitleValid(false);
            return;
        }
        else {
            setIsTitleValid(true);
        }
        if (!eventDescription) {
            setIsDescValid(false);
            return;
        }
        else {
            setIsDescValid(true);
        }
        if (!eventColor) {
            setIsColorValid(false);
            return;
        }
        else {
            setIsColorValid(true);
        }
        const selectedColorValue = eventColor ? eventColor.value : '';
        const colorClassName = `fc-event-${selectedColorValue}-subtle`;
        const newEvent = {
            id: new Date().getTime().toString(),
            title: eventTitle,
            start: eventStartDate,
            end: eventEndDate,
            description: eventDescription,
            classNames: [colorClassName],
            extendedProps: {
                description: '',
            },
        };
        handleAddEvent(newEvent);
        handleCloseModal();
        setEventTitle('');
        setEventStartDate(new Date());
        setEventEndDate(new Date());
        setEventDescription('');
        setEventColor(null);
        setIsTitleValid(true);
        setIsDescValid(true);
        setIsColorValid(true);
    };
    return (<>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4" controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter event title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} isInvalid={!isTitleValid}/>
              <Form.Control.Feedback type="invalid">Title is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="eventStartDate">
              <Form.Label>Start Date</Form.Label>
              <Flatpickr className="form-control" data-enable-time value={eventStartDate} onChange={(date) => setEventStartDate(date[0])}/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="eventEndDate">
              <Form.Label>End Date</Form.Label>
              <Flatpickr className="form-control" data-enable-time value={eventEndDate} onChange={(date) => setEventEndDate(date[0])}/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Enter event description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} isInvalid={!isDescValid}/>
              <Form.Control.Feedback type="invalid">Description is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="eventColor">
              <Form.Label>Color</Form.Label>
              <Select classNamePrefix="select" className={`select ${isColorValid ? '' : 'is-invalid'}`} options={colorOption} value={eventColor} onChange={(selectedOption) => setEventColor(selectedOption)}/>
              <Form.Control.Feedback type="invalid">Color is required</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={handleCloseModal} className="link-danger">
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
      <EventUpdateModal show={showUpdateEventModal} handleCloseModal={() => setShowUpdateEventModal(false)} selectedEvent={selectedEventForEdit} handleUpdateEvent={(updatedEvent) => {
            const updatedEvents = events.map((event) => event.id === updatedEvent.id ? updatedEvent : event);
            setEvents(updatedEvents);
            setShowUpdateEventModal(false);
        }}/>
    </>);
};
export default AddEventModal;

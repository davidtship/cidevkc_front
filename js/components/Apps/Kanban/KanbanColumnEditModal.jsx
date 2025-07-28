import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { colorOptions } from './data/colorOptions';
const KanbanColumnEditModal = ({ isOpen, onClose, handleSave, handleTitleChange, handleColorChange, editingColumn, selectedColor, columnName, onColumnNameChange, }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState(null);
    useEffect(() => {
        setNewTitle(editingColumn?.title || '');
        setNewColor(selectedColor || colorOptions[0]);
    }, [isOpen, editingColumn, selectedColor]);
    const handleCancel = () => {
        setNewTitle(editingColumn?.title || '');
        setNewColor(selectedColor);
        onClose();
    };
    const handleSaveChanges = () => {
        handleTitleChange(newTitle);
        handleColorChange(newColor);
        handleSave();
        onClose();
    };
    return (<>
      <Modal show={isOpen} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{`Edit ${columnName}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-4" controlId="editBoardTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter new title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="editBoardColor">
            <Form.Label>Color</Form.Label>
            <Select options={colorOptions} value={newColor} onChange={(selectedOption) => setNewColor(selectedOption)} classNamePrefix="select" className="text-capitalize"/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="text-danger" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
};
export default KanbanColumnEditModal;

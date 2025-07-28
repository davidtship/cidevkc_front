import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
const AccountAvatarCover = () => {
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const avatarImageRef = React.useRef(null);
    const avatarImageUploader = React.useRef(null);
    const coverImageRef = React.useRef(null);
    const coverImageUploader = React.useRef(null);
    const handleImageUpload = (e, setImageFile, imageRef, imageUploader) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const currentImage = imageRef.current;
                if (currentImage) {
                    currentImage.src = event.target?.result;
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleReset = (setImageFile, imageRef, imageUploader) => {
        setImageFile(null);
        const defaultImageSrc = 'https://via.placeholder.com/150'; // Replace with a valid image URL
        const currentImage = imageRef.current;
        if (currentImage) {
            currentImage.src = defaultImageSrc;
        }
        if (imageUploader.current) {
            imageUploader.current.value = '';
        }
    };
    return (<>
      <div className="mb-6 mb-md-16">
        <h5 className="fw-semibold">Avatar & Cover </h5>
        <p>Change avatar and cover images in your account</p>
      </div>
      <Row className="g-md-4 mb-4">
        <Col md={3}>
          <Form.Label className="fw-medium">Avatar</Form.Label>
        </Col>
        <Col md={9} xl={8} xxl={6}>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAvatarFile, avatarImageRef, avatarImageUploader)} ref={(input) => {
            avatarImageUploader.current = input;
        }} style={{
            display: 'none',
        }}/>
          <div style={{
            height: '6rem',
            width: '6rem',
            cursor: 'pointer',
        }} className="d-flex align-items-center justify-content-center fs-24 border border-3 rounded overflow-hidden bg-secondary-subtle" onClick={() => avatarImageUploader.current?.click()}>
            {avatarFile ? (<img src={URL.createObjectURL(avatarFile)} ref={avatarImageRef} className="rounded" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}/>) : (<FiPlus />)}
          </div>
          <p className="text-muted mt-2">
            Click to change avatar image{' - '}
            <Link to="#!" className="text-danger" onClick={() => handleReset(setAvatarFile, avatarImageRef, avatarImageUploader)}>
              Reset
            </Link>
          </p>
        </Col>
      </Row>
      <Row className="g-md-4 mb-4">
        <Col md={3}>
          <Form.Label className="fw-medium">Cover</Form.Label>
        </Col>
        <Col md={9} xl={8} xxl={6}>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCoverFile, coverImageRef, coverImageUploader)} ref={(input) => {
            avatarImageUploader.current = input;
        }} style={{
            display: 'none',
        }}/>
          <div style={{
            height: '12rem',
            width: '100%',
            cursor: 'pointer',
        }} className="d-flex align-items-center justify-content-center fs-24 border border-3 rounded overflow-hidden bg-secondary-subtle" onClick={() => coverImageUploader.current?.click()}>
            {coverFile ? (<img src={URL.createObjectURL(coverFile)} ref={coverImageRef} className="rounded" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}/>) : (<FiPlus />)}
          </div>
          <p className="text-muted mt-2">
            Click to change cover image{' - '}
            <Link to="#!" className="text-danger" onClick={() => handleReset(setCoverFile, coverImageRef, coverImageUploader)}>
              Reset
            </Link>
          </p>
        </Col>
      </Row>
    </>);
};
export default AccountAvatarCover;

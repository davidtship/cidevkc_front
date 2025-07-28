import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};
const thumb = {
    position: 'relative',
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #737d9126',
    marginBottom: 8,
    marginRight: 8,
    width: 128,
    height: 128,
    padding: 4,
    boxSizing: 'border-box',
};
const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};
const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
};
const removeIcon = {
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer',
    background: '#fff',
    borderRadius: '50%',
    padding: '4px',
    zIndex: 1,
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
function DropzonePreviews(props) {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.map((file) => ({
                ...file,
                preview: URL.createObjectURL(file),
            })));
        },
    });
    const handleRemoveFile = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        });
    };
    const thumbs = files.map((file, index) => (<div style={thumb} key={index}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} alt={`Preview ${index + 1}`} onLoad={() => {
            URL.revokeObjectURL(file.preview);
        }}/>
        <div style={removeIcon} onClick={() => handleRemoveFile(index)}>
          <i className="fi fi-rr-cross fs-14"></i>
        </div>
      </div>
    </div>));
    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);
    return (<section>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()}/>
        <div className="dropzone-content">
          <Button variant="neutral" className="btn-xxl btn-icon mb-4">
            <i className="fi fi-rr-upload fs-20"></i>
          </Button>
          <h5>Drop files here or click to upload.</h5>
          <p className="fs-13 text-muted mb-0">
            (This is just a demo drop zone. Selected files are not actually uploaded.)
          </p>
        </div>
      </div>
      <aside style={thumbsContainer} className="mt-4">
        {thumbs}
      </aside>
    </section>);
}
export default DropzonePreviews;

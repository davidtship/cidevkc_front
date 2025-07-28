import { useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Avatar from '@/components/UiElements/Base/Avatars/Avatar';
import avatar from '@/assets/images/avatars/1.png';
import Status from '@/components/Misc/Status';
const ChatAsideHeaderUser = ({ handleInviteClick }) => {
    const [status, setStatus] = useState('Online');
    const handleClick = () => {
        handleInviteClick();
    };
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };
    return (<>
      <Stack direction="horizontal" gap={3} className="px-4 border-bottom" style={{ minHeight: '4.5rem' }}>
        <h4 className="fw-bold mb-0">Chat</h4>
        <Button variant="light" className="btn-icon rounded-pill ms-auto" onClick={handleClick}>
          <i className="fi fi-rr-user-add"></i>
        </Button>
      </Stack>
      <Stack direction="horizontal" gap={3} className="px-4 border-bottom" style={{ minHeight: '4.5rem' }}>
        <Avatar type="image" size="md" src={avatar} alt="User Avatar"/>
        <div className="mt-3">
          <h6 className="text-dark mb-0">Alexandra Della</h6>
          <Status status={status} changeStatus={handleStatusChange}/>
        </div>
      </Stack>
    </>);
};
export default ChatAsideHeaderUser;

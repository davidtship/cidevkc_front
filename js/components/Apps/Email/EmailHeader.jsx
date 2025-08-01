import React from 'react';
import { Button, Stack } from 'react-bootstrap';
const EmailHeader = ({ selectedCategory, labels, categories, sidebarMiniToggle, setSidebarMiniToggle }) => {
    const handleSidebarMiniToggle = () => {
        document.querySelector('.apps-card')?.classList.add('apps-sidebar-mini-toggle');
        setSidebarMiniToggle(true);
        if (sidebarMiniToggle) {
            document.querySelector('.apps-card')?.classList.remove('apps-sidebar-mini-toggle');
            setSidebarMiniToggle(false);
        }
    };
    return (<Stack direction="horizontal" gap={4} className="px-3 border-bottom" style={{ minHeight: '4.5rem' }}>
      <Stack direction="horizontal" gap={2}>
        <Button variant="light" className="btn-icon btn-md" onClick={handleSidebarMiniToggle}>
          <i className="fi fi-rr-menu-burger"></i>
        </Button>
        <h5 className="fs-16 fw-bold mb-0">
          {labels.find((label) => label.value === selectedCategory)?.name ??
            categories.find((category) => category.value === selectedCategory)?.name}
        </h5>
      </Stack>
      <Button variant="light" className="btn-icon btn-md ms-auto">
        <i className="fi fi-br-menu-dots-vertical"></i>
      </Button>
    </Stack>);
};
export default EmailHeader;

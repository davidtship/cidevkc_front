import { useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
const InvoiceAsideSearch = ({ onSearch }) => {
    const [searchQueryLocal, setSearchQueryLocal] = useState('');
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQueryLocal(query);
        onSearch(query);
    };
    return (<>
      <Stack direction="horizontal" gap={3} className="px-4 border-bottom" style={{ minHeight: '4.5rem' }}>
        <Form className="w-100">
          <Form.Control type="text" className="rounded-pill" placeholder="Search...." value={searchQueryLocal} onChange={handleSearch}/>
        </Form>
      </Stack>
    </>);
};
export default InvoiceAsideSearch;

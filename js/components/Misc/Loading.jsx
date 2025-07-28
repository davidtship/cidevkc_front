import React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
const Loading = ({ style, className }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };
    return (<>
      <Button variant="soft-light" className={`btn-lg rounded-pill border ${className}`} type="submit" disabled={isLoading} style={{ width: '130px', ...style }} onClick={handleLoadMore}>
        {isLoading ? (<>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading...
          </>) : ('Load more...')}
      </Button>
    </>);
};
export default Loading;

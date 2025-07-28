import React from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
const getIcon = (sort) => {
    if (sort === 'asc') {
        return <FaSortUp />;
    }
    else {
        return <FaSortDown />;
    }
};
const Sorter = ({ sort }) => {
    if (sort === false) {
        return <FaSort style={{ width: '12px', height: '12px' }}/>;
    }
    return <span className="text-primary">{getIcon(sort)}</span>;
};
export default Sorter;

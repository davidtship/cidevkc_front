import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
const DateRangeMultiple = () => {
    const [state, setState] = useState({
        selection1: {
            startDate: addDays(new Date(), 1),
            endDate: undefined,
            key: 'selection1',
        },
        selection2: {
            startDate: addDays(new Date(), 4),
            endDate: addDays(new Date(), 8),
            key: 'selection2',
        },
        selection3: {
            startDate: addDays(new Date(), 8),
            endDate: addDays(new Date(), 10),
            key: 'selection3',
            autoFocus: false,
        },
    });
    const ranges = Object.values(state);
    return (<>
      <DateRangePicker onChange={(item) => setState({
            ...state,
            ...item,
        })} ranges={ranges}/>
    </>);
};
export default DateRangeMultiple;

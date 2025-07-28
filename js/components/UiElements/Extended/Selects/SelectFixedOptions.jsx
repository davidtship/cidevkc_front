import { useState } from 'react';
import Select from 'react-select';
import { colourOptions } from './data';
const styles = {
    multiValue: (base, state) => {
        return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
    },
    multiValueLabel: (base, state) => {
        return state.data.isFixed
            ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
            : base;
    },
    multiValueRemove: (base, state) => {
        return state.data.isFixed ? { ...base, display: 'none' } : base;
    },
};
const orderOptions = (values) => {
    return values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));
};
export default () => {
    const [value, setValue] = useState(orderOptions([colourOptions[0], colourOptions[1], colourOptions[3]]));
    const onChange = (newValue, actionMeta) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                if (actionMeta.removedValue.isFixed) {
                    return;
                }
                break;
            case 'clear':
                newValue = colourOptions.filter((v) => v.isFixed);
                break;
        }
        setValue(orderOptions(newValue));
    };
    return (<Select value={value} isMulti styles={styles} isClearable={value.some((v) => !v.isFixed)} name="colors" onChange={onChange} options={colourOptions} classNamePrefix="select"/>);
};

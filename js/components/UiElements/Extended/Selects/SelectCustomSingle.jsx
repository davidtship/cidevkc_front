import React from 'react';
import Select, { components } from 'react-select';
import { CustomImageOptions } from './data';
// Custom option rendering with image
export const CustomSelectOption = ({ innerRef, innerProps, data, }) => (<div ref={innerRef} {...innerProps} className="select__option p-2">
    <img src={data.image} className="img-fluid rounded-circle me-2" style={{ width: '20px', height: '20px' }} alt={data.label}/>
    <span>{data.label}</span>
  </div>);
// Custom control (value shown in input)
export const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0];
    const ControlComponent = components.Control;
    return (<ControlComponent {...props}>
      {selected?.image && (<img src={selected.image} className="img-fluid rounded-circle ms-2" style={{ width: '20px', height: '20px' }} alt={selected.label}/>)}
      {children}
    </ControlComponent>);
};
// Final Select component
const SelectCustomSingle = () => {
    return (<Select isSearchable options={CustomImageOptions} components={{
            Option: CustomSelectOption,
            Control: CustomControl,
        }} classNamePrefix="select"/>);
};
export default SelectCustomSingle;

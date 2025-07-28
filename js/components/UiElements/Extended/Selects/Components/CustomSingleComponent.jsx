import { components } from 'react-select';
const ControlComponent = components.Control;
export const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0];
    return (<ControlComponent {...props}>
      {selected?.image && (<img src={selected.image} className="img-fluid rounded-circle ms-2" style={{ width: '20px', height: '20px' }} alt={selected.label}/>)}
      {children}
    </ControlComponent>);
};

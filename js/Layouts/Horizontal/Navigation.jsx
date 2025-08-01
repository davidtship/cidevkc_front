import { Collapse } from 'react-bootstrap';
import AppMenu from './Menu';
import { getHorizontalMenuItems } from '@/common';
const Navigation = ({ isMenuOpened }) => {
    return (<div className="topnav-content">
      <div className="topnav-inner">
        <nav className="navbar navbar-expand-lg">
          <Collapse in={isMenuOpened}>
            <div className="collapse navbar-collapse" id="topnav-menu-content">
              <AppMenu menuItems={getHorizontalMenuItems()}/>
            </div>
          </Collapse>
        </nav>
      </div>
    </div>);
};
export default Navigation;

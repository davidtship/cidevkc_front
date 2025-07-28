import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { findAllParent, findMenuItem } from '@/common';
const MenuItemWithChildren = ({ item, tag, linkClassName, className, subMenuClassNames, activeMenuItems, toggleMenu, }) => {
    const Tag = tag;
    const [open, setOpen] = useState(activeMenuItems.includes(item.key));
    const showMenu = window.screen.width <= 991 && open;
    useEffect(() => {
        setOpen(activeMenuItems.includes(item.key));
    }, [activeMenuItems, item]);
    const toggleMenuItem = (e) => {
        e.preventDefault();
        const status = !open;
        setOpen(status);
        if (toggleMenu)
            toggleMenu(item, status);
        return false;
    };
    return (<Tag className={`${className} ${activeMenuItems.includes(item.key) ? 'active' : ''}`}>
      <Link to="/#" onClick={toggleMenuItem} data-menu-key={item.key} className={`${linkClassName} ${activeMenuItems.includes(item.key) ? 'active' : ''}`} id={item.key} role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={open}>
        <i className={item.icon}/>
        {item.label}
        <div className="arrow-down"/>
      </Link>

      <div className={`${subMenuClassNames} ${showMenu ? 'show' : ''}`} aria-labelledby={item.key}>
        {(item.children || []).map((child, idx) => {
            return (<React.Fragment key={idx}>
              {child.children ? (<MenuItemWithChildren item={child} tag="div" linkClassName={`dropdown-item ${activeMenuItems.includes(child.key) ? 'active' : ''}`} activeMenuItems={activeMenuItems} className="dropdown" subMenuClassNames="dropdown-menu" toggleMenu={toggleMenu}/>) : (<MenuItemLink item={child} className={`dropdown-item ${activeMenuItems.includes(child.key) ? 'active' : ''}`}/>)}
            </React.Fragment>);
        })}
      </div>
    </Tag>);
};
const MenuItem = ({ item, className, linkClassName }) => {
    return (<li className={className}>
      <MenuItemLink item={item} className={linkClassName}/>
    </li>);
};
const MenuItemLink = ({ item }) => {
    return (<Link className="dropdown-item" to={item.url} target={item.target} data-menu-key={item.key}>
      {item.label}
    </Link>);
};
const AppMenu = ({ menuItems }) => {
    const [topNavMenuItems] = useState(menuItems);
    const [activeMenuItems, setActiveMenuItems] = useState([]);
    const location = useLocation();
    const menuRef = useRef(null);
    const toggleMenu = (menuItem, show) => {
        if (show) {
            setActiveMenuItems([menuItem.key, ...findAllParent(topNavMenuItems, menuItem)]);
        }
    };
    const activeMenu = useCallback(() => {
        const div = document.getElementById('main-side-menu');
        let matchingMenuItem = null;
        if (div) {
            const items = div.getElementsByTagName('a');
            for (let i = 0; i < items.length; ++i) {
                if (location.pathname === items[i].pathname) {
                    matchingMenuItem = items[i];
                    break;
                }
            }
            if (matchingMenuItem) {
                const mid = matchingMenuItem.getAttribute('data-menu-key');
                const activeMt = findMenuItem(menuItems, mid);
                if (activeMt) {
                    setActiveMenuItems([activeMt['key'], ...findAllParent(menuItems, activeMt)]);
                }
            }
        }
    }, [location.pathname, menuItems]);
    useEffect(() => {
        if (topNavMenuItems && topNavMenuItems.length > 0)
            activeMenu();
    }, [activeMenu, topNavMenuItems]);
    return (<ul className="navbar-nav" ref={menuRef} id="main-side-menu">
      {(topNavMenuItems || []).map((item, idx) => {
            return (<React.Fragment key={idx}>
            {item.children ? (<MenuItemWithChildren item={item} tag="li" className="nav-item dropdown" subMenuClassNames="dropdown-menu" activeMenuItems={activeMenuItems} linkClassName="nav-link dropdown-toggle arrow-none" toggleMenu={toggleMenu}/>) : (<MenuItem item={item} className={activeMenuItems.includes(item.key) ? 'active' : ''} linkClassName={activeMenuItems.includes(item.key) ? 'active' : ''}/>)}
          </React.Fragment>);
        })}
    </ul>);
};
export default AppMenu;

import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import * as BoxIcons from 'react-icons/bi';
const IconsBoxIcons = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const icons = Object.values(BoxIcons);
    const formatIconName = (name) => {
        return name.replace(/^Bi/, '');
    };
    const filteredIcons = icons.filter((icon) => icon.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<>
      <Card>
        <Card.Header>
          <div className="input-group">
            <span className="input-group-text border-0">
              <i className="fi fi-rr-search"></i>
            </span>
            <input type="search" placeholder="Search icons..." className="border-0 text-dark" onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            {filteredIcons.map((Icon, index) => (<Col key={index} xs={6} sm={4} md={3} lg={2}>
                <div className="icon-holder">
                  <Icon />
                  <span className="label">{formatIconName(Icon.name)}</span>
                </div>
              </Col>))}
          </Row>
        </Card.Body>
      </Card>
    </>);
};
export default IconsBoxIcons;

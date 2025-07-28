import { Component } from 'react';
import { Stack, Button } from 'react-bootstrap';
import PageBreadcrumb from '../Common/PageBreadcrumb';
import 'flatpickr/dist/themes/airbnb.css';
class PageDashBreadcrumb extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleDateChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (dates, str) => {
                this.setState({
                    range: dates,
                });
            }
        });
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 12);
        this.state = {
            range: [oneWeekAgo, new Date()],
        };
    }
    render() {
        return (<>
        <Stack direction="horizontal" className="justify-content-between">
          <PageBreadcrumb title={this.props.title} subName={this.props.subName}/>
          <Stack gap={2} direction="horizontal" className="mt-2 mb-4 mb-md-6 d-none d-md-flex">
           
            <Button variant="primary">
              <i className="fi fi-rr-stats"></i>
              <span className="ms-2">Rapport</span>
            </Button>
          </Stack>
        </Stack>
      </>);
    }
}
export default PageDashBreadcrumb;

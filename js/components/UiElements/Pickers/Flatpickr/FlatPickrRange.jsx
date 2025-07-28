import { Component } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
class FlatPickrRange extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (dates) => {
                const [date] = dates;
                this.setState({ date });
            }
        });
        this.state = {
            date: new Date(),
            v: '2016-01-01 01:01',
            onChange: (_, str) => {
                console.info(str);
            },
            range: [new Date()],
            startDate: new Date(),
            endDate: new Date(),
            handler: (dates) => {
                console.log('initial handler', dates);
            },
        };
    }
    render() {
        return (<>
        <Flatpickr value={this.state.range} options={{ mode: 'range' }} onChange={(dates, str) => {
                this.setState((state) => ({
                    ...state,
                    range: dates,
                }));
            }} className="form-control" placeholder="Select date..."/>
      </>);
    }
}
export default FlatPickrRange;

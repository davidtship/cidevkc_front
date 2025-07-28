import React from 'react';
class ChangingProgressProvider extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                valuesIndex: 0,
            }
        });
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length,
            });
        }, this.props.interval);
    }
    render() {
        return this.props.children(this.props.values[this.state.valuesIndex]);
    }
}
Object.defineProperty(ChangingProgressProvider, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        interval: 1000,
    }
});
export default ChangingProgressProvider;

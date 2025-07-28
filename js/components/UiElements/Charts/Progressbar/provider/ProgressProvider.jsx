import React from 'react';
class ProgressProvider extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                value: this.props.valueStart,
            }
        });
    }
    componentDidMount() {
        this.timeout = window.setTimeout(() => {
            this.setState({
                value: this.props.valueEnd,
            });
        }, 0);
    }
    componentWillUnmount() {
        window.clearTimeout(this.timeout);
    }
    render() {
        return this.props.children(this.state.value);
    }
}
Object.defineProperty(ProgressProvider, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        valueStart: 0,
    }
});
export default ProgressProvider;

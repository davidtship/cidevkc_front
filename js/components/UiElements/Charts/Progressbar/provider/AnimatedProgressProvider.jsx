import React from 'react';
import { Animate } from 'react-move';
class AnimatedProgressProvider extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                isAnimated: false,
            }
        });
    }
    componentDidMount() {
        this.setState({
            isAnimated: true,
        });
    }
    render() {
        return (<Animate start={() => ({
                value: this.props.valueStart,
            })} update={() => ({
                value: [this.state.isAnimated ? this.props.valueEnd : this.props.valueStart],
                timing: {
                    duration: this.props.duration * 1000,
                    ease: this.props.easingFunction,
                },
            })}>
        {({ value }) => this.props.children(value)}
      </Animate>);
    }
}
Object.defineProperty(AnimatedProgressProvider, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        valueStart: 0,
    }
});
export default AnimatedProgressProvider;

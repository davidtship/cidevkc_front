import { Route } from 'react-router-dom';
/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */
const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    return (<Route {...rest} render={(props) => {
            return <Component {...props}/>;
        }}/>);
};
export default PrivateRoute;

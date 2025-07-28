import { Route, Navigate, RouteProps } from 'react-router-dom'

import { useAuthContext } from '@/common'

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: RouteProps) => {
        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute

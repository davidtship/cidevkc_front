import React from 'react';
import CommonCard from './CommonCard';
import TitleHelmet from '@/components/Common/TitleHelmet';
const NotAuthorized = () => {
    const commonCardProps = {
        error: '401',
        errorTitle: 'You are not authorized!',
        errorMessage: 'You do not have permission to view this page using the credentials that you have provided.',
    };
    return (<>
      <TitleHelmet title="401 Not Authorized"/>
      <CommonCard {...commonCardProps}/>
    </>);
};
export default NotAuthorized;

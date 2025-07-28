import React from 'react';
import CommonCard from './CommonCard';
import TitleHelmet from '@/components/Common/TitleHelmet';
const ServerError = () => {
    const commonCardProps = {
        error: '500',
        errorTitle: 'Internal server error!',
        errorMessage: 'There was an error with the internal server. Please contact your site administrator.',
    };
    return (<>
      <TitleHelmet title="500 Server Error"/>
      <CommonCard {...commonCardProps}/>
    </>);
};
export default ServerError;

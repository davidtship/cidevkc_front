import { Helmet } from 'react-helmet';
const TitleHelmet = ({ title }) => {
    return (<>
      <Helmet>
        <title>{title} | Window - React Admin & Dashboard</title>
      </Helmet>
    </>);
};
export default TitleHelmet;

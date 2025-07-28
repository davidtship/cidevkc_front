import 'jsvectormap/dist/js/jsvectormap.min.js';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/css/jsvectormap.min.css';
import MapBase from './MapBase';
import { mapOptsAdvanced } from './data';
const MapVectorAdvanced = ({ width, height }) => {
    return (<>
      <MapBase type="world" width={width} height={height} options={mapOptsAdvanced}/>
    </>);
};
export default MapVectorAdvanced;

import MapBase from './MapBase';
import { mapOptsMarker } from './data';
import 'jsvectormap/dist/js/jsvectormap.min.js';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/css/jsvectormap.min.css';
const MapVectorMarker = ({ width, height }) => {
    return (<>
      <MapBase type="world" width={width} height={height} options={mapOptsMarker}/>
    </>);
};
export default MapVectorMarker;

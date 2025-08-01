import { useEffect, useState } from 'react';
const MapBase = ({ width, height, options, type }) => {
    const selectorId = type + new Date().getTime();
    const [map, setMap] = useState();
    useEffect(() => {
        if (!map) {
            const map = new window['jsVectorMap']({
                selector: '#' + selectorId,
                map: type,
                ...options,
            });
            setMap(map);
        }
    }, [selectorId, map, options, type]);
    return (<>
      <div id={selectorId} style={{ width: width, height: height }}></div>
    </>);
};
export default MapBase;

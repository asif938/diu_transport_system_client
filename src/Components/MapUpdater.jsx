// import { useEffect } from "react";
// import { useMap } from "react-leaflet";

// const MapUpdater = ({ center }) => {
//   const map = useMap();

//   useEffect(() => {
//     map.setView(center, 14);  
//   }, [center, map]);

//   return null;
// };

// export default MapUpdater;


import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ center, zoom = 13, active }) {
  const map = useMap();

  useEffect(() => {
    if (active && center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [active, center, zoom, map]);

  return null;
}


import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 14);  
  }, [center, map]);

  return null;
};

export default MapUpdater;

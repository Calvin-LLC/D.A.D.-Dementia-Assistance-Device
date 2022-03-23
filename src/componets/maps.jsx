import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "./maps.css";

import { db_get } from "./storage";
import { map_style } from "./map_style";

export const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    db_get("location_obj").then((location_obj) => {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: map_style,
        center: [location_obj.longitude, location_obj.latitude],
        zoom: 16,
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([location_obj.longitude , location_obj.latitude])
        .addTo(map.current);
    });
  }, []);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

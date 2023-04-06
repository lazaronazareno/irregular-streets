'use client'
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import icon from '../assets/icon.png'

function Map() {
  const [irregulars, setIrregulars] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    const obtenerIrregularidades = async () => {
      try {
        const response = await axios.get(process.env.API_ENDPOINT);
        setIrregulars(response.data);
      } catch (error) {
        alert('Error al obtener irregularidades');
      }
    };

    obtenerIrregularidades();
  }, [])

  useEffect(() => {
    // Crea el mapa
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-58.37723, -34.61315 ], // Coordenadas iniciales del mapa
      zoom: 9, // Nivel de zoom inicial
    });
// Agrega una fuente de datos y una capa de símbolos al mapa después de que se haya cargado
    map.on('load', () => {
      map.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'markers',
        type: 'symbol',
        source: 'markers',
        layout: {
          'icon-image': 'police-15',
          'icon-allow-overlap': true,
        },
      });

      // Agrega marcadores fijos al mapa con información adicional en un elemento HTML personalizado
      const features = irregulars.map(obj => ({
        type: 'Feature',
        properties: obj,
        geometry: obj.ubicacion,
      }));

      map.getSource('markers').setData({
        type: 'FeatureCollection',
        features,
      });

      // Actualiza la información del marcador seleccionado cuando el usuario hace clic en un marcador
      map.on('click', 'markers', e => {
        const obj = e.features[0].properties;
        setSelectedMarker(obj);
      });
    });

    // Limpia el mapa cuando el componente es desmontado
    return () => map.remove();
  }, []);

  return (
    <>
      <div id="map-container" style={{ width: '100%', height: '500px' }} />
      {selectedMarker && (
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, padding: '10px', backgroundColor: '#fff' }}>
          <h3>{selectedMarker.tipo}</h3>
          <p>Fecha: {new Date(selectedMarker.fecha).toLocaleDateString()}</p>
          <p>Creador: {selectedMarker.creador}</p>
          <p>Anotación: {selectedMarker.anotacion}</p>
          <button type='button' onClick={() => setSelectedMarker(null)}>❌</button>
        </div>
      )}
    </>
  );
}

export default Map;

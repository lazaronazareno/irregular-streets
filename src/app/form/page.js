'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';

function Formulario() {
  const [map, setMap] = useState(null);
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null });
  const [tipo, setTipo] = useState('');
  const [anotacion, setAnotacion] = useState('');

  useEffect(() => {
    const mapboxgl = require('mapbox-gl');
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-58.4667, -34.5833],
      zoom: 12,
    });

    map.on('load', () => {
      map.addSource('marker', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    
      map.addLayer({
        id: 'marker',
        type: 'symbol',
        source: 'marker',
        layout: {
          'icon-image': 'police-15',
          'icon-allow-overlap': true,
        },
      });
    });
    
    map.on('dblclick', (e) => {
      setUbicacion({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    
      map.getSource('marker').setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
          },
        ],
      });
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newObject = {
      tipo,
      anotacion,
      creador: 'Usuario anónimo',
      latitud : ubicacion.lat,
      longitud : ubicacion.lng,
    }
    
    try {
      await axios.post(process.env.API_ENDPOINT, newObject);

      alert('Irregularidad creada con éxito');
    } catch (error) {
      console.log(error)
      alert('Error al crear irregularidad');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tipo de irregularidad:
        <select name="tipo" onChange={(e) => setTipo(e.target.value)}>
          <option value="pozo">Pozo</option>
          <option value="irregularidad">Irregularidad</option>
          {/* Agrega más opciones según tus necesidades */}
        </select>
      </label>
      <label>
        Anotación:
        <input type="text" name="anotacion" value={anotacion} onChange={(e) => setAnotacion(e.target.value)} />
      </label>
      <div id="map" style={{ height: '500px' }} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;

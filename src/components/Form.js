'use client'
import { useState, useEffect } from 'react';

function Formulario() {
  const [map, setMap] = useState(null);
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null });
  const [tipo, setTipo] = useState('');
  const [anotacion, setAnotacion] = useState('');

  useEffect(() => {
    // Aquí cargas el mapa y creas un control de mapa para permitir que los usuarios seleccionen la ubicación
    const mapboxgl = require('mapbox-gl');
    mapboxgl.accessToken = 'pk.eyJ1IjoiZnVsbG1ldGFsZHJhZ29uIiwiYSI6ImNsZzQ1dml2NTBtNXoza3N0cjBiazJ0ZmgifQ.199Q0V1glJxuVy68ad1wGg';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-58.37723, -34.61315 ],
      zoom: 10,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([-58.37723, -34.61315])
      .addTo(map);

    marker.on('dragend', function () {
      const lngLat = marker.getLngLat();
      setUbicacion({ lat: lngLat.lat, lng: lngLat.lng });
    });

    setMap(map);

    return () => {
      // Aquí limpias los recursos utilizados por el mapa
      map.remove();
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // Aquí enviarías el formulario a la base de datos con la ubicación seleccionada
    console.log({
      tipo,
      anotacion,
      creador: 'Usuario anónimo',
      ubicacion
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tipo de irregularidad:
        <select name="tipo">
          <option value="pozo" onChange={(e) => setTipo(e.target.value)}>Pozo</option>
          <option value="irregularidad" onChange={(e) => setTipo(e.target.value)}>Irregularidad</option>
          {/* Agrega más opciones según tus necesidades */}
        </select>
      </label>
      <label>
        Anotación:
        <input type="text" name="anotacion" value={anotacion} onChange={(e) => setAnotacion(e.target.value)} />
      </label>
      <div id="map" style={{ height: '200px' }} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;

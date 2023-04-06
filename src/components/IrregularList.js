import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mapa from '../components/Mapa';
import Formulario from '../components/Formulario';

const Index = () => {
  const [irregularidades, setIrregularidades] = useState([]);

  useEffect(() => {
    const obtenerIrregularidades = async () => {
      try {
        const response = await axios.get(process.env.API_ENDPOINT);
        setIrregularidades(response.data);
      } catch (error) {
        alert('Error al obtener irregularidades');
      }
    };

    obtenerIrregularidades();
  }, []);

  return (
    <div>
      <Mapa irregularidades={irregularidades} />
      <Formulario />
      <ul>
        {irregularidades.map((irregularidad) => (
          <li key={irregularidad._id}>
            <strong>{irregularidad.tipo}</strong>
            <p>{irregularidad.anotacion}</p>
            <p>Creado por {irregularidad.creador} el {new Date(irregularidad.fecha).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
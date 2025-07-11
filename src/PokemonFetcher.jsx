import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css'; // Opcional: para estilos básicos

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('');
  const [titulo, setTitulo] = useState(false)

useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set(); // Usar un Set para asegurar IDs únicos

        // Generar 4 IDs de Pokémon únicos aleatorios
        while (pokemonIds.size < 4) {
          const randomId = Math.floor(Math.random() * 898) + 1; // 898 es el número actual de Pokémon en la PokeAPI (puedes ajustarlo)
          pokemonIds.add(randomId);
        }

        // Convertir el Set a un array para iterar
        const idsArray = Array.from(pokemonIds);

        for (const id of idsArray) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          if (!response.ok) {
            throw new Error(`Error al cargar el Pokémon con ID ${id}: ${response.statusText}`);
          }
          const data = await response.json();
          fetchedPokemones.push({
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
          });
        }
        setPokemones(fetchedPokemones);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const typePokemones = async () => {
    if (!tipo) return;
    try {
      setCargando(true)
      setError(null)
      const tiposEncontrados = [];
      
      const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${tipo.toLowerCase()}/`)
      if (!respuesta.ok){
        throw new error ('Tipo no encontrado, asegurese de anotarlo bien')
      }
      const data = await respuesta.json();
      const PokemonPorTipo = data.pokemon.slice(0)
      for (const entry of PokemonPorTipo){
        const pokeResp = await fetch(entry.pokemon.url);
        const pokeData = await pokeResp.json();
        tiposEncontrados.push({
          id: pokeData.id,
          nombre: pokeData.name,
          imagen: pokeData.sprites.front_default,
          tipos: pokeData.types.map(typeInfo => typeInfo.type.name),
        });
      }
      setPokemones(tiposEncontrados);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
      setTitulo(true)
    }
  };

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className='pokemon-container'>
      <div>
        <h3>Buscador Por Tipo</h3>
        <input type="text" value={tipo} onChange={e => setTipo(e.target.value)} placeholder="Ejemplo: fire, dark, steel"/>
        <button onClick={typePokemones} disabled={cargando || !tipo}>{cargando ? "Buscando..." : "Buscar"}</button>
      </div>
      <h2>{titulo ? "Pokemon de tipo : "+tipo.charAt(0).toUpperCase()+tipo.slice(1) : "Tus 4 Pokémon Aleatorios"}</h2>
      <div className="pokemon-list"> 
        {pokemones.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            <p>
              **Tipos:** {pokemon.tipos.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;
require('dotenv').config();
const { URL_API, URL_API_TYPES, URL_API_ID } = process.env;
const { Type, Pokemon } = require('../db.js');

const getPokemonsDB = async () => {
    const dbPokemons = await Pokemon.findAll({
        include: {
            model: Type,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }
    });

    const dbPokemonsMapped = dbPokemons.map(pokemon => {
        return {
            id: pokemon.id,
            name: pokemon.name,
            hp: pokemon.hp,
            str: pokemon.str,
            def: pokemon.def,
            spd: pokemon.spd,
            height: pokemon.height,
            weight: pokemon.weight,
            img: pokemon.img,
            types: pokemon.types.map(type => type.name)
        }
    });

    return dbPokemonsMapped;
}

const getPokemonsApi = async () => {
    const apiPokemons = await fetch(URL_API)
        .then(res => res.json())
        .then(data => data.results);

    const apiPokemonsMapped = apiPokemons.map(pokemon => {
        return {
            name: pokemon.name,
            id: pokemon.url.split('/')[6]
        }
    });

    return apiPokemonsMapped;
}

const getAllPokemons = async () => {
    const dbPokemons = await getPokemonsDB();
    const apiPokemons = await getPokemonsApi();

    return [...dbPokemons, ...apiPokemons];
}

const getAllTypes = async () => {
    const allTypes = await fetch(URL_API_TYPES)
        .then(res => res.json())
        .then(data => data.results);

    const cleanTypes = allTypes.map(type => {
        return {
            name: type.name
        }
    });

    return cleanTypes;
}

const getPokemonById = async (id) => {
    const response = await fetch(`${URL_API_ID}${id}`);
    
    if (!response.ok) {
        const db = await getPokemonsDB();
        const filtredDb = db.filter(pokemon => pokemon.id === id);
        
        if (filtredDb.length === 0) {
            throw new Error(`Pokemon with id ${id} not found in API or DB`);
        }

        return filtredDb;
    }

    const filtredApi = await response.json();
    const filtredPokemonById = {
        id: filtredApi.id,
        name: filtredApi.name,
        hp: filtredApi.stats[0].base_stat,
        str: filtredApi.stats[1].base_stat,
        def: filtredApi.stats[2].base_stat,
        spd: filtredApi.stats[5].base_stat,
        height: filtredApi.height,
        weight: filtredApi.weight,
        img: filtredApi.sprites.other['official-artwork'].front_default,
        types: filtredApi.types.map(type => type.type.name)
    }
    return filtredPokemonById;
}

module.exports = {
    getPokemonsDB,
    getPokemonsApi,
    getAllPokemons,
    getAllTypes,
    getPokemonById
}
const {getAllPokemons} = require('../utils/index');

const findPokemonByName = async (req, res, next) => {
    const {name} = req.query;
    try {
        if(name){
            const pokemons = await getAllPokemons();
            const pokemon = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(name.toLowerCase()));
            if (pokemon.length === 0) {
                return res.status(404).send({message: "Pokemon not found"});
            }
            res.json(pokemon);
        } else {
            next();
        }
    } catch (error) {
        res.status(500).send({message: "Someting went wrong", error});
    }
}

module.exports = {
    findPokemonByName
}
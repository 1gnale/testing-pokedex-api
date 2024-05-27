const {getAllPokemons} = require('../utils/index');

const getPokemons = async (req, res) => {
    try {
        const pokemons = await getAllPokemons();
        res.json(pokemons);
    } catch (error) {
        res.status(500).send({message: "Someting went wrong", error});
    }
}

module.exports = {
    getPokemons
}
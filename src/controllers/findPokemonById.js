const {getPokemonById} = require('../utils/index');

const findPokemonById = async (req, res) => {
    const {id} = req.params;
    try {
        const pokemon = await getPokemonById(id);
        res.json(pokemon);
    } catch (error) {
        res.status(404).json({error: "Pokemon not found"});
    }
}

module.exports = {
    findPokemonById
};
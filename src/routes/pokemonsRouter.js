const {Router} = require('express');
const {getPokemons} = require('../controllers/allPokemonsController.js');
const {findPokemonByName} = require('../controllers/findPokemonByName.js');
const {findPokemonById} = require('../controllers/findPokemonById.js');
const { createPokemon } = require('../controllers/createPokemon.js');
const {validatePokemon} = require('../middlewares/validatePost.js');

const pokemonsRouter = Router()

pokemonsRouter.get('/', findPokemonByName, getPokemons);

pokemonsRouter.get('/:id', findPokemonById);

pokemonsRouter.post('/', validatePokemon, createPokemon)

module.exports = pokemonsRouter;
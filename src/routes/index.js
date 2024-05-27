const {Router} = require('express');
const typesRouter = require('./typesRouter.js');
const pokemonsRouter = require('./pokemonsRouter.js');

const router = Router();

router.use('/types', typesRouter);
router.use('/pokemons' , pokemonsRouter);

module.exports = router;
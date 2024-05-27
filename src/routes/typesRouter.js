const {Router} = require('express');
const {typesController} = require('../controllers/typesController.js');


const typeRouter = Router()

typeRouter.get('/', typesController);

module.exports = typeRouter;
const {getAllTypes} = require('../utils/index.js');
const {Type} = require('../db.js');

const typesController = async (req, res) => {
    try {
        const allTypes = await getAllTypes();
        const promises = allTypes.map((e) => {
            return Type.findOrCreate({
                where: {name: e.name}
            });
        });
        await Promise.all(promises);
        const allTypesDB = await Type.findAll();
        res.status(200).json(allTypesDB);
        
    } catch (error) {
        res.status(500).json({message: "Something went wrong, error: ", error: error.message});
    }
}

module.exports = {
    typesController
}
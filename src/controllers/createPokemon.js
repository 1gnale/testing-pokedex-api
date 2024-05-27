const {Pokemon} = require('../db');

const createPokemon = async (req, res) => {
    const { name, hp, str, def, spd, height, weight, img, types } = req.body;
    try {
        const newPokemon = await Pokemon.create({
            name,
            hp,
            str,
            def,
            spd,
            height,
            weight,
            img
        });
        await newPokemon.setTypes(types);
        res.status(200).send("Pokemon created successfully");
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    createPokemon
};
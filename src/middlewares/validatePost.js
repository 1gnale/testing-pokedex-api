const validatePokemon = (req, res, next) => {
    const { name, hp, str, def, spd, height, weight, img, types } = req.body;
    if (!name || !hp || !str || !def || !spd || !height || !weight || !img || !types) {
        return res.status(400).send("Missing fields");
    }
    next();
}

module.exports = {
    validatePokemon
}
const { app } = require("../src/app.js")
const request = require("supertest")
const { conn, Pokemon, Type } = require('../src/db.js');

describe('Database:', () => {
    it('should connect to the database', async () => {
        await conn.authenticate();
    });
})

describe('Models: ', () => {
    it('Pokemon should have the correct properties', async () => {
        const pikachu = await Pokemon.create({
            name: 'Pikachu',
            hp: "35",
            str: "55",
            def: "40",
            spd: "90",
            height: "4",
            weight: "60",
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        });
        expect(pikachu).toEqual(expect.objectContaining({
            name: 'Pikachu',
            hp: "35",
            str: "55",
            def: "40",
            spd: "90",
            height: "4",
            weight: "60",
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        }));
    });

    it('Type should have the correct properties', async () => {
        const [electric] = await Type.findOrCreate({ where: { name: 'electric' } });
        expect(electric).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: 'electric',
        }));
    });

    it('Pokemon must be able to associate a Type', async () => {
        const pikachu = await Pokemon.findOne({ where: { name: 'Pikachu', spd: "90", height: "4" } });
        const electric = await Type.findOne({ where: { name: 'electric' } });

        await pikachu.addType(electric);
        const types = await pikachu.getTypes();
        expect(types).toContainEqual(expect.objectContaining({
            id: expect.any(Number),
            name: 'electric',
        }));
        await Pokemon.destroy({ where: { id: pikachu.dataValues.id } });
    });

    afterAll(async () => {
        await conn.close();
    });

});


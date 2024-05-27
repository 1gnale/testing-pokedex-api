const { conn, Pokemon, Type } = require('../src/db.js');
const { getPokemonsDB, getPokemonsApi, getAllPokemons, getAllTypes, getPokemonById } = require('../src/utils/index.js');

describe("Utility functions:", () => {

    it("getPokemonsDB should return an array of objects with all the pokemons in the database", async () => {
        await Type.findOrCreate({where:{ name: 'electric' }});
        await Pokemon.create({
            name: 'Pikachu',
            hp: "35",
            str: "55",
            def: "40",
            spd: "90",
            height: "4",
            weight: "60",
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        });
        const pikachu = await Pokemon.findOne({ where: { name: 'Pikachu', spd: "90", height: "4" } });
        const electric = await Type.findOne({ where: { name: 'electric' } });
        await pikachu.addType(electric);
        const pokemons = await getPokemonsDB();
        expect(pokemons).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                hp: expect.any(String),
                str: expect.any(String),
                def: expect.any(String),
                spd: expect.any(String),
                height: expect.any(String),
                weight: expect.any(String),
                img: expect.any(String),
                types: expect.arrayContaining([expect.any(String)])
            })
        ]));
        await Pokemon.destroy({ where: { id: pikachu.dataValues.id } });
    })
    it("getPokemonsApi should return an array of objects with all the pokemons in the pokeapi", async () => {
        const pokemons = await getPokemonsApi();
        expect(pokemons).toEqual(expect.arrayContaining([
            expect.objectContaining({
                name: expect.any(String),
                id: expect.any(String)
            })
        ]));
    })
    it("getAllPokemons should return an array with all the pokemons in the database and the pokeapi", async () => {
        const pokemons = await getAllPokemons();
        expect(pokemons.length).toBeGreaterThan(247);
        expect(pokemons).toEqual(expect.arrayContaining([expect.objectContaining({ name: expect.any(String), id: expect.any(String) })]));
    })
    it("getAllTypes should return an array with all the types in the pokeapi", async () => {
        const types = await getAllTypes();
        expect(types.length).toBe(20);
        expect(types).toEqual(expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]));
    })
    it("getPokemonById should return an object with the pokemon's data", async () => {
        const pokemon = await getPokemonById(1);
        expect(pokemon).toEqual(expect.objectContaining({
            id: 1,
            name: "bulbasaur",
            hp: 45,
            str: 49,
            def: 49,
            spd: 45,
            height: 7,
            weight: 69,
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            types: expect.arrayContaining(["grass", "poison"])
        }));
    })

    afterAll(async () => {
        await conn.close();
    });
})
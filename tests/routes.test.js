const request = require('supertest');
const { conn, Pokemon, Type } = require('../src/db.js');
const server = require('../src/app.js');
const { getPokemonById } = require('../src/utils/index.js');

describe('Routes:', () => {


    it("GET /types should get 200", async () => {
        const res = await request(server).get("/types")
        expect(res.status).toBe(200);
    });
    it("GET /types should respond with an array of types", async () => {
        const res = await request(server).get("/types")
        expect(Array.isArray(res.body)).toBe(true);
    });
    it("GET /pokemons should get 200", async () => {
        const res = await request(server).get("/pokemons")
        expect(res.status).toBe(200);
    });
    it("GET /pokemons should respond with an array of pokemons", async () => {
        const res = await request(server).get("/pokemons")
        expect(Array.isArray(res.body)).toBe(true);
    });
    it("GET /pokemons?name=pikachu should get 200", async () => {
        const res = await request(server).get("/pokemons?name=pikachu")
        expect(res.status).toBe(200);
    });
    it("GET /pokemons?name=pikachu should respond with an object wiht name and id", async () => {
        const res = await request(server).get("/pokemons?name=pikachu")
        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[0]).toHaveProperty("id");
    });
    it("GET /pokemons?name=xdxdxdxd should respond with an error", async () => {
        const res = await request(server).get("/pokemons?name=xdxdxdxd")
        expect(res.status).toBe(404);
    });
    it("GET /pokemons/1 should get 200", async () => {
        const res = await request(server).get("/pokemons/1")
        expect(res.status).toBe(200);
    });
    it("GET /pokemons/1 should respond with an object with the pokemon's data", async () => {
        const res = await request(server).get("/pokemons/1")
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("hp");
        expect(res.body).toHaveProperty("str");
        expect(res.body).toHaveProperty("def");
        expect(res.body).toHaveProperty("spd");
        expect(res.body).toHaveProperty("height");
        expect(res.body).toHaveProperty("weight");
        expect(res.body).toHaveProperty("img");
        expect(res.body).toHaveProperty("types");
    });
    it("GET /pokemons/xdxdxd should respond with an error", async () => {
        const res = await request(server).get("/pokemons/xdxdxd")
        expect(res.status).toBe(404);
    });
    it("GET /pokemons/uuid should respond with a db pokemon", async () => {
        const pikachu = await Pokemon.create({
            name: "pikachu",
            hp: 35,
            str: 55,
            def: 40,
            spd: 90,
            height: 4,
            weight: 60,
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        });
        const pikachuId = pikachu.dataValues.id;
        const res = await request(server).get(`/pokemons/${pikachuId}`);
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[0]).toHaveProperty("hp");
        expect(res.body[0]).toHaveProperty("str");
        expect(res.body[0]).toHaveProperty("def");
        expect(res.body[0]).toHaveProperty("spd");
        expect(res.body[0]).toHaveProperty("height");
        expect(res.body[0]).toHaveProperty("weight");
        expect(res.body[0]).toHaveProperty("img");
        expect(res.body[0]).toHaveProperty("types");
        await Pokemon.destroy({where: {id: pikachuId}});
    });
    it("POST /pokemons should get 200", async () => {
        const res = await request(server).post("/pokemons").send({
            name: "pikachu",
            hp: 35,
            str: 55,
            def: 40,
            spd: 90,
            height: 4,
            weight: 60,
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            types: [1, 2]
        });
        expect(res.status).toBe(200);
        const toDestroy = await Pokemon.findOne({where: {name: "pikachu"}})
        await Pokemon.destroy({where: {id: toDestroy.dataValues.id}});
    });
    it("POST /pokemons should post a new pokemon succesfully", async () => {
        const res = await request(server).post("/pokemons").send({
            name: "pikachu",
            hp: 35,
            str: 55,
            def: 40,
            spd: 90,
            height: 4,
            weight: 60,
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            types: [1, 2]
        });
        const toDestroy = await Pokemon.findOne({where: {name: "pikachu"}})
        const filtredPokemon = await getPokemonById(toDestroy.dataValues.id);
        
        expect(toDestroy.dataValues.name).toBe("pikachu");
        expect(toDestroy.dataValues.hp).toBe("35");
        expect(toDestroy.dataValues.str).toBe("55");
        expect(toDestroy.dataValues.def).toBe("40");
        expect(toDestroy.dataValues.id).toBe(toDestroy.dataValues.id);
        expect(toDestroy.dataValues.spd).toBe("90");
        expect(toDestroy.dataValues.height).toBe("4");
        expect(toDestroy.dataValues.weight).toBe("60");
        expect(toDestroy.dataValues.img).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png");
        const idx1 = await Type.findOne({where: {id: 1}});
        const idx2 = await Type.findOne({where: {id: 2}});
        expect(filtredPokemon[0].types).toEqual([idx1.name, idx2.name]);
        await Pokemon.destroy({where: {id: toDestroy.dataValues.id}});
    });
    it("POST /pokemons should respond with an error if the request is incomplete", async () => {
        const res = await request(server).post("/pokemons").send({
            name: "pikachu",
            weight: 60,
            img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        });
        expect(res.status).toBe(400);
    });
    afterAll(async () => {
        await conn.close(); 
    });
});
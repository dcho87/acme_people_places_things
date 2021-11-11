const Sequelize = require('sequelize')
const { DataTypes: { STRING, ENUM } } = Sequelize;
const conn = new Sequelize(process.env.DATABASE || 'postgres://localhost/acme_people_places_things_db');

const People = conn.define('people', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Places = conn.define('places', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Things = conn.define('things', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Souvenir = conn.define(`souvenir`, {
    souvenir: {
      type: ENUM(`foo`, `bar`, `bazz`),
    },
  });

Souvenir.belongsTo(People)
Souvenir.belongsTo(Places)
Souvenir.belongsTo(Things)
People.hasMany(Souvenir)
Places.hasMany(Souvenir)
Things.hasMany(Souvenir)

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

  const syncAndSeed = async() => {
    try{
        await conn.sync({ force: true });
        const people = await Promise.all(
            data.people.map(name => 
                People.create({name}))
        )
        const places = await Promise.all(
            data.places.map(name => 
                Places.create({name}))
        )
        const things = await Promise.all(
            data.things.map(name => 
                Things.create({name}))
        )
        await Promise.all([
            Souvenir.create({ personId: 1, placeId: 4, souvenir: 'foo'}),
            Souvenir.create({ personId: 1, placeId: 1, souvenir: 'bar'}),
            Souvenir.create({ personId: 4, placeId: 2, souvenir: 'bazz'}),
          ]);
    }
    catch(ex){
        console.log(ex)
    }
  }

  module.exports = {
      syncAndSeed,
      models: {
          People,
          Places,
          Things,
          Souvenir
      }
  }
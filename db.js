const Sequelize = require('sequelize')
const { DataTypes: { STRING} } = Sequelize;
const conn = new Sequelize(process.env.DATABASE || 'postgres://localhost/acme_people_places_things_db');

const Person = conn.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Place = conn.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Thing = conn.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
})

const Souvenir = conn.define(`souvenir`, {
  });

Person.hasMany(Souvenir)
Souvenir.belongsTo(Person)
Souvenir.belongsTo(Place)
Souvenir.belongsTo(Thing)

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

  const syncAndSeed = async() => {
    try{
        await conn.sync({ force: true });
        await Promise.all(
            data.people.map(name => 
                Person.create({name}))
        )
        await Promise.all(
            data.places.map(name => 
                Place.create({name}))
        )
        await Promise.all(
            data.things.map(name => 
                Thing.create({name}))
        )
    }
    catch(ex){
        console.log(ex)
    }
  }

  module.exports = {
      syncAndSeed,
      models: {
          Person,
          Place,
          Thing,
          Souvenir
      }
  }
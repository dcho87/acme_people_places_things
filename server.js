const express = require('express')
const app = express();
const {syncAndSeed, models: { Person, Place, Thing, Souvenir}} = require('./db')
const path = require('path')

app.use(require('method-override')('_method'))
app.use(express.urlencoded( { extended: false }))

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/', async(req, res, next) => {
    try{
        await Souvenir.create(req.body)
        res.redirect('/')
    }
    catch(ex){
        next(ex)
    }
})

app.delete('/:id', async(req, res, next) => {
    try{
        const souvenirDel = await Souvenir.findByPk(req.params.id);
        await souvenirDel.destroy();
        res.redirect('/')
    }
    catch(ex) {
        next(ex)
    }
})

app.get('/', async(req, res, next)=> {
    try{
        const people = await Person.findAll({
            include: [Souvenir]
        });
        const places = await Place.findAll({
        });
        const things = await Thing.findAll({
        });
        const souvenirs = await Souvenir.findAll({
            include: [Person, Place, Thing]
        });

const html = `
<html>
<head>
    <title>People, Places & Things</title>
    <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body>
<h1>Acme Souvenirs </h1>
<main>
<div>
    <h2> People </h2>
    <ul>
        ${people.map(person => `
            <li>
                ${person.name}
                (${person.souvenirs.length})
            </li>
            `).join('')}
    </ul>
    <h2> Places </h2>
    <ul>
    ${places.map(place => `
        <li>
            ${place.name}
        </li>
        `).join('')}
    </ul>
    <h2> Things </h2>
    <ul>
    ${things.map(thing => `
    <li>
        ${thing.name}
    </li>
    `).join('')}
    </ul>
    </div>
    <div>
    <h2> Souvenirs </h2>
    <form method='POST'>
    <select name='personId'>
      ${
        people.map( person => {
          return `
            <option value=${person.id}>
              ${ person.name }
            </option>
          `;
        }).join('')
      }
    </select>
    <select name='placeId'>
      ${
        places.map( place => {
          return `
            <option value=${place.id}>
              ${ place.name }
            </option>
          `;
        }).join('')
      }
    </select>
    <select name='thingId'>
      ${
        things.map( thing => {
          return `
            <option value=${thing.id}>
              ${ thing.name }
            </option>
          `;
        }).join('')
      }
    </select>
    <button>Create</button>
  </form>
    <ul>
    ${souvenirs.map(souvenir => {
        return `
        <li>
            ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
            <p>Purchased On: (${souvenir.person.updatedAt})</p>
            <form method='POST' action='/${souvenir.id}?_method=DELETE'>
            <button>
            x 
            </button>
            </form>
        </li>
        `}).join('')}

</ul>
</div>
</main>
</body>
</html>
`

        res.send(html)
    }
    catch(ex){
        next(ex)
    }
})

const init = async() =>{
    try{
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`))
    }
    catch(ex) {
        console.log(ex)
    }
}

init();
const express = require('express')
const app = express();
const {syncAndSeed, models: { People, Places, Things, Souvenir}} = require('./db')

app.use(express.urlencoded( {extended: false}))

app.post('/', async(req, res, next) => {
    try{
        const post = await Souvenir.create(req.body)
        res.redirect('/')
    }
    catch(ex){
        next(ex)
    }
})

app.get('/', async(req, res, next)=> {
    try{
        const people = await People.findAll({
            include: [ Souvenir ]
        });
        const places = await Places.findAll({
            include: [ Souvenir ]
        });
        const things = await Things.findAll({
            include: [ Souvenir ]
        });
        const souvenirs = await Souvenir.findAll({
            include: [People, Places, Things]
        });

const html = `
<html>
<head>
    <title>People, Places & Things</title>
</head>
<body>
    <h1>People, Places & Things</h1>
    <ul>
        ${people.map(person => `
            <li>
                ${person.name}
            </li>
            `).join('')}
    </ul>
    <ul>
    ${places.map(place => `
        <li>
            ${place.name}
        </li>
        `).join('')}
    </ul>
    <ul>
    ${things.map(thing => `
    <li>
        ${thing.name}
    </li>
    `).join('')}
    </ul>
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
    <select name='souvenir'>
      ${
        souvenirs.map( souvenir => {
          return `
            <option value=${souvenir.id}>
              ${ souvenir.souvenir }
            </option>
          `;
        }).join('')
      }
    </select>
    <button>Create</button>
  </form>
    <ul>
    ${souvenirs.map(souvenir => `
        <li>
            ${souvenir.person.name} purchased a ${souvenir.souvenir} in ${souvenir.place.name}
        </li>
        `).join('')}
</ul>
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
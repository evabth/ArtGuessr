const express = require("express");
const cors = require('cors');
const app = express()

const port = 3000;


const corsOptions = {
  origin: ['https://yourdomain.com', 'http://localhost:3000','http://localhost:5173'], // Whitelisted domains
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/random", async (req,res)=>{


  const randomPage = Math.floor(Math.random() * 10) + 1; //41

  const response = await fetch('https://api.artic.edu/api/v1/artworks/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: ['id', 'title', 'date_start', 'image_id', 'artwork_type_title'],
      limit: 100,
      page: randomPage,
      query: { match: { artwork_type_title: 'Painting' } }
    })
  });

  const page_json = await response.json()

  let image_id, id 

  

  if (Array.isArray(page_json.data)){

    const rand_index = Math.floor(Math.random() * page_json.data.length ) 

    console.log(rand_index)
    console.log(page_json.data[rand_index])

    image_id = page_json.data[rand_index].image_id
    id = page_json.data[rand_index].id
  }else{
    image_id = page_json.data.image_id
    id = page_json.data.id
  }

  data = {imageURL:`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`, id: id }

  res.json(data)

})

app.post("/guess", async (req,res)=>{

  console.log(req.body)

  const guess = req.body.guess
  const artID = req.body.artID

  art_res = await fetch(`https://api.artic.edu/api/v1/artworks/${artID}`)
  art_json = await art_res.json()

  

  console.log(art_json.data.date_end)

  console.log(`Difference: ${guess - art_json.data.date_end}`)

  const distance = Math.abs(guess - art_json.data.date_end)
  let score = Math.floor(1000*(1.02)**(-distance))

  console.log(`Score: ${score}`)
  console.log(1000*(1.02)**(-distance))

  const data = {
    distance: distance,
    score: score,
    correct: art_json.data.date_end,
    artist_title: art_json.data.artist_title,
    description: art_json.data.description
     
  }

  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
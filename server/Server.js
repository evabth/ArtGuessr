const express = require("express");

const app = express()

const port = 3000;

app.get("/random", async (req,res)=>{


  const randomPage = Math.floor(Math.random() * 1320) + 1;
  const page = await fetch(
    `https://api.artic.edu/api/v1/artworks?fields=id,title,date_start,image_id&limit=100&page=${randomPage}&has_images=1&query[exists][field]=image_id`
  );

  const page_json = await page.json()

  const rand_index = Math.floor(Math.random() * page_json.data.length ) 

  console.log(rand_index)
  console.log(page_json.data[rand_index])

  const image_id = page_json.data[rand_index].image_id

  art_image_res = await fetch(`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`)


  res.json(`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
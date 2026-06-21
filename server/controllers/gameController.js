const asyncHandler = require("express-async-handler")
const GameState = require("../models/gameStateModel")

//@desc Get a Random Image
//@route GET /game/random
//@access public
const random = asyncHandler( async (req,res)=> {

  const randomPage = Math.floor(Math.random() * 10) + 1; //41

  const gameId = req.body.gameId

  const response = await fetch('https://api.artic.edu/api/v1/artworks/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: ['id', 'title', 'date_end', 'image_id', 'artwork_type_title'],
      limit: 100,
      page: randomPage,
      query: { match: { artwork_type_title: 'Painting' } }
    })
  });

  const page_json = await response.json()

  let image_id, id, date_end

  if (Array.isArray(page_json.data)){

    const rand_index = Math.floor(Math.random() * page_json.data.length ) 

    image_id = page_json.data[rand_index].image_id
    id = page_json.data[rand_index].id
    date_end = page_json.data[rand_index].date_end
    
  }else{
    image_id = page_json.data.image_id
    id = page_json.data.id
    date_end = page_json.data.date_end
  }

  let currGameState;
  
  if(!gameId){
    currGameState = await GameState.create({
      score:0,
      round:1,
      currPaintingYear:date_end,
      currArtID: id,

    })
  }else{ // need to check the round of the game given to make sure it is not the same game again
    currGameState = await GameState.findByIdAndUpdate(
      gameId,
      { 
        currPaintingYear:date_end,
        currArtID: id,
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );
  }

  if(!currGameState){
    res.status(500)
    throw new Error("Game initialization failed")
  }

  data = {
    imageURL:`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`, 
    gameId: currGameState.id 
  }

  res.json(data)

})

//@desc Submit a Guess
//@route POST /game/guess
//@access public
const guess = asyncHandler( async (req,res)=>{

  const guess = req.body.guess
  const gameId = req.body.gameId

  const currGameState = await GameState.findById(gameId)

  if (!currGameState){
    res.status(404)
    throw new Error("Game not found")
  }

  if (!currGameState.currArtID){
    res.status(404)
    throw new Error("No current Art Work")
  }

  if (currGameState.round > 10){
    res.status(403)
    throw new Error("Forbidden: Game is Over!")
  }

  art_res = await fetch(`https://api.artic.edu/api/v1/artworks/${currGameState.currArtID}`)
  art_json = await art_res.json()

  const distance = Math.abs(guess - art_json.data.date_end)
  let score = Math.floor(1000*(1.02)**(-distance))

  const updatedGameState = await GameState.findByIdAndUpdate(
    gameId,
    {
      round: currGameState.round + 1,
      score: currGameState.score + score,
      currArtID: "",
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  )

  if(!updatedGameState){
    res.status(500)
    throw new Error("Guess failed to save")
  }

  const data = {
    distance: distance,
    score: score,
    totalScore: updatedGameState.score,
    correct: updatedGameState.currPaintingYear,
    artist_title: art_json.data.artist_title,
    description: art_json.data.description
     
  }

  res.json(data)
});


module.exports= {random , guess}
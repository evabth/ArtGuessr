const asyncHandler = require("express-async-handler")
const GameState = require("../models/gameStateModel")
const { getPaintingIDs } = require('../config/metCache.js');
const userModel = require("../models/userModel.js");

//@desc Get a Random Image
//@route GET /game/random
//@access public
const random = asyncHandler( async (req,res)=> {

  const gameId = req.body.gameId

  const paintingIDs = getPaintingIDs();
  let objectID

  do {
    const rand_index = Math.floor(Math.random() * paintingIDs.length);
    objectID = paintingIDs[rand_index];

    const objectResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    );
    objectResponseJSON = await objectResponse.json();

    console.log(objectID, objectResponseJSON.primaryImageSmall);

  } while (!objectResponseJSON.primaryImageSmall);

  let currGameState;
  
  if(!gameId){
    currGameState = await GameState.create({
      score:0,
      round:1,
      currPaintingYear:objectResponseJSON.objectEndDate,
      currArtID: objectID,

    })
  }else{ // need to check the round of the game given to make sure it is not the same game again
    currGameState = await GameState.findByIdAndUpdate(
      gameId,
      { 
        currPaintingYear:objectResponseJSON.objectEndDate,
        currArtID: objectID,
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );
  }
  console.log(objectResponseJSON.primaryImage)

  if(!currGameState){
    res.status(500)
    throw new Error("Game initialization failed")
  }

  const data = {
    imageURL:objectResponseJSON.primaryImage, 
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

  const objectResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${currGameState.currArtID}`
  );

  const objectResponseJSON = await objectResponse.json()

  const distance = Math.abs(guess - currGameState.currPaintingYear)
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
  if (currGameState.round == 10){
    const currUser = await userModel.findById(req.user.id)
    if(currGameState.score + score > currUser.topScore){
      const updateUser= await userModel.findByIdAndUpdate(
        req.user.id,
        {
          topScore: currGameState.score + score
        },
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
    }
  }

  if(!updatedGameState){
    res.status(500)
    throw new Error("Guess failed to save")
  }

  const data = {
    distance: distance,
    score: score,
    totalScore: updatedGameState.score,
    correct: updatedGameState.currPaintingYear,
    artist_title: objectResponseJSON.artistDisplayName,
    work_title:objectResponseJSON.title,
    description: null
     
  }

  res.json(data)
});


module.exports= {random , guess}
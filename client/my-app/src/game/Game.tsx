import React, { useState, useEffect } from 'react';
import { motion , AnimatePresence } from "motion/react"
import '../App.css'


const server_URL = "http://localhost:3000"

function Game() {
  interface Result {
    score: number;
    correct: number;
    artist_title: string;
    description?: string;
    imageURL?: string;
  }
  
  const [totalScore, setTotalScore] = useState(0)
  const [round, setRound] = useState(1)
  const [artID, setArtID] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currYear, setCurrYear] = useState(1)
  const [currYearFormatted, setCurrYearFormatted] = useState("1701")
  const [hasGuessed, setHasGuessed] = useState(false)
  const [century, setCentury] = useState(18)
  const [result, setResult] = useState<Result | null>(null)
  const [bestGuess, setBestGuess] = useState<Result | null>(null)
  const [worstGuess, setWorstGuess] = useState<Result | null>(null)


  async function fetchImage() {

    const data = await fetch(server_URL + "/random")

    const dataJSON = await data.json()
    
    setImageURL(dataJSON.imageURL)
    setArtID(dataJSON.id)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    const year = Number(e.target.value)
    setCurrYear(year)

    setCurrYearFormatted(formatYear(((century-1)*100)+year))
  }


  async function handleGuess(e:React.MouseEvent<HTMLButtonElement>){    
    const button = e.currentTarget

    button.disabled = true

    const guess_response = await fetch(server_URL + "/guess", {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
        artID: artID,
        guess: ((century-1)*100)+currYear,
      })

      

    })

    if (guess_response.status != 200){
      button.disabled = false
      console.log("guess failed")
      return
    }

    const guess_json = await guess_response.json()
    console.log("guess results")
    console.log(guess_json)

    setResult(guess_json)
    setTotalScore(totalScore + guess_json.score)

    if(!bestGuess || bestGuess.score < guess_json.score){
      setBestGuess({...guess_json, imageURL:imageURL})
    }
    if(!worstGuess || worstGuess.score > guess_json.score){
      setWorstGuess({...guess_json, imageURL:imageURL})
    }

    setHasGuessed(true)

  }

  function formatYear (year:number){

    if (year >= 1){
      return `${year}`

    }else{
      return `${-1*(year)} BC`
    }

  }

  function formatCentury(century:number){

    if (century % 100 >= 11 && century % 100 <= 13) return `${century}th`;
    
    const r = century % 10;
    return r === 1 ? `${century}st` : r === 2 ? `${century}nd` : r === 3 ? `${century}rd` : `${century}th`;
  }

  function centLabel(c:number) {
    if (c > 1) {
      const start = (c-1) * 100;
      return `${start}–${start + 99}`;
    }
    if (c === 1) return "1–99";
    const start = c * 100;
    return `${Math.abs(start - 99)}–${Math.abs(start)} BC`;
  }

  function nextPainting(){

    setHasGuessed(false)
    //if (round == 10){
      setImageURL("")
    //}
    setRound(round+1)
    console.log(round)
    if(round != 10){
      fetchImage()
    }

    
  }

  function handleCentury(change:number){

    const newCentury = century + change;
    

    if(newCentury<22 && newCentury> -13){
      setCentury(newCentury)
      setCurrYearFormatted(formatYear(((newCentury-1)*100)+currYear))
    }

  }

  function handlePlayAgain(){
    setImageURL("")
    setRound(1)
    setTotalScore(0)
    fetchImage()

  }

  useEffect(()=>{

    fetchImage();

    console.log("game page")

  },[])

  useEffect(()=>{
    setImgLoaded(false)
  },[imageURL])


  return (
    <>
      <h1>Art Guessr</h1>
      {round != 11 &&
        <>
          <h3>Round: {round}</h3>
          <p><strong>Total Score:</strong> {totalScore}</p>
          <section className='game-layout'>
            <motion.div className="image-column">
              <AnimatePresence mode='wait'>
              { imageURL ? (
                
                  <motion.div
                    key={imageURL}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: imgLoaded ? 1 : 0 }} 
                    exit={{ opacity: 0 }}
                  >
                  
                    <img 
                      src={imageURL} 
                      onLoad={() => setImgLoaded(true)}
                    />
                  
                  </motion.div>
                ):(
                  <motion.div
                    key={imageURL}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: .5}} 
                    exit={{ opacity: 0 }}
                  >
                    <motion.img 
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      src='/vitruvian_man_transparent_white.png'
                    />
                  </motion.div>
                )
                
              }
              </AnimatePresence>
            </motion.div>
            <motion.div className="guess-column">
              <AnimatePresence mode="wait">
              {!hasGuessed ? (
                <motion.div layout>
                  <p>Year Selected</p>
                  <h1>{currYearFormatted}</h1>
                  <p>Century</p>
                  <div className='century-selector'>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>{handleCentury(-1)}}
                    >
                      <motion.img className="arrow-left" src='/next (1).png'/>
                    </motion.button>
                    <div className='centuries-display-container'>
                      <div className='centuries-display'>
                        <h3>{formatCentury(century-1)}</h3>
                        <h2>{formatCentury(century)}</h2>
                        <h3>{formatCentury(century+1)}</h3>
                      </div>

                      <p>{centLabel(century)}</p>

                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>{handleCentury(1)}}
                    >
                      <motion.img src='/next (1).png'/>
                    </motion.button>

                  </div>
                  <input type='range' value={currYear} onChange={handleChange} min={0} max={99} />
                  <div id='year-selector-guide'>
                    <span>00</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>99</span>
                  </div>
                  <br/>
                  <motion.button whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGuess}
                    disabled={!imageURL}>
                      <h3>Guess</h3>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div layout >
                  { result ? <>
                    <h2>Your Guess: {currYearFormatted}</h2>
                    <h2>Score: {result.score}</h2>
                    <h2>Correct Answer: {formatYear(result.correct)}</h2>
                    <h2>Artist: {result.artist_title}</h2>
                    {result.description && (
                      <>
                        <h2>Description:</h2>
                        <div dangerouslySetInnerHTML={{ __html: result.description }} />
                      </>
                    )}
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextPainting}>
                        Next Painting
                    </motion.button>
                  </> : <></>}
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          </section>
        </>
      }
      <AnimatePresence mode="wait">
        {!imageURL && round == 11 &&
          <motion.section
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
          >
            <h2>Results:</h2>
            <h2>Total Score: {totalScore} / 10000</h2>
            <br/>
            <button onClick={handlePlayAgain}>Play Again</button>
            <div className='game-layout'>
              <div className='results-column'>
                
                
                  <p>Your Best Guess:</p>
                  {bestGuess ?(
                    <div>
                      <img src={bestGuess.imageURL} /> 
                      <p><strong>Score: </strong>{bestGuess.score}</p>
                      <p><strong>Artist: </strong>{bestGuess.artist_title}</p>
                      <p><strong>Made in: </strong>{bestGuess.correct}</p>
                    </div>
                  ):( 
                    <p>None</p> 
                  )}
              </div>
              <div className='results-column'>
                <p>Your Worst Guess:</p>
                {worstGuess ?(
                  <>
                    <img src={worstGuess.imageURL} /> 
                    <p><strong>Score: </strong>{worstGuess.score}</p>
                    <p><strong>Artist: </strong>{worstGuess.artist_title}</p>
                    <p><strong>Made in: </strong>{worstGuess.correct}</p>
                  </>
                ):( 
                  <p>None</p> 
                )}
                
              </div>
            </div>
            
          </motion.section>
        }
      </AnimatePresence>
    </>
  )
}

export default Game

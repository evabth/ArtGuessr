import React, { useState, useEffect } from 'react';
import { motion , AnimatePresence } from "motion/react"
import {API_ENDPOINTS} from "../api/endpoints"
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../App.css'
import Header from '../components/Header';

function Game() {
  interface Result {
    score: number;
    correct: number;
    totalScore:number;
    work_title:string;
    artist_title: string;
    imageURL?: string; 
  }

  const axiosPrivate = useAxiosPrivate();
  
  const [totalScore, setTotalScore] = useState(0)
  const [round, setRound] = useState(1)
  const [imageURL, setImageURL] = useState("")
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currYear, setCurrYear] = useState(1)
  const [currYearFormatted, setCurrYearFormatted] = useState("1701")
  const [hasGuessed, setHasGuessed] = useState(false)
  const [century, setCentury] = useState(18)
  const [direction, setDirection] = useState(0);
  const [result, setResult] = useState<Result | null>(null)
  const [bestGuess, setBestGuess] = useState<Result | null>(null)
  const [worstGuess, setWorstGuess] = useState<Result | null>(null)
  const [gameId, setGameId] = useState("")


  async function fetchImage(gameId:String) {

    try{

      const imageReq = await axiosPrivate.post(API_ENDPOINTS.game.nextArtwork,{
        gameId
      })
      setImageURL(imageReq.data.imageURL)
      setGameId(imageReq.data.gameId)
    }catch(err){

      console.log(err)

    }
    
    
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    const year = Number(e.target.value)
    setCurrYear(year)

    setCurrYearFormatted(formatYear(((century-1)*100)+year))
  }


  async function handleGuess(e:React.MouseEvent<HTMLButtonElement>){    
    const button = e.currentTarget

    button.disabled = true

    const guess_response = await axiosPrivate.post(API_ENDPOINTS.game.guess,{
      guess: ((century-1)*100)+currYear,
      gameId
    })

    if (guess_response.status != 200){
      button.disabled = false
      console.log("guess failed")
      return
    }
    console.log("guess results")
    console.log(guess_response)

    setResult(guess_response.data)
    setTotalScore(guess_response.data.totalScore)

    if(!bestGuess || bestGuess.score < guess_response.data.score){
      setBestGuess({...guess_response.data, imageURL:imageURL})
    }
    if(!worstGuess || worstGuess.score > guess_response.data.score){
      setWorstGuess({...guess_response.data, imageURL:imageURL})
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
      fetchImage(gameId)
    }
    
  }

  function handleCentury(change:number){

    const newCentury = century + change;
    setDirection(change);
    

    if(newCentury<22 && newCentury> 12){
      setCentury(newCentury)
      setCurrYearFormatted(formatYear(((newCentury-1)*100)+currYear))
    }

  }
  
  const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : 100,
    opacity: 0,
  }),
};

  function handlePlayAgain(){
    setImageURL("")
    setBestGuess(null)
    setWorstGuess(null)
    setRound(1)
    setTotalScore(0)
    fetchImage("")

  }

  useEffect(()=>{

    fetchImage("");

    console.log("game page")

  },[])

  useEffect(()=>{
    setImgLoaded(false)
  },[imageURL])


  return (
    <>
      <Header/>
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
                      <motion.img className="arrow-left" src='/next (1).png' alt='<'/>
                    </motion.button>
                    <div className='centuries-display-container'>
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div 
                          key={century}               
                          className='centuries-display'
                          custom={direction} 
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.17, ease: 'easeInOut' }}

                        >
                          <h2>{formatCentury(century)}</h2>
                          <p>{centLabel(century)}</p>
                        </motion.div>
                      </AnimatePresence>
                      

                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>{handleCentury(1)}}
                    >
                      <motion.img src='/next (1).png' alt='>'/>
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
                    Guess
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div layout >
                  { result ? <>
                    <h2>Your Guess: {currYearFormatted}</h2>
                    <h2>Score: {result.score}</h2>
                    <h2>Correct Answer: {formatYear(result.correct)}</h2>
                    <h2>Painting: {result.work_title}</h2>
                    <h2>Artist: {result.artist_title}</h2>
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

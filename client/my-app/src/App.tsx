import React, { useState } from 'react';
import './App.css'


const server_URL = "http://localhost:3000"

function App() {
  interface Result {
    score: number;
    correct: number;
    artist_title: string;
    description?: string;
  }
  
  const [artID, setArtID] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [currYear, setCurrYear] = useState(1)
  const [currYearFormatted, setCurrYearFormatted] = useState("1701")
  const [hasGuessed, setHasGuessed] = useState(false)
  const [century, setCentury] = useState(18)
  const [result, setResult] = useState<Result | null>(null);


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


  async function handleGuess(){    

    const guess_response = await fetch(server_URL + "/guess", {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
        artID: artID,
        guess: ((century-1)*100)+currYear,
      })

      

    })

    const guess_json = await guess_response.json()
    console.log("guess results")
    console.log(guess_json)

    setResult(guess_json)

    setHasGuessed(true)

  }


  function formatYear (year:number){

    if (year >= 1){
      return `${year}`

    }else{
      return `${-1*(year)} BC`
    }

  }

  function nextPainting(){

    setHasGuessed(false)
    fetchImage()

  }

  function handleCentury(change:number){

    const newCentury = century + change;
    

    if(newCentury<22 && newCentury> -13){
      setCentury(newCentury)
      setCurrYearFormatted(formatYear(((newCentury-1)*100)+currYear))
    }

    

  }


  return (
    <>
      <h1>Art Guessr</h1>
      {!imageURL &&
        <div>
          <button onClick={fetchImage}>Play!</button>
        </div>
      }
      {imageURL &&
        <section className='game-layout'>
          <div className="image-column">
            <img src={imageURL} />
          </div>

          <div className="guess-column">
            {!hasGuessed ? (
              <>
                <h2>Century</h2>
                <div id='century-selector'>
                  <button onClick={()=>{handleCentury(-1)}}><strong>{"<"}</strong></button>
                  <h2>{century}</h2>
                  <button onClick={()=>{handleCentury(1)}}>{">"}</button>

                </div>
                <input type='range' value={currYear} onChange={handleChange} min={0} max={99} />
                <h2>Current Year Selected: {currYearFormatted}</h2>
                <button onClick={handleGuess}>Guess</button>
              </>
            ) : (
              <>
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
                  <button onClick={nextPainting}>Next Painting</button>
                </> : <></>}
              </>
            )}
          </div>
        </section>
      }
    </>
  )
}




export default App

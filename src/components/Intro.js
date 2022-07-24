import React from 'react'

function Intro({ startQuiz }) {
  return (
    <div className='intro-page'>
        <h3>Quizzical</h3>
        <p>5 random questions with multiple choices.</p>
        <button onClick={startQuiz}>Start quiz</button>
    </div>
  )
}

export default Intro
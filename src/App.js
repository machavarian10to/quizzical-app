import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import Intro from './components/Intro';
import Question from './components/Question'

import white_blob from './images/white-blob.png'
import blue_blob from './images/blue-blob.png'

import Confetti from 'react-confetti';
import ReactLoading from 'react-loading';

import './App.css';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [checkingAnswers, setCheckingAnswers] = useState(false);
  
  const [options, setOptions] = useState([])

  const [score, setScore] = useState(0);

  useEffect(() => {
    if(quizStarted) {
      fetch('https://opentdb.com/api.php?amount=5')
      .then(res => res.json())
      .then(data => { 
        let options = [];
        data.results.map(res => {
          const question = res.question;
          const correctAnswer = res.correct_answer.replaceAll("&quot;" , '"').replaceAll("&#039;", "'").replaceAll("&amp;", "&");
          let answers = [{answer: correctAnswer, selected: false, answerId: nanoid()}];
          res.incorrect_answers.forEach(incorrectAnswer => {
            answers.push({answer: incorrectAnswer.replaceAll("&quot;" , '"').replaceAll("&#039;", "'").replaceAll("&amp;", "&").replaceAll("&Prime;", "″"), selected: false, answerId: nanoid()});
          });
          shuffleArray(answers)
          options.push({question: question, correctAnswer: correctAnswer, answers: answers})
        })
        setOptions(options);
        setIsLoading(false);

        // Life hack :)
        console.log('Correct answers: ' + options.map((option, i) => (i + 1 + ')') + option.correctAnswer));
      })
    }
  }, [quizStarted])

  function startQuiz() {
    setIsLoading(true);
    setQuizStarted(true);
  }

  const questionElems = options.map(option => {
    return (
      <Question
        key={nanoid()}
        question={option.question.replaceAll("&quot;" , '"').replaceAll("&#039;", "'").replaceAll("&amp;", "&")}
        answers={option.answers}
        correctAnswer={option.correctAnswer}
        handleSelect={e => handleSelect(option.answers, e)}
        checkingAnswers={checkingAnswers}
      />
    )
  })

  function handleSelect(answers, e){
    answers.forEach(option => {
      if(e.target.textContent === option.answer){
        e.target.style.backgroundColor = "#D6DBF5"
        e.target.style.border = "none"
        option.selected = true
      }
      else{
        option.selected = false
      }
    })
    for(let i = 0; i < 4; i++){
      if(e.target.parentElement.children[i].textContent !== e.target.textContent){
        e.target.parentElement.children[i].style.backgroundColor = "transparent"
        e.target.parentElement.children[i].style.border = "1px solid #4D5B9E"
      }
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function checkAnswers() {
    setCheckingAnswers(true);
    options.forEach(option => {
      let correct = option.correctAnswer
      option.answers.map(answer => {
        if(answer.selected && answer.answer === correct){
          setScore(prevScore => prevScore + 1);
        }
      })
    })
  }

  function playAgain() {
    setQuizStarted(false);
    setCheckingAnswers(false);
    setScore(0);
  }

  return (
    <div className="quizzical-container">
      <img src={white_blob} alt='white-blob' className='white-blob'/>

      {!quizStarted
       ? <Intro startQuiz={startQuiz} /> 
       : <div className='questions-container'>
            {isLoading 
            ? <div className='loader'>
                <ReactLoading 
                  type='spinningBubbles'
                  color='#4D5B9E'
                  width={120}
                  height={120}
                />
              </div>
            : questionElems
            }

            {!checkingAnswers 
              ? <div className='check-answers-btn'>
                  {!isLoading && <button onClick={() => checkAnswers()}>Check answers</button>}
                </div> 
              : <div className='results'>
                  {score === 5 && <Confetti width={1000} height={550} />}
                  <p>You scored {score}/5 correct answers</p>
                  <button onClick={() => playAgain()} >Play Again</button>
                </div>
            }
          </div>
      }
      
      <img src={blue_blob} alt='blue-blob' className='blue-blob'/>
    </div>
  );
}

export default App;

import React from 'react';

export default function Questions({ 
    question, answers, correctAnswer,
    handleSelect, checkingAnswers 
}) {
    return (
        <div className='question-wrapper'>
            <h3>{question}</h3>
            <div className='answer-btns'>
                {answers.map(option => {
                    return(
                        <button 
                            key={option.answerId}
                            onClick = {handleSelect} 
                            disabled={checkingAnswers ? true : false}
                            style = { 
                                checkingAnswers ? option.answer === correctAnswer
                                ? { backgroundColor : "#94D7A2", border : "none" }
                                : option.selected ? { backgroundColor : "#F8BCBC", border:"none" } 
                                : { opacity: '0.5'} : {}
                            }
                        >
                            {option.answer}
                        </button>
                    )
                })}
            </div>
            <div className='line'></div>
        </div>
    )
}
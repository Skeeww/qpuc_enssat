import React, { useEffect, useState } from 'react';
import { cloneDeep, shuffle } from 'lodash';
import './App.css';
import questions from './questions1.json';

enum QuestionType {
    DUO,
    CARRE,
    CASH
}

const App: React.FC = () => {
    const [questionType, setQuestionType] = useState<QuestionType | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<typeof questions[0] | null>(null);
    const [optionPool, setOptionPool] = useState<string[]>([]);

    const [cashValue, setCashValue] = useState<string>("");

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    // Hook called on current question index changed
    useEffect(() => {
        // Set quiz to finish
        if (currentQuestionIndex === questions.length) {
            setQuizFinished(true);
            return;
        } else {
            // Reset state of user interface and update question
            // if (currentQuestionIndex <= questions.length 1) {
            setIsSubmitted(false);
            setSelectedOption(null);
            setIsCorrectAnswer(null);
            setQuestionType(null);
            setOptionPool([]);
            setCashValue("");
            setCurrentQuestion(questions[currentQuestionIndex]);
            return;
        }
    }, [currentQuestionIndex]);

    // Hook called on question type changed
    useEffect(() => {
        if (!currentQuestion) return;
        const options = cloneDeep(currentQuestion.options);
        const correctAnswer = options.splice(currentQuestion.correctAnswer, 1)[0];
        const answers = shuffle(options);

        console.log("Correct answser: ", correctAnswer);
        console.log("Options: ", options);
        console.log("Answers: ", answers);

        switch (questionType) {
            case QuestionType.DUO:
                setOptionPool(
                    shuffle(
                        [answers[0], correctAnswer]
                    )
                );
                break;
            case QuestionType.CARRE:
                setOptionPool(
                    shuffle(
                        [...answers, correctAnswer]
                    )
                );
                break;
        }
    }, [currentQuestion, questionType]);

    const handleSelectOption = (index: number) => {
        // Empêcher la sélection d'une nouvelle option une fois la réponse soumise
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        // No option selected, do nothing
        if (selectedOption === null && cashValue.length === 0) return;

        // If we already have an answer submitted we go to the next question
        if (isSubmitted) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            return;
        }

        let isCorrect = false;
        // If we choose DUO or CARRE
        if (questionType === QuestionType.DUO || questionType === QuestionType.CARRE) {
            // If we have not submitted our answer we show the response and handle the score
            isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
        } else if (questionType === QuestionType.CASH) {
            isCorrect = questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswer].trim().toLocaleLowerCase() === cashValue.trim()
        }
        if (isCorrect) {
            setScore(score + 1);
        }
        setIsCorrectAnswer(isCorrect);
        setIsSubmitted(true);
    };

    const renderResultMessage = () => {
        const percentage = (score / questions.length) * 100;
        let message = "";

        if (percentage < 25) {
            message = "Nullos";
        } else if (percentage >= 25 && percentage <= 75) {
            message = "Ouais pas mal";
        } else if (percentage > 75) {
            message = "French Monster";
        }

        return (
            <div className="result-message">
                <p className="score">Ton score : {score} / {questions.length}</p>
                <p className="message">{message}</p>
            </div>
        );
    };

    let classname = '';

    if (!quizFinished && isCorrectAnswer === true) {
        classname = 'correct';
    } else if (!quizFinished && isCorrectAnswer === false) {
        classname = 'incorrect';
    }


    return (
        <div
            className={`app ${classname}`}>
            <div className="container">
                {quizFinished ? (
                    renderResultMessage()
                ) : (questionType !== null ? (<>
                    <div className="question-container">
                        <div className="question">{currentQuestion?.question}</div>
                        <div className="options">
                            {optionPool.length ? optionPool?.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectOption(index)}
                                    disabled={isSubmitted}
                                    className={`${selectedOption === index ? 'selected' : ''} ${!isSubmitted ? '' : index === currentQuestion?.correctAnswer ? 'correct-answer' : 'incorrect-answer'}`}
                                >
                                    {option}
                                </button>
                            )) : <>
                                {isSubmitted ? <>
                                    <input type='text' disabled value={currentQuestion?.options[currentQuestion?.correctAnswer]}></input>
                                </> : <>
                                    <input type='text' value={cashValue} onChange={(e) => setCashValue(e.target.value)}></input>
                                </>}
                            </>}
                        </div>
                    </div>
                    <div className="submit-button-container">
                        <button onClick={handleSubmit}>
                            {isSubmitted ? 'Question suivante' : 'Valider'}
                        </button>
                    </div>
                </>) : (<>
                    <div className='options'>
                        <button onClick={() => setQuestionType(QuestionType.DUO)}>Duo</button>
                        <button onClick={() => setQuestionType(QuestionType.CARRE)}>Carré</button>
                        <button onClick={() => setQuestionType(QuestionType.CASH)}>Cash</button>
                    </div>
                </>))}
            </div>
        </div>
    );
};

export default App;

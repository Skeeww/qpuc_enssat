import React, { useEffect, useState } from 'react';
import './App.css';
import questions from './questions.json';

const App: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<typeof questions[0] | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    // Hook called on current question index changed
    useEffect(() => {
        // Set quiz to finish
        if (currentQuestionIndex === questions.length - 1) {
            setQuizFinished(true);
            return;
        }
        // Reset state of user interface and update question
        if (currentQuestionIndex < questions.length - 1) {
            setIsSubmitted(false);
            setSelectedOption(null);
            setIsCorrectAnswer(null);
            setCurrentQuestion(questions[currentQuestionIndex]);
            return;
        }
    }, [currentQuestionIndex]);

    const handleSelectOption = (index: number) => {
        // Empêcher la sélection d'une nouvelle option une fois la réponse soumise
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null || isSubmitted) return;
        const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
        if (isCorrect) {
            setScore(score + 1);
        }
        setIsCorrectAnswer(isCorrect);
        setIsSubmitted(true);
    };

    const goToNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
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

    return (
        <div
            className={`app ${isCorrectAnswer === true ? 'correct' : isSubmitted && !isCorrectAnswer ? 'incorrect' : ''}`}>
            <div className="container">
                {quizFinished ? (
                    renderResultMessage()
                ) : (<>
                    <div className="question">{currentQuestion?.question}</div>
                    <div className="options">
                        {currentQuestion?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectOption(index)}
                                disabled={isSubmitted}
                                className={`${selectedOption === index ? 'selected' : ''} ${!isSubmitted ? '' : index === currentQuestion.correctAnswer ? 'correct-answer' : 'incorrect-answer'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <button onClick={isSubmitted ? goToNextQuestion : handleSubmit}>
                        {isSubmitted ? 'Question suivante' : 'Valider'}
                    </button>
                </>)}
            </div>
        </div>
    );
};

export default App;

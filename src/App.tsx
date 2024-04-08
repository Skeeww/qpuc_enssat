import React, { useState } from 'react';
import './App.css';

type Question = {
    question: string;
    options: string[];
    correctAnswer: number;
};

const questions: Question[] = [
    {
        question: 'Quelle est la capitale de la France ?',
        options: ['Paris', 'Berlin', 'Madrid', 'Londres'],
        correctAnswer: 0,
    },
    {
        question: 'Lequel de ces animaux est un mammifère ?',
        options: ['Requin', 'Baleine'],
        correctAnswer: 1,
    },
    // Ajoutez d'autres questions ici
];

const App: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

    const handleSelectOption = (index: number) => {
        // Empêcher la sélection d'une nouvelle option une fois la réponse soumise
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null || isSubmitted) return; // Ne rien faire si aucune option n'est sélectionnée ou si la question a déjà été soumise
        const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
        setIsCorrectAnswer(isCorrect);
        setIsSubmitted(true);
    };

    const goToNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
        setIsSubmitted(false);
        setSelectedOption(null);
        setIsCorrectAnswer(null);
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className={`app ${isCorrectAnswer === true ? 'correct' : isSubmitted && !isCorrectAnswer ? 'incorrect' : ''}`}>
            <div className="container">
                <div className="question">{currentQuestion.question}</div>
                <div className="options">
                    {currentQuestion.options.map((option, index) => (
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
            </div>
        </div>
    );
};

export default App;

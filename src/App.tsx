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
];

const App: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

    const handleSelectOption = (index: number) => {
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return; // Ne fait rien si aucune option n'est sélectionnée
        if (!isSubmitted) { // Si la réponse n'a pas encore été validée
            const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
            setIsCorrectAnswer(isCorrect);
            setIsSubmitted(true);
        } else { // Passer à la question suivante
            setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
            setIsSubmitted(false);
            setSelectedOption(null);
            setIsCorrectAnswer(null);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const optionsGrid = currentQuestion.options.length === 4 ? 'options-grid' : 'options-line';

    return (
        <div className={`app ${isCorrectAnswer === true ? 'correct' : isSubmitted && !isCorrectAnswer ? 'incorrect' : ''}`}>
            <div className="container">
                <div className="question">{currentQuestion.question}</div>
                <div className={`options ${optionsGrid}`}>
                    {currentQuestion.options.map((option, index) => (
                        <button key={index} onClick={() => handleSelectOption(index)} className={selectedOption === index ? 'selected' : ''}>
                            {option}
                        </button>
                    ))}
                </div>
                <button onClick={handleSubmit} disabled={selectedOption === null && !isSubmitted}>
                    {isSubmitted ? 'Question suivante' : 'Valider'}
                </button>
            </div>
        </div>
    );
};

export default App;

import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import katex from 'katex';

const LatexQuestion = ({ correctAudio, incorrectAudio, isMuted }) => {
  const correctAnswer = '\\pi r^2';
  const maxAttempts = 3;
  const localStorageKey = 'latexQuestionState';

  const [state, setState] = useState(() => {
    const storedState = JSON.parse(localStorage.getItem(localStorageKey)) || {
      latexAnswer: '',
      isAnswerCorrect: null,
      attempts: 0,
      isInputDisabled: false,
    };
    return storedState;
  });

  const { latexAnswer, isAnswerCorrect, attempts, isInputDisabled } = state;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state]);

  const handleInputChange = (event) => {
    setState({ ...state, latexAnswer: event.target.value });
  };

  const handleCheckAnswer = () => {
    if (attempts >= maxAttempts || isInputDisabled) {
      return;
    }

    try {
      const userMathML = katex.renderToString(latexAnswer, { throwOnError: false, output: 'mathml' });
      const correctMathML = katex.renderToString(correctAnswer, { output: 'mathml' });

      const correct = userMathML === correctMathML;
      const audio = new Audio(correct ? correctAudio : incorrectAudio);

      if (!isMuted) {
        audio.play();
      }

      setState({
        ...state,
        isAnswerCorrect: correct,
        attempts: attempts + 1,
        isInputDisabled: attempts + 1 >= maxAttempts,
      });
    } catch (error) {
      console.error('Error rendering MathML:', error);
      setState({ ...state, isAnswerCorrect: null });
    }
  };

  const handleReset = () => {
    setState({
      latexAnswer: '',
      isAnswerCorrect: null,
      attempts: 0,
      isInputDisabled: false,
    });
    localStorage.removeItem(localStorageKey);
  };

  const remainingAttempts = maxAttempts - attempts;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4">
      <p className='font-bold text text-gray-700'>Write the formula for the area of a circle:</p>
      <label htmlFor="latexAnswer">Your answer should be in (in LaTeX) format:</label>
      <p className='text text-blue-700'>Try this latex: \pi r^2</p>
      <input
        type="text"
        id="latexAnswer"
        value={latexAnswer}
        onChange={handleInputChange}
        disabled={isInputDisabled}
        placeholder='write your answer e.g; \pi r^2'
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      />
      <button
        onClick={handleCheckAnswer}
        className="mt-2 bg-blue-500 text-white rounded-md p-2 focus:outline-none hover:bg-blue-600"
      >
        Check Answer
      </button>
      {isAnswerCorrect !== null && (
        <p className={`${isAnswerCorrect===false ? " text-red-700":" text-green-600"} p-2 m-2`}>
          Your answer is {isAnswerCorrect ?<span className='text text-green-700 text-lg underline'>correct!🎉 <InlineMath math={correctAnswer} /> </span>: 'incorrect 😟'}
        </p>
      )}
      {attempts >= maxAttempts && <p className='text text-red-700'>Limit exceeded</p>}
      {remainingAttempts > 0 && <p>Remaining attempts: {remainingAttempts}</p>}
      <button
        onClick={handleReset}
        className="mt-2 bg-red-500 text-white rounded-md p-2 focus:outline-none hover:bg-blue-600"
      >
        Reset
      </button>
    </div>
  );
};

export default LatexQuestion;

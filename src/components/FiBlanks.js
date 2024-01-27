import React, { useState, useEffect } from "react";

const FiBlanks = ({ question ,correctAudio ,incorrectAudio ,isMuted}) => {
  const initialSavedState = {
    textValue: "",
    isAnswerCorrect: null,
    remainingAttempts: 2,
  };

  const savedState = JSON.parse(localStorage.getItem("fiBlanksState")) || initialSavedState;
  const [textValue, setTextValue] = useState(savedState.textValue);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(savedState.isAnswerCorrect);
  const [remainingAttempts, setRemainingAttempts] = useState(savedState.remainingAttempts);

  useEffect(() => {
    const newState = { textValue, isAnswerCorrect, remainingAttempts };
    localStorage.setItem("fiBlanksState", JSON.stringify(newState));
  }, [textValue, isAnswerCorrect, remainingAttempts]);

  const checkAnswer = () => {
    if (remainingAttempts > 0) {
      const userAnswer = parseInt(textValue, 10);
      if (!isNaN(userAnswer) && userAnswer === question.answer) {
        setIsAnswerCorrect(true);
        if (!isMuted) {
          new Audio(correctAudio).play();
        }
      } else {
        setIsAnswerCorrect(false);
        if (!isMuted) {
          new Audio(incorrectAudio).play();
        }
      }
      setRemainingAttempts(remainingAttempts - 1);
    }
  };

  const resetState = () => {
    setTextValue("");
    setIsAnswerCorrect(null);
    setRemainingAttempts(initialSavedState.remainingAttempts);
    localStorage.removeItem("fiBlanksState");
  };

  const isInputDisabled = remainingAttempts === 0;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5">
        <div className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {question.title}
        </div>
        <div>
          <label
            htmlFor="val"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your Answer
          </label>
          <input
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            type="text"
            name="email"
            id="val"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Write your answer"
            required
            disabled={isInputDisabled}
          />
        </div>
        <div className="flex space-x-4 mt-3">
          <button
            onClick={checkAnswer}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            disabled={isInputDisabled}
          >
            Check Answer
          </button>
          <button
            onClick={resetState}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
          >
            Reset
          </button>
        </div>
        {isAnswerCorrect !== null && (
          <div className={`mt-3 text-sm ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isAnswerCorrect ? 'Correct! 🎉' : 'Incorrect! 😟'}
          </div>
        )}
        {!isInputDisabled && (
          <div className="mt-2 text-sm text-gray-600">
            {remainingAttempts > 1
              ? `Remaining attempts: ${remainingAttempts}`
              : 'Last attempt!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiBlanks;

import React, { useState, useEffect } from "react";
const MultipleChoice = ({ question ,correctAudio ,incorrectAudio ,isMuted}) => {
  const initialSavedState = {
    selectedOptions: [],
    isAnswerCorrect: null,
    remainingAttempts: 2,
  };

  const savedState = JSON.parse(localStorage.getItem("multipleChoiceState")) || initialSavedState;
  const [selectedOptions, setSelectedOptions] = useState(savedState.selectedOptions);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(savedState.isAnswerCorrect);
  const [remainingAttempts, setRemainingAttempts] = useState(savedState.remainingAttempts);
  useEffect(() => {
    const newState = { selectedOptions, isAnswerCorrect, remainingAttempts };
    localStorage.setItem("multipleChoiceState", JSON.stringify(newState));
  }, [selectedOptions, isAnswerCorrect, remainingAttempts]);

  const checkAnswer = () => {
    if (remainingAttempts > 0 && selectedOptions.length > 0) {
      const userAnswer = selectedOptions.every(option =>
        question.answers.find(answer => answer.label === option)?.value
      );
      const audio = new Audio(userAnswer ? correctAudio : incorrectAudio);
      if (!isMuted) {
        audio.play();
      }
      setIsAnswerCorrect(userAnswer);
      setRemainingAttempts(remainingAttempts - 1);
    }
  };

  const toggleOption = (option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const resetState = () => {
    setSelectedOptions([]);
    setIsAnswerCorrect(null);
    setRemainingAttempts(initialSavedState.remainingAttempts);
    localStorage.removeItem("multipleChoiceState");
  };

  const isInputDisabled = remainingAttempts === 0;

  return (
    <div className=" w-96 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5">
        <div className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {question.title}
        </div>
        <div>
          {question.answers.map((answer, index) => (
            <div key={index} className="mb-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                <input
                  type="checkbox"
                  value={answer.label}
                  checked={selectedOptions.includes(answer.label)}
                  onChange={() => toggleOption(answer.label)}
                  className="mr-2"
                  disabled={isInputDisabled}
                />
                {answer.label}
              </label>
            </div>
          ))}
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
          {/* <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:border-gray-300"
          >
            {isMuted ? <FaVolumeMute color="red" />: <FaVolumeUp color="blue"/>}
          </button> */}
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

export default MultipleChoice;

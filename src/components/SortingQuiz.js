import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Option from "./Option";

const SortingQuiz = ({ question, correctAudio, incorrectAudio, isMuted }) => {
  const initialOptions = [
    { id: 11, text: "1" },
    { id: 22, text: "3" },
    { id: 33, text: "2" },
    { id: 44, text: "4" },
  ];

  const maxAttempts = 3;

  const [options, setOptions] = useState(initialOptions);
  const [attempts, setAttempts] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  const moveOption = (fromIndex, toIndex) => {
    const updatedOptions = [...options];
    const [movedOption] = updatedOptions.splice(fromIndex, 1);
    updatedOptions.splice(toIndex, 0, movedOption);
    setOptions(updatedOptions);
  };

  const handleDrop = (index, item) => {
    if (attempts < maxAttempts) {
      moveOption(item.index, index);
      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  const isCorrectOrder = () => {
    const correctOrder = options
      .map((option) => option.text)
      .sort((a, b) => a - b)
      .join("");
    return correctOrder === options.map((option) => option.text).join("");
  };

  const handleSubmit = () => {
    if (attempts < maxAttempts) {
      const isAnswerCorrect = isCorrectOrder();
      const audio = new Audio(isAnswerCorrect ? correctAudio : incorrectAudio);
      if (!isMuted) {
        audio.play();
      }
      setIsAnswerCorrect(isAnswerCorrect);
      setAttempts((prevAttempts) => prevAttempts + 1);
      localStorage.setItem("sortingQuizResult", JSON.stringify({ isAnswerCorrect, attempts: attempts + 1 }));
    }
  };

  const handleReset = () => {
    setOptions(initialOptions);
    setAttempts(0);
    setIsAnswerCorrect(null);
    localStorage.removeItem("sortingQuizResult");
  };

  useEffect(() => {
    const storedResult = localStorage.getItem("sortingQuizResult");
    if (storedResult) {
      const { isAnswerCorrect, attempts } = JSON.parse(storedResult);
      setIsAnswerCorrect(isAnswerCorrect);
      setAttempts(attempts);
    }
  }, []);

  return (
    <div className="w-[900px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5">
        <div className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {question.title}
        </div>
        <DndProvider backend={HTML5Backend}>
          <div>
            <p>
              Attempts: {attempts}/{maxAttempts}
            </p>
            {options.map((option, index) => (
              <Option
                key={option.id}
                id={option.id}
                text={option.text}
                index={index}
                onDrop={(item) => handleDrop(index, item)}
                moveOption={moveOption}
                disabled={attempts >= maxAttempts}
              />
            ))}
            <div className="flex space-x-4">
              {attempts < maxAttempts && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
            {isAnswerCorrect !== null && (
              <div
                className={`mt-3 text-sm ${
                  isAnswerCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAnswerCorrect ? "Correct! 🎉" : "Incorrect! 😟"}
              </div>
            )}
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default SortingQuiz;

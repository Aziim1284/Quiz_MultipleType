import React, { useState, useEffect } from "react";
import {
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import {
  SAVEDMULTIPLE_CHOICE,
  FILL_IN_THE_BLANK,
  SAVED_SINGLE_QUIZ,
  SORTING_QUIZ,
  LATEX_QUESTION_CORRECT,
  MATCH_MATRIX_QUESTION,
} from "../utils/constant";
import PopupButton from "./Information";

const parseJSON = (jsonString) => JSON.parse(jsonString);

const QuestionButton = ({
  questionText,
  isAnswerCorrect,
  isProcessing,
  isDataAvailable,
}) => (
  <button className="hover:bg-blue-700 text-white shadow-sm shadow-stone-200 flex py-2 px-4 mx-2 my-2 rounded-lg w-34">
    {questionText}{" "}
    {isProcessing ? (
      <FaSpinner color="green" size={25} />
    ) : isDataAvailable ? (
      isAnswerCorrect === true ? (
        <FaCheck color="green" size={20} />
      ) : (
        <FaTimes color="red" size={20} />
      )
    ) : (
      <FaQuestionCircle color="yellow" size={20} />
    )}
  </button>
);

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

const LeftSidebar = ({ triggerUpdate }) => {
  const [isSidebarOpen, setSidebarOpen] = useLocalStorage("sidebarState", true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPopupVisible, setIspopUpvisible] = useState(false);
  const questions = [
    { text: "Q.1", data: parseJSON(SAVEDMULTIPLE_CHOICE) },
    { text: "Q.2", data: parseJSON(SAVED_SINGLE_QUIZ) },
    { text: "Q.3", data: parseJSON(FILL_IN_THE_BLANK) },
    { text: "Q.4", data: parseJSON(SORTING_QUIZ) },
    { text: "Q.5", data: parseJSON(MATCH_MATRIX_QUESTION) },
    { text: "Q.6", data: parseJSON(LATEX_QUESTION_CORRECT) },
  ];



  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Simulate a processing state
    setIsProcessing(true);
    const timeoutId = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [triggerUpdate]);

  return (
    <div className="h-screen flex">
      <div
        className={`bg-gray-700 text-white w-64 min-h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0" : "-ml-64"
        }`}
      >
        <div className="p-4">
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <FaChevronLeft className="w-6 h-6 fill-current" />
            ) : (
              <FaChevronRight className="w-6 h-6 fill-current ml-64 text-zinc-900" />
            )}
          </button>
        </div>
          <h1 className="text-start font-bold ml-1 text-xl">Your Result </h1>
        <div className="flex flex-wrap m-1 ">
          {questions.map((question, index) => (
            <QuestionButton
              key={index}
              questionText={question.text}
              isAnswerCorrect={question.data?.isAnswerCorrect}
              isProcessing={isProcessing}
              isDataAvailable={
                question.data !== null && question.data !== undefined
              }
            />
          ))}

        </div>
          <div className="mt-10">
            <PopupButton FaQuestionCircle={FaQuestionCircle} FaCheck={FaCheck} FaTimes={FaTimes}/>
          </div>
      </div>
    </div>
  );
};

export default LeftSidebar;

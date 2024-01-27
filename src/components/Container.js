import React, { useState, useEffect } from "react";
import SingleChoice from "./SingleChoice";
import LeftSidebar from "./Sidebar";
import MultipleChoice from "./MultipleChoice";
import FiBlanks from "./FiBlanks";
import SortingQuiz from "./SortingQuiz";
import MatchingMatrix from "./MatchingMatrix";
import LatexQuestion from "./LatexQuestion";
import correctAudio from "../assets/Z6NN9ZT-correct-answer.mp3";
import incorrectAudio from "../assets/cartoon-slide-whistle-down-1-176647.mp3";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const COMPONENT_MAP = {
  sortingdropdown: SortingQuiz,
  MultipleChoice: MultipleChoice,
  SingleChoice: SingleChoice,
  FillInTheBlank: FiBlanks,
  matchMatrix: MatchingMatrix,
  latexQuestion: LatexQuestion,
};

const Container = ({ questionData }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [triggerUpdate, setTriggerUpdate] = useState(Date.now());
  const [sidebarData, setSidebarData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem("sidebarData")) || {
      correctness: null,
      selectedOption: null,
    };
    return storedData;
  });

  const cardsPerPage = 1;

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = questionData.slice(indexOfFirstCard, indexOfLastCard);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  useEffect(() => {
    // Trigger an update whenever a change occurs
    setTriggerUpdate(Date.now());
  }, [COMPONENT_MAP]);

  const renderCard = (card, index) => {
    const Component = COMPONENT_MAP[card.type];
    return Component ? (
      <Component
        key={index}
        question={card}
        correctAudio={correctAudio}
        incorrectAudio={incorrectAudio}
        isMuted={isMuted}
      />
    ) : null;
  };

  return (
    <div className="flex gap-28">
      <div>
        <LeftSidebar triggerUpdate={triggerUpdate} data={sidebarData} />
      </div>
    
      <div className="mt-24">
        <div>
          {currentCards.map(renderCard)}
        </div>
        <div className="flex justify-between mt-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gradient-to-r from-[#11009E] via-[#4942E4] to-[#FAE7F3] h-16 w-32 rounded-lg text-white font-bold "
          >
            Prev
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastCard >= questionData.length}
            className="bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 h-16 w-32 rounded-lg text-black font-bold"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-24">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="px-4 py-2 text-white bg-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-gray-300"
        >
          {isMuted ? <FaVolumeMute color="red" /> : <FaVolumeUp color="blue" />}
        </button>
      </div>
    </div>
  );
};

export default Container;

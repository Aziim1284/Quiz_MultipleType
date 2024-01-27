import React, { useState, useEffect, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DragTypes = {
  ITEM: 'item',
};

const DraggableItem = ({ label, onDrop, isDraggingDisabled }) => {
  const [, ref] = useDrag({
    type: DragTypes.ITEM,
    item: { label },
    canDrag: !isDraggingDisabled,
  });

  return (
    <div
      ref={ref}
      className={`w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200 ${
        isDraggingDisabled ? 'cursor-not-allowed' : 'cursor-move'
      }`}
    >
      {label}
    </div>
  );
};

const DroppableArea = ({ onDrop, questionId, children, label }) => {
  const [, drop] = useDrop({
    accept: DragTypes.ITEM,
    drop: (item) => onDrop(item.label, questionId),
  });

  return (
    <div ref={drop} className='p-10 shadow-gray-500 shadow-inner w-60 h-16 flex justify-center items-center'>
      <h1 className='text-center'>{label}</h1>
      {children}
    </div>
  );
};

const MatchingMatrix = ({ correctAudio, incorrectAudio, isMuted }) => {
  const maxAttempts = 4;
  const questions = [
    { id: 1, question: 'Capital of India', answer: ['delhi'] },
    { id: 2, question: 'Capital of Sri Lanka', answer: ['colombo'] },
    { id: 3, question: 'Color of the Sky', answer: ['blue', 'green'] },
  ];

  const initialUserAnswers = ['', '', ''];
  const initialIsCorrect = [undefined, undefined, undefined];

  const [userAnswers, setUserAnswers] = useState(initialUserAnswers);
  const [isCorrect, setIsCorrect] = useState(initialIsCorrect);
  const [attempts, setAttempts] = useState(0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUserAnswers = localStorage.getItem('userAnswers');
    const storedIsCorrect = localStorage.getItem('isCorrect');
    const storedAttempts = localStorage.getItem('attempts');

    if (storedUserAnswers && storedIsCorrect && storedAttempts) {
      setUserAnswers(JSON.parse(storedUserAnswers));
      setIsCorrect(JSON.parse(storedIsCorrect));
      setAttempts(Number(storedAttempts));
    }
  }, []);

  const handleDrop = (answer, questionId) => {
    if (attempts < maxAttempts) {
      const updatedUserAnswers = [...userAnswers];
      updatedUserAnswers[questionId - 1] = answer.toLowerCase();
      setUserAnswers(updatedUserAnswers);

      const isAnswerCorrect = questions[questionId - 1].answer.includes(answer.toLowerCase());
      const updatedIsCorrect = [...isCorrect];
      updatedIsCorrect[questionId - 1] = isAnswerCorrect;
      setIsCorrect(updatedIsCorrect);

      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  const handleReset = () => {
    setUserAnswers(initialUserAnswers);
    setIsCorrect(initialIsCorrect);
    setAttempts(0);
  };

  // Save data to localStorage whenever userAnswers or attempts change
  useEffect(() => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('isCorrect', JSON.stringify(isCorrect));
    localStorage.setItem('attempts', attempts.toString());
  }, [userAnswers, isCorrect, attempts]);

  const draggableItems = useMemo(
    () =>
      questions.map((data) => (
        <DraggableItem
          key={data.id}
          label={data.answer[0]}
          onDrop={(answer) => handleDrop(answer, data.id)}
          isDraggingDisabled={attempts >= maxAttempts}
        />
      )),
    [questions, handleDrop, attempts, maxAttempts]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-9 p-3 shadow-md shadow-slate-300 w-auto'>
          {/* draggable items */}
          <div className='flex'>{draggableItems}</div>

          {/* droppable areas */}
          <div className=' shadow-inner shadow-orange-200 flex flex-col gap-6 p-3 m-3'>
            {questions.map((data) => (
              <div className='flex justify-between' key={data.id}>
                <DroppableArea
                  label={`Q.${data.id}: ${data.question}`}
                  questionId={data.id}
                  onDrop={(answer) => handleDrop(answer, data.id)}
                >
                  {userAnswers[data.id - 1] && (
                    <div
                      className={`w-40 h-14 border ${
                        isCorrect[data.id - 1]
                          ? 'border-green-800'
                          : 'border-red-500'
                      }  w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200`}
                    >
                      {userAnswers[data.id - 1]}
                    </div>
                  )}
                </DroppableArea>
                {isCorrect[data.id - 1] !== undefined && attempts > 0 && (
                  <div className='font-bold'>
                    Q.{data.id}:{' '}
                    {isCorrect[data.id - 1] ? 'Correct!' : 'Incorrect!'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* display attempts */}
          <div className='font-bold'>
            Attempts: {attempts} / {maxAttempts}
          </div>
          {attempts >= maxAttempts && (
            <div className='text-red-500 font-bold'>
              Dragging is disabled. Maximum attempts reached.
            </div>
          )}

          {/* reset button */}
          <button className='mt-4 p-2 bg-blue-500 text-white rounded-md' onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default MatchingMatrix;

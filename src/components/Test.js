import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DragTypes = {
  ITEM: 'item',
};

const DraggableItem = ({ label, onDrop }) => {
  const [, ref] = useDrag({
    type: DragTypes.ITEM,
    item: { label },
  });

  return (
    <div
      ref={ref}
      className='w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200'
      style={{ cursor: 'move' }}
    >
      {label}
    </div>
  );
};

const DroppableArea = ({ onDrop, children, label }) => {
  const [, drop] = useDrop({
    accept: DragTypes.ITEM,
    drop: (item) => onDrop(item.label),
  });

  return (
    <div ref={drop} className='p-10 shadow-gray-500 shadow-inner w-60 h-16 flex justify-center items-center'>
      <div className='text-center mb-2'>{label}</div>
      {children}
    </div>
  );
};

const Test = () => {
  const [userAnswers, setUserAnswers] = useState(['', '', '']);
  const [isCorrect, setIsCorrect] = useState([false, false, false]);

  const questions = [
    { id: 1, question: 'Capital of India', answer: ['delhi'] },
    { id: 2, question: 'Capital of Sri Lanka', answer: ['colombo'] },
    { id: 3, question: 'Color of the Sky', answer: ['blue', 'green'] },
  ];

  const handleDrop = (answer, questionId) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[questionId - 1] = answer.toLowerCase();
    setUserAnswers(updatedUserAnswers);

    const isAnswerCorrect = questions[questionId - 1].answer.includes(
      answer.toLowerCase()
    );
    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[questionId - 1] = isAnswerCorrect;
    setIsCorrect(updatedIsCorrect);
  };

  return (
    <DndProvider backend={HTML5Backend}>
        <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-9 p-3 shadow-md shadow-slate-300 w-1/3'>
            {/* dragable items */}
          <div className='flex'>
            {questions.map((data) => (
              <DraggableItem
                key={data.id}
                label={data.answer[0]}
                onDrop={(answer) => handleDrop(answer, data.id)}
              />
            ))}
          </div>

                {/* dropable area */}
          <div className=' shadow-inner shadow-orange-200 flex flex-col gap-6 p-3 m-3'>
            <div className='flex justify-between'>
                <div className='p-10 shadow-gray-500 shadow-inner w-60 h-16 flex justify-center items-center'>
                <h1 className='text-center'> <enum>Q.1:</enum> Capital of India ?</h1>
                </div>
            <DroppableArea
              onDrop={(answer) => handleDrop(answer, 1)}
            >
              {userAnswers[0] && (
                <div
                  className={`w-40 h-14 border ${
                    isCorrect[0] ? 'border-green-800' : 'border-red-500'
                  }  w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200`}
                >
                  {userAnswers[0]}
                </div>
              )}
            </DroppableArea>
            </div>
            <div className='flex justify-between'>
            <div className='p-10 shadow-gray-500 shadow-inner w-60 h-16 flex justify-center items-center'>
                <h1 className='text-center'> <enum>Q.1:</enum> Capital of SriLanka ?</h1>
                </div>
            <DroppableArea
              onDrop={(answer) => handleDrop(answer, 2)}
            >
              {userAnswers[1] && (
                <div
                  className={`w-40 h-14 border ${
                    isCorrect[1] ? 'border-green-500' : 'border-red-500'
                  } w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200`}
                >
                  {userAnswers[1]}
                </div>
              )}
            </DroppableArea>
            </div>
            <div className='flex justify-between'>
            <div className='p-10 shadow-gray-500 shadow-inner w-60 h-16 flex justify-center items-center'>
                <h1 className='text-center'> <enum>Q.1:</enum> Color Of Sky ?</h1>
                </div>
              <DroppableArea
                onDrop={(answer) => handleDrop(answer, 3)}
              >
                {userAnswers[2] && (
                  <div
                    className={`w-40 h-14 border ${
                      isCorrect[2] ? 'border-green-500' : 'border-red-500'
                    } w-40 h-14 border-none m-2 shadow-md shadow-slate-600 flex justify-center items-center rounded-md font-semibold bg-gray-200`}
                  >
                    {userAnswers[2]}
                  </div>
                )}
              </DroppableArea>
            </div>
          </div>
        </div>
        </div>
    </DndProvider>
  );
};

export default Test;

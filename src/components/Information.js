import React, { useState } from 'react';
import { FaTimes, FaQuestionCircle, FaCheck } from 'react-icons/fa';

const PopupButton = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const togglePopup = (buttonId) => {
    setSelectedButton(buttonId);
    setPopupVisible(!isPopupVisible);
  };

  const popupContent = () => {
    switch (selectedButton) {
      case 'button1':
        return (
          <div className="popup-overlay">
            <div className="popup p-2">
              <p>This Icon shows when your Questions is <span className='text-red-500'>incorrect</span> </p>
              <button onClick={() => togglePopup(null)} className='bg-red-500 p-2'>Close</button>
            </div>
          </div>
        );
      case 'button2':
        return (
          <div className="popup-overlay">
            <div className="popup p-2">
              <p>This Icon Shows When your question is in  <span className='text-yellow-500'>processing..</span></p>
              <button onClick={() => togglePopup(null)} className='bg-red-500 p-2'>Close</button>
            </div>
          </div>
        );
      case 'button3':
        return (
          <div className="popup-overlay">
            <div className="popup p-2">
            <p>This Icon shows when your Questions is <span className='text-green-500'>Correct</span> </p>
              <button onClick={() => togglePopup(null)} className='bg-red-500 p-2'>Close</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Check info below</h1>
      <div className="flex">
        <button
          onClick={() => togglePopup('button1')}
          className="hover:bg-blue-700 text-white shadow-sm shadow-stone-200 flex py-2 px-4 mx-2 my-2 rounded-lg w-34"
        >
          <FaTimes color='red' />
        </button>
        <button
          onClick={() => togglePopup('button2')}
          className="hover:bg-blue-700 text-white shadow-sm shadow-stone-200 flex py-2 px-4 mx-2 my-2 rounded-lg w-34"
        >
          <FaQuestionCircle color='yellow' />
        </button>
        <button
          onClick={() => togglePopup('button3')}
          className="hover:bg-blue-700 text-white shadow-sm shadow-stone-200 flex py-2 px-4 mx-2 my-2 rounded-lg w-34"
        >
          <FaCheck color='green' />
        </button>

      </div>
      <div className='shadow-sm shadow-zinc-200 h-50 w-full'>

        {isPopupVisible && popupContent()}
      </div>
    </div>
  );
};

export default PopupButton;

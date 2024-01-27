import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  OPTION: "option",
};

const Option = ({ id, text, index, moveOption, disabled }) => {
  const [, ref] = useDrag({
    type: ItemTypes.OPTION,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.OPTION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveOption(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`bg-gray-100 p-3 m-2 cursor-move ${disabled ? "opacity-50" : ""}`}
    >
      {text}
    </div>
  );
};

export default Option;

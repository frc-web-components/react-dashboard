import React, { ReactNode, useState } from "react";
import Draggable from "react-draggable";
import "./SimpleDialog.css"; // Assuming you have a CSS file for styling

interface Props {
  children: ReactNode;
  title: string;
}

const SimpleDialog = ({ children, title }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      {/* <button onClick={openDialog}>Open Dialog</button> */}
      {isOpen && (
        <Draggable handle=".dialog-header">
          <div className="dialog">
            <div className="dialog-header">
              <span>{title}</span>
            </div>
            <div className="dialog-content">{children}</div>
            <div className="dialog-actions">
              <button className="close-button" onClick={closeDialog}>
                Close
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default SimpleDialog;

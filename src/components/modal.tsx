import { createPortal } from "react-dom";
import { ModalProps } from "../types/interface";

const Modal: React.FC<ModalProps> = ({ children, handleModalClose }) => {
  return createPortal(
    <div className="modal-container w-full h-screen absolute top-0 left-0 flex justify-center items-center">
      <button
        onClick={handleModalClose}
        className="w-full h-full cursor-pointer absolute top-0 left-0 z-10 bg-white/10 backdrop-blur-xs"
      />
      <div className="modal-content border-teal-600 border-[7px] p-8 z-20 w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl h-7/12 sm:h-6/12 bg-stone-800 rounded-xl flex flex-col shadow-2xl">
        {children}
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement
  );
};

export default Modal;

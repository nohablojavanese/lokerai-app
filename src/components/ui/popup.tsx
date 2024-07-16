'use client'
import { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";

interface PopupProps {
  isOpen: boolean; // Prop removed since it will be managed internally
}

const Popup: React.FC<PopupProps> = ({ isOpen }) => {
  const [open, setOpen] = useState(isOpen); // State to manage popup visibility

  // Close popup when Esc key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Immediately open the popup when mounted
  useEffect(() => {
    setOpen(true);
  }, []);

  // Close popup function
  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="z-50 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg  flex font-semibold text-gray-800 dark:text-white">
            <IoIosWarning className="self-center mr-2"/> Dalam Pengujian Beta
          </h2>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white focus:outline-none"
            onClick={handleClose}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Applikasi masih dalam proses pengembangan dan kemungkinan akan terdapat beberapa kendala dalam pembuatan Resume.
          Data anda tidak tersimpan ataupun terkirim ke server. Pengujian beta ditujukan untuk memperoleh hasil testing yang 
          nantinya digunakan sebagai evaluasi pengembangan. -JP
        </p>
      </div>
    </div>
  );
};

export default Popup;

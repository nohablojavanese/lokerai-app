"use client";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { FaThumbsUp } from "react-icons/fa";

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
      <div className="z-50 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto ">
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <IoIosWarning className="self-center mr-2 text-red-400" /> Dalam
            Pengujian Beta
          </h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Aplikasi masih dalam proses pengembangan dan kemungkinan akan terdapat
          beberapa kendala dalam pembuatan Resume. Data anda tidak tersimpan
          ataupun terkirim ke server. Pengujian beta ditujukan untuk memperoleh
          hasil testing yang nantinya digunakan sebagai evaluasi pengembangan.
          -JP
        </p>
        <div className="flex justify-center mt-4">
          <Button
            className="text-green-500 flex items-center bg-white border-2 border-green-500 hover:bg-green-500 dark:text-gray-400 hover:text-white dark:hover:text-white focus:outline-none"
            onClick={handleClose}
          >
            <FaThumbsUp className="" />
            Mengerti
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

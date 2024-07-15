import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateFontSettings } from "@/redux/cvSlice";

const FontSettings: React.FC = () => {
  const fontSettings = useSelector((state: RootState) => state.cv.fontSettings);
  const dispatch = useDispatch();

  const handleFontChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      updateFontSettings({
        [name]: name === "fontSize" ? parseInt(value, 10) : value,
      })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Font Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="headerFont"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Header Font
          </label>
          <select
            id="headerFont"
            name="headerFont"
            value={fontSettings.headerFont}
            onChange={handleFontChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Poppins">Poppins</option>
            <option value="Arial" className="font-sans">
              Arial
            </option>
            <option value="Helvetica" className="font-sans">
              Helvetica
            </option>
            <option value="Calibri" className="font-sans">
              Calibri
            </option>
            <option value="Georgia, serif" className="font-serif">
              Georgia
            </option>
            <option value="Garamond, serif" className="font-serif">
              Garamond
            </option>
            <option value="Times New Roman, serif" className="font-serif">
              Times New Roman
            </option>
            <option value="Verdana, sans-serif" className="font-sans">
              Verdana
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="bodyFont"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Body Font
          </label>
          <select
            id="bodyFont"
            name="bodyFont"
            value={fontSettings.bodyFont}
            onChange={handleFontChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Arial" className="font-sans">
              Arial
            </option>
            <option value="Helvetica" className="font-sans">
              Helvetica
            </option>
            <option value="Calibri" className="font-sans">
              Calibri
            </option>
            <option value="Georgia, serif" className="font-serif">
              Georgia
            </option>
            <option value="Garamond, serif" className="font-serif">
              Garamond
            </option>
            <option value="Times New Roman, serif" className="font-serif">
              Times New Roman
            </option>
            <option value="Verdana, sans-serif" className="font-sans">
              Verdana
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="fontSize"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Font Size
          </label>
          <input
            type="number"
            id="fontSize"
            name="fontSize"
            value={fontSettings.fontSize}
            onChange={handleFontChange}
            min="8"
            max="24"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default FontSettings;

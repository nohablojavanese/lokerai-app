"use client";

// import { Provider } from "react-redux";
// import { store } from "../redux/store";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";
import Popup from "@/components/ui/popup";

export default function Home() {
  return (
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 ">
        <Popup isOpen={true} />
        <div className="md:w-1/2 overflow-y-auto bg-blue-50/20 dark:bg-blue-900/20 pt-10 ps-7 pe-5  min-fit rounded-r-3xl border-2 m-4 border-blue-400 dark:bg-gray-800 dark:border-gray-600">
          <CVEditor />
        </div>
        <div className="md:sticky md:top-0 h-screen pt-20 md:w-1/2  p-5 overflow-y-auto dark:bg-gray-900 flex items-center justify-center">
          <CVPreview />
        </div>
      </main>
  );
}

"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";
import Popup from "@/components/ui/popup";

export default function Home() {
  return (
    <Provider store={store}>
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-blue-50/20 dark:bg-blue-900/20 md:w-1/2 pt-10 ps-7 pe-5 overflow-y-auto min-fit rounded-r-3xl border-2 m-4 border-blue-400 dark:bg-gray-800 dark:border-gray-600">
        <CVEditor />
      </div>
      <div className="md:w-1/2 bottom-0 p-5 overflow-y-auto bg-background bg-gray-50 min-w-fit dark:bg-gray-900">
        <CVPreview />
      </div>
      <Popup isOpen={true}/>
    </main>
  </Provider>
  );
}

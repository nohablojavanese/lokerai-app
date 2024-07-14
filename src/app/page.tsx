"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex flex-col md:flex-row min-h-screen">
        <div className="fixed top-0 start-0 end-0 z-20" id="document-toolbar">
          <div className="flex items-center bg-gray-900 p-2 lg:p-3"></div>
        </div>

        <div className="bg-white start-0 w-1/2 mt-10 ps-7 pe-5 overflow-y-auto">
          <CVEditor />
        </div>
        <div className="fixed end-0 w-1/2 bottom-0 p-5 overflow-y-auto bg-background top-10 bg-gray-50">
          <CVPreview />
        </div>
      </main>
    </Provider>
  );
}

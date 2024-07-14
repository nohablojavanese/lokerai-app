"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* <div className="fixed top-0 start-0 end-0 z-20" id="document-toolbar">
          <div className="flex items-center bg-gray-900 p-2 lg:p-3"></div>
        </div> */}

        <div className="bg-blue-50/40 start-0 md:w-1/2 pt-10 ps-7 pe-5 overflow-y-auto min-fit  rounded-r-3xl border-2 m-4 border-blue-400">
          <CVEditor />
        </div>
        <div className=" end-0 md:w-1/2 bottom-0 p-5 overflow-y-auto bg-background  bg-gray-50 min-w-fit  ">
          <CVPreview />
        </div>
      </main>
    </Provider>
  );
}

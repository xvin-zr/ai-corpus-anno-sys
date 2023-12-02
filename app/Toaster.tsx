"use client";
import { Toaster as ReactToaster } from "react-hot-toast";

function Toaster() {
  return (
    <ReactToaster position="bottom-right" toastOptions={{ duration: 4000 }} />
  );
}

export default Toaster;

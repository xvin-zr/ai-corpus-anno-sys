"use client";
import { Toaster } from "react-hot-toast";

function ToasterComponent() {
  return <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />;
}

export default ToasterComponent;

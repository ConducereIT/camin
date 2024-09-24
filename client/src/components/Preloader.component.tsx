import React, { useContext } from "react";
import { PreloaderContext } from "./PreloaderProvider.component";
import LogoWhite from "../assets/icon_logoLSEblue.webp";
const Preloader: React.FC = () => {
  const context = useContext(PreloaderContext);

  // Handle case where context is undefined
  if (!context) {
    throw new Error("Preloader must be used within a PreloaderProvider");
  }

  const { isLoading } = context;

  if (!isLoading) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white duration-300">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
        <img src={LogoWhite} className="rounded-full h-28 w-28" />
      </div>
    </>
  );
};

export default Preloader;

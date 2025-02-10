import React from "react";
import { useAppContext } from "@/app/AppContext";

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const { shareID } = useAppContext();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <h3 className="text-xl mb-2 text-black">
          Met de volgende url kunnen mensen zich gelijk inschrijven
        </h3>
        <p className="text-gray-700 text-md">
          {window.location.origin}/?id={shareID}&share=true
        </p>
        <div className="flex justify-end mt-4">
          <button className="bg-black text-white px-4 py-2" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

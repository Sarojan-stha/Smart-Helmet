import { useModalStore } from "../store/useModelStore";
import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

export const AccidentAlertModal = () => {
  const { isOpen, message, extraData, closeModal } = useModalStore();
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const buzzerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAcknowledged(false);
    }
  }, [isOpen]);

  // Play buzzer sound continuously while modal is open
  useEffect(() => {
    if (isOpen && !isAcknowledged) {
      if (buzzerRef.current) {
        buzzerRef.current.loop = true;
        buzzerRef.current.play().catch((error) => {
          console.warn("Buzzer playback failed:", error);
        });
      }
    } else {
      if (buzzerRef.current) {
        buzzerRef.current.pause();
        buzzerRef.current.currentTime = 0;
      }
    }
  }, [isOpen, isAcknowledged]);

  if (!isOpen) return null;

  const timestamp = extraData?.timestamp
    ? new Date(extraData.timestamp)
    : new Date();
  const latitude = extraData?.location?.latitude;
  const longitude = extraData?.location?.longitude;

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
    closeModal(); // Close modal
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => {}}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      bg-white rounded-xl shadow-2xl z-50 max-w-md w-11/12 animate-fadeIn"
      >
        {/* Header */}
        <div className="bg-red-600 text-white rounded-t-xl p-6 text-center space-y-2">
          <AlertCircle className="mx-auto w-10 h-10 animate-pulse" />
          <h2 className="text-2xl font-bold animate-pulse">
            ⚠️ Danger Detected!
          </h2>
          <p className="text-sm opacity-90">Immediate attention required</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-gray-800">
          {/* Timestamp */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-semibold">{timestamp.toLocaleTimeString()}</p>
          </div>

          {/* Location */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-semibold">
              {typeof latitude === "number" && typeof longitude === "number"
                ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                : "Unknown"}
            </p>
          </div>

          {/* Message */}
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-800 text-sm">
            {message || "Threat detected by helmet sensors!"}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAcknowledge}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold 
                         py-2 rounded-lg transition-colors duration-200"
            >
              Acknowledge
            </button>
            <button
              onClick={closeModal}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold 
                         py-2 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Buzzer Audio */}
        <audio ref={buzzerRef} src="/sounds/buzzer.mp3" />
      </div>
    </>
  );
};

"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = "popup_last_shown";
    const saved = localStorage.getItem(key);
    const now = Date.now();
    const thirtyMins = 30 * 60 * 1000;

    if (!saved || now - Number(saved) > thirtyMins) {
      setShow(true); // Show modal
    }
  }, []);

  const handleClose = () => {
    const now = Date.now();
    localStorage.setItem("popup_last_shown", now.toString());
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed z-50 bottom-10 right-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-sm w-full relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-lg cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Want to test it out?
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Use the demo license key <br />
              <span className="mt-2 pt-4">
                <strong className="text-sm bg-gray-0 py-1 rounded">
                  86781236-23d0-4b3c-7dfa-c1c147e0dece
                </strong>{" "}
              </span>
              <br />
            </p>

            <p className="text-sm text-gray-600 mb-4">
              If licence key already exists, delete it and re-add it using the{" "}
              <span className="text-blue-500 font-semibold">Activate</span>{" "}
              button with a test{" "}
              <span className="text-blue-500 font-semibold">domain</span>
              (eg www.example.com).
            </p>

            <span className="text-xs pt-2">
              <strong className="text-red-500">*</strong>
              This key is for testing purposes only.
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

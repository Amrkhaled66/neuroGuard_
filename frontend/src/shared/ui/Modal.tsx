import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Overlay from "@shared/ui/Overlay";

const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -150, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 z-[90] max-h-[85vh] w-[90%] -translate-x-1/2 -translate-y-1/2 lg:max-w-[50%]"
          >
            {showCloseButton ? (
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="app-surface absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full text-lg text-[var(--text-secondary)] transition-colors hover:text-brand-primary"
              >
                <IoClose />
              </button>
            ) : null}
            {children}
          </motion.div>
          {/* <div className="absolute inset-0"> */}
          <Overlay onClick={onClose} show={isOpen} />
          {/* </div> */}
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;

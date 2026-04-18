import { motion } from "framer-motion";
import { FaRegCheckCircle, } from "react-icons/fa";
import { GoXCircle } from "react-icons/go";
import { GoAlert } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GoQuestion } from "react-icons/go";

import Modal from "./Modal";
// Alert Types
type AlertIcon = "success" | "error" | "warning" | "info" | "question";

interface AlertProps {
  title: string;
  text: string;
  icon: AlertIcon;
  confirmButtonText: string;
  onConfirm?: () => void;
  cancelButtonText?: string;
  onCancel?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const iconConfig = {
  success: {
    Icon: FaRegCheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    ringColor: "ring-green-500/20",
  },
  error: {
    Icon: GoXCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    ringColor: "ring-red-500/20",
  },
  warning: {
    Icon: GoAlert,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    ringColor: "ring-amber-500/20",
  },
  info: {
    Icon: IoIosInformationCircleOutline,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    ringColor: "ring-blue-500/20",
  },
  question: {
    Icon: GoQuestion,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    ringColor: "ring-purple-500/20",
  },
};

const Alert = ({
  title,
  text,
  icon,
  confirmButtonText,
  onConfirm,
  cancelButtonText,
  onCancel,
  isOpen,
  onClose,
}: AlertProps) => {
  const { Icon, color, bgColor, ringColor } = iconConfig[icon];

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <GoXCircle size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="mb-6 flex justify-center"
          >
            <div className={`${bgColor} ${ringColor} ring-4 rounded-full p-4`}>
              <Icon className={`${color} w-12 h-12`} strokeWidth={2} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            {title}
          </motion.h2>

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 mb-8 leading-relaxed"
          >
            {text}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 justify-center"
          >
            {cancelButtonText && (
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {cancelButtonText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium  transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              {confirmButtonText}
            </button>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
};

export default Alert;
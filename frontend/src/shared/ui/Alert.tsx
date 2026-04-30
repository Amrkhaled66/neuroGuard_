import { motion } from "framer-motion";
import { FaRegCheckCircle } from "react-icons/fa";
import { GoXCircle } from "react-icons/go";
import { GoAlert } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GoQuestion } from "react-icons/go";
import type { IconType } from "react-icons";
import Button from "./Button";
import Modal from "./Modal";
import type { ButtonVariant } from "./Button";
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

const iconConfig: Record<
  AlertIcon,
  {
    Icon: IconType;
    color: string;
    bgColor: string;
    ringColor: string;
    buttonVariant: ButtonVariant;
  }
> = {
  success: {
    Icon: FaRegCheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    ringColor: "ring-green-500/20",
    buttonVariant: "primary",
  },
  error: {
    Icon: GoXCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    ringColor: "ring-red-500/20",
    buttonVariant: "danger",
  },
  warning: {
    Icon: GoAlert,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    ringColor: "ring-amber-500/20",
    buttonVariant: "warning",
  },
  info: {
    Icon: IoIosInformationCircleOutline,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    ringColor: "ring-blue-500/20",
    buttonVariant: "warning",
  },
  question: {
    Icon: GoQuestion,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    ringColor: "ring-purple-500/20",
    buttonVariant: "warning",
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
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
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
            <div className={`${bgColor} ${ringColor} rounded-full p-4 ring-4`}>
              <Icon className={`${color} h-12 w-12`} strokeWidth={2} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3 text-2xl font-bold text-gray-900"
          >
            {title}
          </motion.h2>

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 leading-relaxed text-gray-600"
          >
            {text}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3"
          >
            {cancelButtonText && (
              <button
                onClick={handleCancel}
                className="rounded-xl bg-gray-100 px-6 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-200 active:scale-95"
              >
                {cancelButtonText}
              </button>
            )}
            <Button
              onClick={handleConfirm}
              variant={iconConfig[icon].buttonVariant}
            >
              {confirmButtonText}
            </Button>
            {/* <button
              className="px-6 py-2.5 rounded-xl bg-status-danger text-white font-medium  transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              
            </button> */}
          </motion.div>
        </div>
      </div>
    </Modal>
  );
};

export default Alert;

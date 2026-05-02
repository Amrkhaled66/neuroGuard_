import Alert from "./Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
    resetErrorBoundary();
  };

  return (
    <Alert
      isOpen={isOpen}
      onClose={handleClose}
      title="Error"
      text={error.message || "Something went wrong"}
      icon="error"
      confirmButtonText="OK"
      onConfirm={handleClose}
    />
  );
};

export default ErrorFallback;
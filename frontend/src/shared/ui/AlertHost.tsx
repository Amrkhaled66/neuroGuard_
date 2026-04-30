import { useEffect, useState } from "react";
import Alert from "@/shared/ui/Alert";
import {
  alertManager,
  type AlertConfig,
} from "@/shared/utils/alert";

type AlertState = AlertConfig & {
  isOpen: boolean;
};

const initialAlertState: AlertState = {
  title: "",
  text: "",
  icon: "success",
  confirmButtonText: "OK",
  isOpen: false,
};

export default function AlertHost() {
  const [alertState, setAlertState] = useState<AlertState>(initialAlertState);

  useEffect(() => {
    return alertManager.subscribe((config) => {
      setAlertState({
        confirmButtonText: "OK",
        ...config,
      });
    });
  }, []);

  return (
    <Alert
      {...alertState}
      confirmButtonText={alertState.confirmButtonText ?? "OK"}
      onClose={() => alertManager.hide()}
    />
  );
}

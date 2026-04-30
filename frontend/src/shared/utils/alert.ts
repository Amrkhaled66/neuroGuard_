export type AlertIcon = "success" | "error" | "warning" | "info" | "question";

export interface AlertConfig {
  title: string;
  text: string;
  icon: AlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

type AlertListener = (config: AlertConfig & { isOpen: boolean }) => void;

class AlertManager {
  private listeners: AlertListener[] = [];

  subscribe(listener: AlertListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(config: AlertConfig) {
    this.listeners.forEach((listener) => {
      listener({ ...config, isOpen: true });
    });
  }

  hide() {
    this.listeners.forEach((listener) => {
      listener({
        title: "",
        text: "",
        icon: "success",
        isOpen: false,
      });
    });
  }
}

export const alertManager = new AlertManager();

export const Alert = (config: AlertConfig) => {
  alertManager.show(config);
};

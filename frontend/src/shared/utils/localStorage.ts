export const setItem = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("localStorage setItem error", err);
    }
  };
  
  export const getItem = <T = unknown>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("localStorage getItem error", err);
      return null;
    }
  };
  
  export const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("localStorage removeItem error", err);
    }
  };
  
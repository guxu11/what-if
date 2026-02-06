import { useEffect, useState } from "react";

export function Toast({ message, type = "info", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`toast ${type} ${isVisible ? "visible" : "hidden"}`}>{message}</div>;
}

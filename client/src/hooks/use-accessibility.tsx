import { useState, useEffect } from "react";

export function useAccessibility() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    const savedContrast = localStorage.getItem("highContrast") === "true";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    
    setIsHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    updateDocumentClass(savedContrast, savedFontSize);
  }, []);

  const updateDocumentClass = (contrast: boolean, size: string) => {
    if (contrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    
    switch (size) {
      case "small":
        document.documentElement.classList.add("text-sm");
        break;
      case "large":
        document.documentElement.classList.add("text-lg");
        break;
      default:
        document.documentElement.classList.add("text-base");
    }
  };

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem("highContrast", newValue.toString());
    updateDocumentClass(newValue, fontSize);
  };

  const setFontSize = (size: string) => {
    localStorage.setItem("fontSize", size);
    updateDocumentClass(isHighContrast, size);
  };

  return {
    isHighContrast,
    fontSize,
    toggleHighContrast,
    setFontSize,
  };
}

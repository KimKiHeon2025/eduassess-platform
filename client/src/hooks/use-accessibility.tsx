import { useState, useEffect } from "react";

export function useAccessibility() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  useEffect(() => {
    // Check localStorage for saved preferences
    const savedContrast = localStorage.getItem("highContrast") === "true";
    const savedFontSize = localStorage.getItem("fontSize") || "normal";
    
    setIsHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    // Apply settings to document
    updateDocumentClass(savedContrast, savedFontSize);
  }, []);

  const updateDocumentClass = (contrast: boolean, size: string) => {
    if (contrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    // Remove existing font size classes
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    
    // Add new font size class
    switch (size) {
      case "small":
        document.documentElement.classList.add("text-sm");
        break;
      case "large":
        document.documentElement.classList.add("text-lg");
        break;
      case "extra-large":
        document.documentElement.classList.add("text-xl");
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

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    updateDocumentClass(isHighContrast, size);
  };

  return {
    isHighContrast,
    fontSize,
    toggleHighContrast,
    changeFontSize,
  };
}
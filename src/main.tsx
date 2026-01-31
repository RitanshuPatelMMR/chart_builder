// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
//
// createRoot(document.getElementById("root")!).render(<App />);
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("✅ main.tsx loaded");
console.log("✅ Clerk Key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20));

const root = document.getElementById("root");
console.log("✅ Root element:", root);

if (root) {
    createRoot(root).render(<App />);
    console.log("✅ App rendered");
} else {
    console.error("❌ Root element not found!");
}
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";
import { AntdThemeProvider } from "./context/AntdThemeContext";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
    <React.StrictMode>
        <AntdThemeProvider>
            <App />
        </AntdThemeProvider>
    </React.StrictMode>
);

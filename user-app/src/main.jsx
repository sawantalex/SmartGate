import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { VisitorProvider } from "./utils/VisitorContext"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <VisitorProvider>
      <App />
    </VisitorProvider>
  </BrowserRouter>
)

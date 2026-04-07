import "./App.css";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="appShell">
      <div className="appFrame">
        <div className="canvas">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
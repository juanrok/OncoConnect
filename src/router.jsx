import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "welcome",
        element: (
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        ),
      },
      {
        path: "medications",
        element: (
          <ProtectedRoute>
            <Medications />
          </ProtectedRoute>
        ),
      },
      {
        path: "medications/new",
        element: (
          <ProtectedRoute>
            <AddMedication />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
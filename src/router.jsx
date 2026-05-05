import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import ProtectedRoute from "./components/ProtectedRoute";
import Name from "./pages/Name";
import School from "./pages/School";
import SchoolCategories from "./pages/SchoolCategories";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "check-email", element: <CheckEmail /> },
      { path: "verify-email", element: <VerifyEmail /> },
      {
        path: "name",
        element: (
          <ProtectedRoute>
            <Name />
          </ProtectedRoute>
        ),
      },
      {
        path: "welcome",
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
      {
        path: "school",
        element: (
          <ProtectedRoute>
            <School />
          </ProtectedRoute>
        ),
      },
      {
        path: "school/categories",
        element: (
          <ProtectedRoute>
            <SchoolCategories />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
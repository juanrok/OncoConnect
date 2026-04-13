import { Navigate } from "react-router-dom";

/*export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
*/

const DEMO_MODE = true; // false con login real

export default function ProtectedRoute({ children }) {
  if (DEMO_MODE) return children;

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
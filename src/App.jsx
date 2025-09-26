import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Routes
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SaloonRoutes from "./routes/SaloonRoutes";

// export default function App() {
//   return (
//     <Router>
//       <RoleProvider>
//         <Routes>
//           {PublicRoutes()}
//           {AdminRoutes()}
//           {SaloonRoutes()}
//           <Route path="/unauthorized" element={<h1>Unauthorized 🚫</h1>} />
//         </Routes>
//       </RoleProvider>
//     </Router>
//   );
// }


export default function App() {

  const role = useSelector((state) => state.role.role);

  return (
    <Router>
      <Routes>
        {PublicRoutes()}
        {role === "admin" && AdminRoutes()}
        {role === "salonOwner" && SaloonRoutes()}
        <Route path="/unauthorized" element={<h1>Unauthorized 🚫</h1>} />
      </Routes>
    </Router>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Calendar from "./routes/calendar";
import Login from "./routes/login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthService } from "@genezio/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import Account from "./routes/account.tsx";
import Admin from "./routes/admin.tsx";
import MyAppointments from "./routes/myAppointments.tsx";
// import Mentenanta from "./routes/mentenanta.tsx";

AuthService.getInstance().setTokenAndRegion(
  "1-4395fb1a-c50f-437c-bc6a-9d2451e18675",
  "eu-central-1",
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Calendar />,
    // element: <Mentenanta />,
  },
  {
    path: "/login",
    element: <Login />,
    // element: <Mentenanta />,
  },
  {
    path: "/account",
    // element: <Mentenanta />,
    element: <Account />,
  },
  {
    path: "/admin",
    // element: <Mentenanta />,
    element: <Admin />,
  },
  {
    path: "/myappointments",
    // element: <Mentenanta />,
    element: <MyAppointments />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1062295332779-684ijgeeas6721n2ekoe71nkcpcqcu7s.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

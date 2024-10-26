// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { Root } from "./components/Root";
import LogoutTimer from "./components/LogoutTimer"; // Ensure this path is correct
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import UserAccountPage from './pages/UserAccountPage'; // Import the UserAccountPage component
import SignUpPage from "./pages/SignUpPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/signup", // Adding the route for sign-up
        element: <SignUpPage />, // Render SignUpPage component
      },
      {
        path: "/contact",  // Contact route
        element: <ContactPage />,
      },
      {
        path: "/about",  // About us route
        element: <AboutUsPage />,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
      },
      {
        path: "/useraccount",  // User account route
        element: <UserAccountPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <LogoutTimer />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

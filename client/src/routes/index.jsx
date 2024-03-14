


import { BrowserRouter, Route, Routes as RoutesProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Connections from "../pages/Connections";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Contacts from "../pages/Contacts";
import QuickAnswers from "../pages/QuickAnswers";
import Queues from "../pages/Queues";
import { AuthProvider } from "../context/Auth/AuthContext";

import VerifryAuth from "./VerifryAuth";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import LoggedInLayout from "../layout";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <WhatsAppsProvider>
        <RoutesProvider>
          <Route path="/login" element={<VerifryAuth Component={Login}/>} />
          <Route path="/signup" element={<VerifryAuth Component={Signup}/>} />
              <Route element={<LoggedInLayout />}>
                <Route path="/" element={<VerifryAuth isPrivate Component={Dashboard}/>} />
                <Route path="/connections" element={<VerifryAuth isPrivate Component={Connections}/>} />
                <Route path="/contacts" element={<VerifryAuth isPrivate Component={Contacts}/>} />
                <Route path="/quickAnswers" element={<VerifryAuth isPrivate Component={QuickAnswers}/>} />
                <Route path="/users" element={<VerifryAuth isPrivate Component={Users}/>} />
                <Route path="/queues" element={<VerifryAuth isPrivate Component={Queues}/>} />
                <Route path="/settings" element={<VerifryAuth isPrivate Component={Settings}/>} />
                <Route path="/tickets/:ticketId?" element={<VerifryAuth isPrivate Component={Tickets}/>} />
              </Route>
        </RoutesProvider>
        <ToastContainer autoClose={3000} />
        </WhatsAppsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
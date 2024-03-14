import { Navigate } from "react-router-dom";
import { useContext } from "react";
import BackdropLoading from "../components/BackdropLoading";
import { AuthContext } from "../context/Auth/AuthContext";

export default function VerifyAuth({ Component, isPrivate = false }) {
  const { isAuth, loading } = useContext(AuthContext);
  console.log("isAuth", isAuth);
  console.log(loading);
  if (loading) {
    return <BackdropLoading />;
  }

  if (!isAuth && isPrivate) {
    return <Navigate to="/login" />;
  }

  if (isAuth && !isPrivate) {
    return <Navigate to="/" />;
  }

  return <Component />;
}

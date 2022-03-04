import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./Layout/Loader";
import HomePage from "./pages/HomePage";
import SplitPage from "./pages/SplitPage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthSignUpPage from "./pages/AuthSignUpPage";

function Index() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplitPage />} />
        <Route path="/:authPerson" element={<HomePage />} />
        <Route path="/login/:person" element={<AuthLoginPage />} />
        <Route path="/signup/:person" element={<AuthSignUpPage />} />
      </Routes>
    </Router>
  );
}

export default Index;

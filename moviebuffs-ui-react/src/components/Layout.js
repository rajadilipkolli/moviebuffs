import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { NavigationManager } from "./NavigationManager";

const Layout = () => {  return (
    <div className="App">
      <NavigationManager />
      <NavBar />
      <main role="main" className="container-fluid">
        <Outlet />
      </main>
      <footer className="footer mt-auto py-3 text-center">
        <div className="container">
          <span className="text-muted">SivaLabs &copy; {new Date().getFullYear()}.</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import LandingPage from "../client/components/LandingPage";
import Login from "../client/components/Login";
import Navbar from "../client/components/Navbar";
import Search from "../client/components/Search";
import SignUp from "../client/components/SignUp";

describe("Unit testing React components", () => {
  describe("Navbar", () => {
    test("click on Landing Page should redirect to LandingPage", async () => {
      render(
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      );
      await userEvent.click(screen.getByRole("link", { name: "Landing Page" }));
      expect(
        screen.getByRole("heading", { name: "Welcome to Password Manager" })
      ).toBeInTheDocument();
    });

    test("click on Login should redirect to Login page", async () => {
      render(
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      );
      await userEvent.click(screen.getByRole("link", { name: "Login" }));
      expect(
        screen.getByRole("heading", { name: "Log in" })
      ).toBeInTheDocument();
    });

    test("click on Sign up should redirect to SignUp page", async () => {
      render(
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      );
      await userEvent.click(screen.getByRole("link", { name: "Sign Up" }));
      expect(
        screen.getByRole("heading", { name: "Sign Up" })
      ).toBeInTheDocument();
    });

    test("click on Search should redirect to Search page", async () => {
      render(
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/search" element={<Search />} />
          </Routes>
        </BrowserRouter>
      );
      await userEvent.click(screen.getByRole("link", { name: "Search" }));
      expect(
        screen.getByRole("heading", { name: "You're in!", level: 1 })
      ).toBeInTheDocument();
    });
  });
});

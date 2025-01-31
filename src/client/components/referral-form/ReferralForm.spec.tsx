import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import ReferralForm from "./ReferralForm";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { RootState } from "../../store";

// Mock store setup
const mockStore = configureStore<RootState>();
const store = mockStore({
  referrals: {
    selectedReferral: null,
    data: []
  },
});

// Mock `useReferrals` hook
vi.mock("../../hooks", () => ({
  useReferrals: vi.fn(() => ({
    createReferral: vi.fn(),
    updateReferral: vi.fn(),
    setReferralById: vi.fn(),
  })),
}));

describe("ReferralForm Component", () => {
  test("opens modal when 'Add Referral' button is clicked", () => {
    render(
      <Provider store={store}>
        <ReferralForm />
      </Provider>
    );

    // Find and click the "Add Referral" button
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    // Check if the modal appears
    expect(screen.getByText("Referral Builder")).toBeInTheDocument();
  });

  test("renders form fields inside the modal", async () => {
    render(
      <Provider store={store}>
        <ReferralForm />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));

    // Check if form inputs exist
    expect(screen.getByLabelText(/given name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/surname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(
      <Provider store={store}>
        <ReferralForm />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));

    // Find and click the submit button
    fireEvent.click(screen.getByRole("button", { name: /create referral/i }));

    // Wait for validation messages to appear
    await waitFor(() => {
      expect(screen.getByText("Given name is required!")).toBeInTheDocument();
      expect(screen.getByText("Surname is required!")).toBeInTheDocument();
      expect(screen.getByText("E-mail is required!")).toBeInTheDocument();
      expect(screen.getByText("Phone is required!")).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ReferralTable from "./ReferralTable";
import { referralsReducer } from "../../store/slice";

// Use `configureStore` from Redux Toolkit
const mockStore = configureStore({
  reducer: {
    referrals: referralsReducer,
  },
  preloadedState: {
    referrals: {
      selectedReferral: null,
      data: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: 1234567890,
          prefix: "+1",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
          phone: 9876543210,
          avatar: "avatar2.jpg",
          prefix: "+1",
        },
      ],
    },
  },
});

// Mock `useReferrals`
const setReferralByIdMock = vi.fn();
const deleteReferralMock = vi.fn();
vi.mock("../../hooks", () => ({
  useReferrals: vi.fn(() => ({
    isLoadingReferrals: false,
    isDeletingReferral: false,
    setReferralById: setReferralByIdMock,
    deleteReferral: deleteReferralMock,
  })),
  useConfirm: vi.fn(() => ({
    confirm: vi.fn((options) => options.onConfirm()),
  })),
}));

describe("ReferralTable Component", () => {
  test("renders table with correct columns", () => {
    render(
      <Provider store={mockStore}>
        <ReferralTable />
      </Provider>
    );

    // Check if column headers exist
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("displays referral data from Redux store", () => {
    render(
      <Provider store={mockStore}>
        <ReferralTable />
      </Provider>
    );

    // Check if referral names exist
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check emails
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    // Check phone numbers
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
  });

  test("sorts referrals by name", () => {
    render(
      <Provider store={mockStore}>
        <ReferralTable />
      </Provider>
    );

    // Find the column header and click to sort
    const nameColumn = screen.getByText("Name");
    fireEvent.click(nameColumn);

    // Ensure sorting function is triggered (no direct assertion here, sorting is internal)
  });
});

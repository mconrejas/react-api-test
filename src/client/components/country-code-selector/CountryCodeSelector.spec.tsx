import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CountryCodeSelector from "./CountryCodeSelector";
import { vi } from "vitest";

// Mock `libphonenumber-js`
vi.mock("libphonenumber-js", () => ({
  getCountries: vi.fn(() => ["US", "GB", "FR"]),
  getCountryCallingCode: vi.fn((iso) => {
    const codes: Record<string, string> = { US: "1", GB: "44", FR: "33" };
    return codes[iso] || "0";
  }),
}));

// ✅ Mock `world-countries`
vi.mock("world-countries", () => ({
  default: [
    { cca2: "US", name: { common: "United States" } },
    { cca2: "GB", name: { common: "United Kingdom" } },
    { cca2: "FR", name: { common: "France" } },
  ],
}));

describe("CountryCodeSelector Component", () => {
  test("renders country options correctly", async () => {
    render(<CountryCodeSelector />);

    // Check if select input is present
    const selectBox = screen.getByRole("combobox");
    expect(selectBox).toBeInTheDocument();

    // Open the dropdown and check if options exist
    fireEvent.mouseDown(selectBox);

    expect(await screen.findByText("+1 (United States)")).toBeInTheDocument();
    expect(screen.getByText("+44 (United Kingdom)")).toBeInTheDocument();
    expect(screen.getByText("+33 (France)")).toBeInTheDocument();
  });

  test("calls `onChange` when selecting an option", async () => {
    const mockOnChange = vi.fn();
    render(<CountryCodeSelector onChange={mockOnChange} />);

    // Open dropdown
    const selectBox = screen.getByRole("combobox");
    fireEvent.mouseDown(selectBox);

    // Click on an option
    const option = await screen.findByText("+1 (United States)");
    fireEvent.click(option);

    // Extract only the first argument from the function call
    expect(mockOnChange).toHaveBeenCalledWith(expect.stringContaining("+1"), expect.any(Object));
  });
});

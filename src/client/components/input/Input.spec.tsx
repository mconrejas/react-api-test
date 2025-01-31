import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form, Button } from "antd";
import { vi } from "vitest";
import Input from "./Input";

// Mock Ant Design styles (if using CSS Modules)
vi.mock("./input.module.scss", () => ({
  default: { formItem: "mocked-formItem-class" },
}));

describe("Input Component", () => {
  test("renders the input field correctly", () => {
    render(<Input placeholder="Enter text" />);

    // Find the correct input using `getByRole`
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  test("allows text input", () => {
    render(<Input placeholder="Enter text" />);
    
    const inputElement = screen.getByRole("textbox");
    
    // Type text into the input
    fireEvent.change(inputElement, { target: { value: "Hello World" } });

    // Ensure input value has changed
    expect(inputElement).toHaveValue("Hello World");
  });

  test("shows validation error when required field is empty after form submission", async () => {
    render(
      <Form onFinish={vi.fn()}>  {/* Ensure form submission can trigger validation */}
        <Input
          name="testInput"
          placeholder="Required field"
          rules={[{ required: true, message: "This field is required" }]}
        />
        {/* Add `htmlType="submit"` to make the button trigger form validation */}
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    );

    // Find the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Ensure no error message is visible before submission
    expect(screen.queryByText("This field is required")).not.toBeInTheDocument();

    // Click the submit button to trigger validation
    fireEvent.click(submitButton);

    // Wait for the validation error message (search inside `.ant-form-item-explain`)
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("This field is required"))).toBeInTheDocument();
    });
  });
});

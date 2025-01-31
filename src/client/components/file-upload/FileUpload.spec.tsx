import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUpload from "./FileUpload";
import { vi } from "vitest";
import { message } from "antd";

// Mock `antd` message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("FileUpload Component", () => {
  test("renders the upload button", () => {
    render(<FileUpload>Upload File</FileUpload>);
    
    // Check if the upload button exists
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });

  test("displays error if file upload fails", async () => {
    render(<FileUpload action={'/test'}>Upload File</FileUpload>);

    // Find the Upload component wrapper
    const uploadWrapper = screen.getByText("Upload File").closest(".ant-upload");

    expect(uploadWrapper).toBeInTheDocument();

    // Mock a valid image file
    const validFile = new File(["image"], "test.png", { type: "image/png" });

    // Find the file input inside Ant Design's Upload component
    const fileInput = uploadWrapper?.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Ensure error message is displayed
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("test.png file upload failed.");
    });
  });
});

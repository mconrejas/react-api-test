import request from "supertest";
import express, { Express } from "express";
import multer from "multer";
import { uploadFile } from "../../controllers/fileController";
import { vi } from "vitest";

// Setup Express Test App
const app: Express = express();

// Setup Multer Middleware (Mock)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for testing
app.post("/api/file/upload", upload.single("file") as any, uploadFile);

describe("UploadFile Controller", () => {
  test("returns 400 Bad Request if no file is uploaded", async () => {
    const response = await request(app).post("/api/file/upload");
    
    expect(response.status).toBe(400);
    expect(response.text).toBe("No file uploaded.");
  });

  test("returns 200 OK with filename on successful upload", async () => {
    const response = await request(app)
      .post("/api/file/upload")
      .attach("file", Buffer.from("test-content"), "test-image.png");

    console.log(response.body)

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'File uploaded successfully!' });
  });

  test("handles internal server errors", async () => {
    // Mock `req.file` to be `undefined` and force an error
    const mockReq: any = { file: undefined };
    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    uploadFile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ "error": "Internal server error" });
  });
});

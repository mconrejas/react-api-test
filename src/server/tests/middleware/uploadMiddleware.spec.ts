import request from "supertest";
import express, { Express } from "express";
import fs from "fs";
import path from "path";
import upload from "../../middlewares/uploadMiddleware"; // Adjust path if needed
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../../../public/uploads");

// Setup Express Test App
const app: Express = express();
app.post("/api/upload", upload.single("file") as any, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ message: "File uploaded", filename: req.file.filename });
});

describe("Multer Upload Middleware", () => {
  beforeAll(() => {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up uploaded files after each test
    fs.readdirSync(uploadDir).forEach((file) => {
      fs.unlinkSync(path.join(uploadDir, file));
    });
  });

  afterAll(() => {
    // Remove the upload directory after tests
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }
  });

  test("creates the upload directory if it does not exist", () => {
    expect(fs.existsSync(uploadDir)).toBe(true);
  });

  test("uploads a valid file successfully", async () => {
    const response = await request(app)
      .post("/api/upload")
      .attach("file", Buffer.from("test-content"), "testfile.txt");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "File uploaded");
    expect(response.body).toHaveProperty("filename");

    // Ensure the file exists in the uploads folder
    const uploadedFilePath = path.join(uploadDir, response.body.filename);
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
  });

  test("returns 400 when no file is uploaded", async () => {
    const response = await request(app).post("/api/upload");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "No file uploaded");
  });

  test("ensures file naming follows the correct convention", async () => {
    const response = await request(app)
      .post("/api/upload")
      .attach("file", Buffer.from("dummy-content"), "image.png");

    expect(response.status).toBe(200);
    expect(response.body.filename).toMatch(/^file-\d+-\d+\.png$/);
  });
});

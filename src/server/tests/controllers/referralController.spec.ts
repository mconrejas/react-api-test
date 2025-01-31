import request from "supertest";
import express, { Express } from "express";
import multer from "multer";
import { vi } from "vitest";
import {
  create,
  fetch,
  update,
  destroy,
} from "../../controllers/referralController"; // Adjust path if needed

// ✅ Setup Express Test App
const app: Express = express();
app.use(express.json());

// ✅ Setup Multer Middleware (Mock)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes for testing
app.post("/api/referrals", create);
app.get("/api/referrals", fetch);
app.put("/api/referrals/:id", update);
app.delete("/api/referrals/:id", destroy);

describe("Referral Controller", () => {
  test("returns 400 if required fields are missing on create", async () => {
    const response = await request(app).post("/api/referrals").send({
      first_name: "John",
      last_name: "Doe",
      email: "", // Missing email
      phone: "1234567890",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("returns 201 and creates referral successfully", async () => {
    const response = await request(app).post("/api/referrals").send({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("john@example.com");
  });

  test("returns 400 if email already exists", async () => {
    await request(app).post("/api/referrals").send({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    const response = await request(app).post("/api/referrals").send({
      first_name: "Jane",
      last_name: "Doe",
      email: "john@example.com", // Duplicate email
      prefix: "+1",
      phone: 9876543210,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Email already exists!");
  });

  test("fetches all referrals", async () => {
    const response = await request(app).get("/api/referrals");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("returns 400 if invalid ID is used for update", async () => {
    const response = await request(app).put("/api/referrals/invalid").send({
      first_name: "Updated",
      last_name: "Doe",
      email: "john@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid referral ID");
  });

  test("returns 404 if referral not found for update", async () => {
    const response = await request(app).put("/api/referrals/999").send({
      first_name: "Updated",
      last_name: "Doe",
      email: "john@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Referral not found");
  });

  test("successfully updates a referral", async () => {
    const createResponse = await request(app).post("/api/referrals").send({
      first_name: "Jake",
      last_name: "Smith",
      email: "jake@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    const response = await request(app)
      .put(`/api/referrals/${createResponse.body.id}`)
      .send({ 
        first_name: "Updated",
        last_name: "Smith",
        email: "jake@example.com",
        prefix: "+1",
        phone: 1234567890,
      });

    expect(response.status).toBe(201);
  });

  test("returns 400 if invalid ID is used for delete", async () => {
    const response = await request(app).delete("/api/referrals/invalid");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid referral ID");
  });

  test("returns 404 if referral not found for delete", async () => {
    const response = await request(app).delete("/api/referrals/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Referral not found");
  });

  test("successfully deletes a referral", async () => {
    const createResponse = await request(app).post("/api/referrals").send({
      first_name: "Delete",
      last_name: "Me",
      email: "deleteme@example.com",
      prefix: "+1",
      phone: 1234567890,
    });

    const response = await request(app).delete(
      `/api/referrals/${createResponse.body.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Referral deleted successfully"
    );
  });
});

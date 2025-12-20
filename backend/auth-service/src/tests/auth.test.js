/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcryptjs";

process.env.SECRET_KEY_JWT = "test-secret";

// 🔥 MOCK ANTES DE IMPORTAR APP
jest.unstable_mockModule("../database/db.js", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// ⬇️ IMPORTS DESPUÉS DEL MOCK
const { prisma } = await import("../database/db.js");
const { default: app } = await import("../app.js");

describe("AUTH /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("❌ 422 - error de validación", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "", password: "" });

    expect(res.status).toBe(422);
  });

  test("❌ 401 - usuario no existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.status).toBe(401);
  });

  test("✅ 200 - login exitoso", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: await bcrypt.hash("123456", 10),
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

describe("AUTH /relogin", () => {
  test("❌ 401 - sin token", async () => {
    const res = await request(app).get("/api/v1/auth/relogin");
    expect(res.status).toBe(401);
  });

  test("✅ 200 - token válido", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: await bcrypt.hash("123456", 10),
    });

    // Login primero
    const login = await request(app).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    const token = login.body.data.token.token;

    const res = await request(app)
      .get("/api/v1/auth/relogin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

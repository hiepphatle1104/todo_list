import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.js";

describe("Login Route", () => {
	let testUser;

	beforeAll(async () => {
		// Connect to database
		await mongoose.connect(process.env.MONGO_URI);

		// Create test user
		testUser = await User.create({
			username: "tester",
			email: "tester@gmail.com",
			password: "password123",
		});
	});

	afterAll(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	});

	test("Đăng nhập thành công và trả về token", async () => {
		const res = await request(app)
			.post("/api/auth/sign-in")
			.send({ email: "tester@gmail.com", password: "password123" });

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("token");
		expect(res.body.message).toBe("Sign in successfully!");
	});

	test("Sai mật khẩu và trả về lỗi", async () => {
		const res = await request(app)
			.post("/api/auth/sign-in")
			.send({ email: "tester@gmail.com", password: "wrongpass" });

		expect(res.status).toBe(401);
		expect(res.body.message).toBe("Invalid credentials!");
	});

	test("Tài khoản không tồn tại", async () => {
		const res = await request(app)
			.post("/api/auth/sign-in")
			.send({ email: "tester1@gmail.com", password: "password123" });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("User not found!");
	});

	test("Thiếu mail", async () => {
		const res = await request(app)
			.post("/api/auth/sign-in")
			.send({ password: "password123" });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Email field is missing");
	});

	test("Thiếu password", async () => {
		const res = await request(app)
			.post("/api/auth/sign-in")
			.send({ email: "tester1@mail.com" });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("Password field is missing");
	});
});

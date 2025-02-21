import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Authentication Testing Tool", () => {
	// Connect to database
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	});

	// Sign up route
	describe("Sign-up Route", () => {
		// Validate data
		describe("Missing fields", () => {
			// Missing username
			test("Missing username field", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					email: "phatlee1104@gmail.com",
					password: "phat12312@P",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});

			// Missing email
			test("Missing email field", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					username: "hphats",
					password: "phat12312@P",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});

			// Missing password
			test("Missing password field", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					username: "hphats",
					email: "phatlee1104@gmail.com",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});

			// Missing character
			test("Missing character", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					username: "h",
					email: "phatlee1104@gmail.com",
					password: "phat12312@P",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});
		});

		describe("Account", () => {
			// Create account
			test("Create account", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					username: "hphats",
					email: "phatlee1104@gmail.com",
					password: "phat12312@P",
				});

				expect(res.status).toBe(201);
				expect(res.body.message).toBe("User is created!");
			});

			// User exist
			test("User exist", async () => {
				const res = await request(app).post("/api/auth/sign-up").send({
					username: "hphats",
					email: "phatlee1104@gmail.com",
					password: "phat12312@P",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("User already exist!");
			});
		});
	});

	// Sign in route
	describe("Sign-in Route", () => {
		// Missing fields
		describe("Missing fields", () => {
			// Missing email
			test("Missing email field", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					password: "phat12312@P",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});

			// Missing password
			test("Missing password field", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					email: "phatlee1104@gmail.com",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});

			// Missing character
			test("Missing character field", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					email: "phatlee1104@gmail.com",
					password: "pha",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Validate failed!");
			});
		});

		// Account
		describe("Account", () => {
			// User not exist
			test("User not exist", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					email: "tester@gmail.com",
					password: "tester@P",
				});

				expect(res.status).toBe(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("User not found!");
			});

			// Wrong password
			test("Wrong password", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					email: "phatlee1104@gmail.com",
					password: "phat12312",
				});

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Invalid credentials!");
			});

			// Success
			test("Success sign in", async () => {
				const res = await request(app).post("/api/auth/sign-in").send({
					email: "phatlee1104@gmail.com",
					password: "phat12312@P",
				});
				expect(res.status).toBe(200);
				expect(res.body.token).toBeDefined();
				expect(res.body.message).toBe("Sign in successfully!");
			});
		});
	});
});

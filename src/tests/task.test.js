import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";

describe("Tasks Testing Tool", () => {
	let testUser;
	let token;
	let testTask;

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);

		// Create user
		testUser = await User.create({
			username: "hphats",
			email: "phatlee1104@gmail.com",
			password: "phat12312@P",
		});

		// Create task
		testTask = await Task.create({
			title: "It's ok",
			content: "1234123asdfhaksf",
			status: "done",
			userId: testUser._id,
		});

		token = await testUser.createToken();
	});

	afterAll(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	});

	describe("Missing data", () => {
		test("Missing title", async () => {
			const res = await request(app)
				.post("/api/tasks")
				.send({
					content: "absadasdskjhfahsldjkfhsd",
					status: "done",
				})
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Missing some fields");
		});

		test("Missing content", async () => {
			const res = await request(app)
				.post("/api/tasks")
				.send({
					title: "Actually, Backend is really hard",
					status: "done",
				})
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Missing some fields");
		});

		test("Missing status", async () => {
			const res = await request(app)
				.post("/api/tasks")
				.send({
					title: "Actually, Backend is really hard",
					content: "absadasdskjhfahsldjkfhsd",
				})
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Missing some fields");
		});
	});

	describe("Session", () => {
		// Unauthorized
		test("Not have session", async () => {
			const res = await request(app).post("/api/tasks").send({
				title: "Actually, Backend is really hard",
				content: "absadasdskjhfahsldjkfhsd",
				status: "done",
			});

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Unauthorized!");
		});
	});

	describe("Tasks", () => {
		// Create
		describe("Create", () => {
			// Create new task
			test("Success", async () => {
				const res = await request(app)
					.post("/api/tasks")
					.send({
						title: "Actually, Backend is really hard",
						content: "absadasdskjhfahsldjkfhsd",
						status: "done",
					})
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(201);
				expect(res.body.message).toBe("Task is created!");
			});

			test("Failed", async () => {
				const res = await request(app)
					.post("/api/tasks")
					.send({
						title: "Actually, Backend is really hard",
						content: "absadasdskjhfahsldjkfhsd",
						status: "ok",
					})
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Missing some fields");
			});
		});

		// Update
		describe("Update", () => {
			test("Success", async () => {
				const res = await request(app)
					.put(`/api/tasks/${testTask._id}`)
					.send({
						title: "It's ok",
						content: "absadasdskjhfahsldjkfhsd",
						status: "in_progress",
					})
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(200);
				expect(res.body.message).toBe("Task is updated!");
			});

			test("Failed", async () => {
				const res = await request(app)
					.put(`/api/tasks/${testTask._id}`)
					.send({
						title: "It's ok",
						content: "absadasdskjhfahsldjkfhsd",
						status: "ok",
					})
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Missing some fields");
			});
		});

		// Delete
		describe("Delete", () => {
			test("Success", async () => {
				const res = await request(app)
					.delete(`/api/tasks/${testTask._id}`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(200);
				expect(res.body.message).toBe("Task is deleted!");
			});

			test("Failed", async () => {
				const res = await request(app)
					.delete(`/api/tasks/67b89a6f1e565c385230208e`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.status).toBe(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("Task not found!");
			});
		});
	});
});

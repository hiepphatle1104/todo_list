import { z } from "zod";

const signUpValidate = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
});

const signInValidate = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
});

const taskValidate = z.object({
  title: z.string().min(3, "Title phải có ít nhất 3 ký tự"),
  status: z.enum(["done", "in-progress", "todo", "on-hold"]).default("todo"),
  deadline: z.coerce.date(),
});

export { signUpValidate, signInValidate, taskValidate };

const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "invalid email format" })
    .min(3, { message: "email must be at least 3 characters long" })
    .max(20, { message: "email must be at most 20 characters long" }),

  password: z
    .string({ required_error: "password is required" }) 
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
      message:
        "password must be at least 6 characters long and contain at least one letter, one symbol and one number",
    })
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/, {
      message: "password must not contain spaces",
    })
    .min(6, { message: "password must be at least 6 characters long" })
    .max(10, { message: "password must be at most 10 characters long" }),
});

module.exports = loginSchema;

const addcustomerschema=z.object({
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "invalid email format" })
    .min(3, { message: "email must be at least 3 characters long" })
    .max(20, { message: "email must be at most 20 characters long" }),

  password: z
    .string({ required_error: "password is required" }) 
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
      message:
        "password must be at least 6 characters long and contain at least one letter, one symbol and one number",
    })
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/, {
      message: "password must not contain spaces",
    })
    .min(6, { message: "password must be at least 6 characters long" })
    .max(10, { message: "password must be at most 10 characters long" }),

  firstname:z
  .string({required_error:"firstname is required"})
  .trim()
  .min(3, { message: "firstname must be at least 3 characters long" })
  .max(20, { message: "firstname must be at most 20 characters long" }),

  lastname:z
  .string({required_error:"firstname is required"})
  .trim()
  .min(3, { message: "lastname must be at least 3 characters long" })
  .max(20, { message: "lastname must be at most 20 characters long" }),
  
  customeremployee:z
  .string({required_error:" customeremployee is required"})
  .trim()
  .min(3, { message: " customeremployee must be at least 3 characters long" })
  .max(20, { message: " customeremployee must be at most 20 characters long" }),
  
  customerid:z
  .string({required_error:" customerid is required"})
  .trim()
  .min(3, { message: " customerid must be at least 3 characters long" })
  .max(20, { message: " customerid must be at most 20 characters long" }),
})
module.exports = addcustomerschema;

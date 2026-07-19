// src/schemas/auth.ts
import { z } from "zod";
var LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});
export {
  LoginSchema
};
//# sourceMappingURL=index.js.map
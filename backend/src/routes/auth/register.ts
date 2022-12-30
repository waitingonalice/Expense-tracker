import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { register, sendEmailVerification } from "~/middleware";
import { RegisterProps } from "~/types/register";
import { Rest, isEmptyObjectValue } from "~/utils";

const router = Rest.express.Router();

router.post("/", async (req: Request, res: Response) => {
  const body: RegisterProps = req.body;
  try {
    if (isEmptyObjectValue(body))
      return res.status(400).json({ message: "400002" });
    const registerData = await register(body);
    await sendEmailVerification(registerData);
    return res.json({ data: registerData, message: "200001" });
  } catch (err: unknown) {
    //to catch prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return res.status(400).json({ message: "400001" });
      }
    }
    return res.status(500).json({ message: "500000" });
  }
});

export { router as registerRoute };
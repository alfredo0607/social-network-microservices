/* eslint-disable no-unused-vars */
import ezpress from "express";
import { body, validationResult } from "express-validator";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import bcrypt from "bcrypt";
import { prisma } from "../database/db.js";
import { checkToken, CreateTokenUser } from "../JWT/index.js";

const routerAuth = ezpress.Router();

routerAuth.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .bail()
      .isEmail()
      .withMessage("El email no tiene un formato válido")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .bail()
      .isString()
      .withMessage("La contraseña debe ser texto")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      return res
        .status(422)
        .json(formatResponse({}, formatErrorValidator(resultErrors)));
    }

    try {
      const { email, password } = req.body;

      const userExist = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          alias: true,
          birthDate: true,
          createdAt: true,
          password: true,
        },
      });

      if (!userExist) {
        return res
          .status(401)
          .json(formatResponse({}, "Credenciales inválidas"));
      }

      const isValidPassword = await bcrypt.compare(
        password,
        userExist.password
      );

      if (!isValidPassword) {
        return res
          .status(401)
          .json(formatResponse({}, "Credenciales inválidas"));
      }

      const token = CreateTokenUser(userExist);

      const { password: _, ...userData } = userExist;

      return res.status(200).json(
        formatResponse(
          {
            message: "Login exitoso",
            token,
            data: userData,
          },
          ""
        )
      );
    } catch (error) {
      console.error("Login error:", error); // Mejor log
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

routerAuth.get("/relogin", checkToken, async (req, res) => {
  try {
    const { email } = req.user;

    const userExist = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        alias: true,
        birthDate: true,
        createdAt: true,
        password: true,
      },
    });

    if (!userExist) {
      return res.status(401).json(formatResponse({}, "Credenciales inválidas"));
    }

    const token = CreateTokenUser(userExist);

    const { password: _, ...userData } = userExist;

    return res.status(200).json({
      errores: "",
      data: { message: "Token validado con exito", token, data: userData },
    });
  } catch (error) {
    console.log(error);
    const errorFormated = formatErrorResponse(error);
    return res.status(500).json(errorFormated);
  }
});

export { routerAuth };

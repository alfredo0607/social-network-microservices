import express from "express";
import { validationResult, query, param } from "express-validator";
import { checkToken } from "../middlewares/index.js";
import moment from "moment";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { prisma } from "../database/db.js";

const expressUser = express.Router();

const validateGetAllUsers = [
  query("search")
    .optional()
    .isString()
    .withMessage("El parámetro de búsqueda debe ser texto")
    .trim()
    .escape(),
  query("sortBy")
    .optional()
    .isIn(["name", "alias", "createdAt", "id"])
    .withMessage("El campo para ordenar no es válido"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("El orden debe ser 'asc' o 'desc'"),
];

const validateGetUserById = [
  param("userId")
    .notEmpty()
    .withMessage("El ID del usuario es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario debe ser un número entero positivo")
    .toInt(),
];

// Obtener todos los usuarios (sin paginación)
expressUser.get(
  "/get-all-users",
  checkToken,
  validateGetAllUsers,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { search, sortBy = "name", order = "asc" } = req.query;

      const whereClause = {};

      if (search) {
        whereClause.OR = [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            alias: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          alias: true,
          birthDate: true,
          createdAt: true,
          _count: {
            select: {
              Post: true,
              Like: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order,
        },
      });

      const formattedUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        alias: user.alias,
        birthDate: moment(user.birthDate)
          .locale("es")
          .format("DD[,] MMM [del] YYYY"),
        createdAt: moment(user.createdAt)
          .locale("es")
          .format("DD[,] MMM [del] YYYY"),
        postCount: user._count.Post,
        likeCount: user._count.Like,
        age: user.birthDate
          ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
          : null,
      }));

      return res.status(200).json(
        formatResponse(
          {
            users: formattedUsers,
            totalUsers: formattedUsers.length,
            filters: {
              search: search || null,
              sortBy,
              order,
            },
            message: "Usuarios obtenidos exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

// Obtener un usuario específico por ID
expressUser.get(
  "/get-user/:userId",
  checkToken,
  validateGetUserById,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        select: {
          id: true,
          email: true,
          name: true,
          alias: true,
          birthDate: true,
          createdAt: true,
          _count: {
            select: {
              Post: true,
              Like: true,
            },
          },
        },
      });

      if (!user) {
        return res
          .status(404)
          .json(formatResponse({}, "Usuario no encontrado"));
      }

      const formattedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        alias: user.alias,
        birthDate: moment(user.birthDate)
          .locale("es")
          .format("DD[,] MMM [del] YYYY"),
        createdAt: moment(user.createdAt)
          .locale("es")
          .format("DD[,] MMM [del] YYYY"),
        age: user.birthDate
          ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
          : null,
        stats: {
          totalPosts: user._count.Post,
          totalLikes: user._count.Like,
        },
      };

      return res.status(200).json(
        formatResponse(
          {
            user: formattedUser,
            message: "Usuario obtenido exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

// Buscar usuarios por nombre o alias
expressUser.get(
  "/search-users",
  checkToken,
  [
    query("q")
      .notEmpty()
      .withMessage("El término de búsqueda es requerido")
      .isString()
      .withMessage("El término de búsqueda debe ser texto")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El término de búsqueda debe tener al menos 2 caracteres"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("El límite debe ser un número entre 1 y 50")
      .toInt(),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { q, limit = 20 } = req.query;
      const limitNumber = parseInt(limit);

      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              alias: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          alias: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              Post: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        take: limitNumber,
      });

      const formattedResults = users.map((user) => ({
        id: user.id,
        name: user.name,
        alias: user.alias,
        email: user.email,
        memberSince: user.createdAt,
        postCount: user._count.Post,
      }));

      return res.status(200).json(
        formatResponse(
          {
            results: formattedResults,
            totalResults: formattedResults.length,
            searchQuery: q,
            message: "Búsqueda de usuarios completada",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

export default expressUser;

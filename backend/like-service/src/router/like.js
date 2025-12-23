import express from "express";
import { validationResult, body, query, param } from "express-validator";
import { checkToken } from "../middlewares/index.js";
import moment from "moment";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { prisma } from "../database/db.js";

const routeLike = express.Router();

const validateLike = [
  body("postId")
    .notEmpty()
    .withMessage("El ID del post es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del post debe ser un número entero positivo")
    .toInt(),

  body("userId")
    .notEmpty()
    .withMessage("El ID del usuario es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario debe ser un número entero positivo")
    .toInt(),
];

// Agregar o quitar like a una publicación
routeLike.post(
  "/create-or-delete-like",
  checkToken,
  validateLike,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { postId, userId } = req.body;

      const postExists = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!postExists) {
        return res
          .status(404)
          .json(formatResponse({}, "La publicación no existe"));
      }

      const existingLike = await prisma.like.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });

      let action;
      let like;

      if (existingLike) {
        like = await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        action = "removed";
      } else {
        like = await prisma.like.create({
          data: {
            postId: postId,
            userId: userId,
          },
          include: {
            User: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });
        action = "added";
      }

      const likeCount = await prisma.like.count({
        where: {
          postId: postId,
        },
      });

      return res.status(200).json(
        formatResponse(
          {
            like: action === "added" ? like : null,
            action: action,
            likeCount: likeCount,
            message: `Like ${
              action === "added" ? "agregado" : "eliminado"
            } exitosamente`,
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al manejar like:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

// Obtener usuarios que dieron like a un post
routeLike.get(
  "/post/:postId/users",
  [
    param("postId")
      .notEmpty()
      .withMessage("El ID del post es requerido en la URL")
      .isInt({ min: 1 })
      .withMessage("El ID del post debe ser un número entero positivo")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser un número entre 1 y 100")
      .toInt(),
    checkToken,
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { postId } = req.params;
      const { limit = 20 } = req.query;
      const limitNumber = parseInt(limit);

      // Verificar si el post existe
      const postExists = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
      });

      if (!postExists) {
        return res
          .status(404)
          .json(formatResponse({}, "La publicación no existe"));
      }

      const usersWhoLiked = await prisma.like.findMany({
        where: {
          postId: parseInt(postId),
        },
        include: {
          User: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limitNumber,
      });

      const formattedUsers = usersWhoLiked.map((like) => ({
        ...like.User,
        likedAt: moment(like.createdAt)
          .locale("es")
          .format("DD[,] MMM [del] YYYY [a las] HH:mm:ss"),
      }));

      return res.status(200).json(
        formatResponse(
          {
            users: formattedUsers,
            totalUsers: formattedUsers.length,
            message: "Usuarios que dieron like obtenidos exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener usuarios que dieron like:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

export default routeLike;

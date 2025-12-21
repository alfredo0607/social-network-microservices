import express from "express";
import { validationResult, query, param, body } from "express-validator";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helpers/errorFormatter.js";
import { prisma } from "../database/db.js";
import { checkToken } from "../middlewares/index.js";
import moment from "moment";

const routerPost = express.Router();

const validateUserExists = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) {
    throw new Error("El usuario no existe");
  }
  return true;
};

// Obtener posts con paginación
routerPost.get(
  "/get-posts-paginated",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La página debe ser un número entero mayor a 0")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser un número entre 1 y 100")
      .toInt(),
    query("userId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El ID de usuario debe ser un número válido")
      .toInt(),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "likeCount", "id"])
      .withMessage("El campo para ordenar no es válido"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("El orden debe ser 'asc' o 'desc'"),
    checkToken,
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const {
        page = 1,
        limit = 10,
        userId,
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const currentUserId = req.user.id;

      const whereClause = {};
      if (userId) {
        whereClause.userId = parseInt(userId);
      }

      let orderByClause = {};
      if (sortBy === "likeCount") {
        orderByClause = { createdAt: order };
      } else {
        orderByClause = { [sortBy]: order };
      }

      const skip = (pageNumber - 1) * limitNumber;

      const posts = await prisma.post.findMany({
        where: whereClause,
        include: {
          User: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          PostImage: true,
          Like: {
            where: {
              userId: currentUserId,
            },
            select: {
              id: true,
              userId: true,
              createdAt: true,
            },
          },
        },
        orderBy: orderByClause,
        skip: skip,
        take: limitNumber,
      });

      const totalPosts = await prisma.post.count({
        where: whereClause,
      });

      const postsWithLikeInfo = await Promise.all(
        posts.map(async (post) => {
          const totalLikes = await prisma.like.count({
            where: {
              postId: post.id,
            },
          });

          const userLiked = post.Like.length > 0;

          return {
            ...post,
            createdAt: moment(post.createdAt)
              .locale("es")
              .format("DD[,] MMM [del] YYYY"),
            likeCount: totalLikes,
            userHasLiked: userLiked,
            userLike: userLiked ? post.Like[0] : null,
          };
        })
      );

      return res.status(200).json(
        formatResponse(
          {
            posts: postsWithLikeInfo,
            pagination: {
              totalPosts,
              totalPages: Math.ceil(totalPosts / limitNumber),
              currentPage: pageNumber,
              hasNextPage: pageNumber < Math.ceil(totalPosts / limitNumber),
              hasPreviousPage: pageNumber > 1,
              limit: limitNumber,
            },
            filters: {
              userId: userId || null,
              sortBy,
              order,
            },
            message: "Posts obtenidos exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener posts paginados:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

// Obtener posts de un usuario específico
routerPost.get(
  "/get-posts-by-user/:userId",
  [
    param("userId")
      .notEmpty()
      .withMessage("El ID de usuario es requerido")
      .isInt({ min: 1 })
      .withMessage("El ID de usuario debe ser un número válido")
      .toInt()
      .custom(async (userId) => {
        return await validateUserExists(userId);
      }),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La página debe ser un número entero mayor a 0")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("El límite debe ser un número entre 1 y 50")
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
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
          where: {
            userId: parseInt(userId),
          },
          include: {
            User: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            PostImage: true,
            Like: {
              where: {
                userId: parseInt(userId),
              },
              select: {
                id: true,
                userId: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: skip,
          take: limitNumber,
        }),

        prisma.post.count({
          where: {
            userId: parseInt(userId),
          },
        }),
      ]);

      const postsWithLikeInfo = await Promise.all(
        posts.map(async (post) => {
          const totalLikes = await prisma.like.count({
            where: {
              postId: post.id,
            },
          });

          const userLiked = post.Like.length > 0;

          return {
            ...post,
            createdAt: moment(post.createdAt)
              .locale("es")
              .format("DD[,] MMM [del] YYYY"),
            likeCount: totalLikes,
            userHasLiked: userLiked,
            userLike: userLiked ? post.Like[0] : null,
          };
        })
      );

      return res.status(200).json(
        formatResponse(
          {
            posts: postsWithLikeInfo,
            pagination: {
              totalPosts,
              totalPages: Math.ceil(totalPosts / limitNumber),
              currentPage: pageNumber,
              hasNextPage: pageNumber < Math.ceil(totalPosts / limitNumber),
              hasPreviousPage: pageNumber > 1,
              limit: limitNumber,
            },
            user: {
              id: parseInt(userId),
            },
            message: "Posts del usuario obtenidos exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener posts del usuario:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

// Create post
routerPost.post(
  "/create-post",
  [
    body("message")
      .notEmpty()
      .withMessage("El mensaje es requerido")
      .isString()
      .withMessage("El mensaje debe ser texto")
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage("El mensaje debe tener entre 1 y 2000 caracteres"),
    body("userId")
      .notEmpty()
      .withMessage("El ID de usuario es requerido")
      .isInt({ min: 1 })
      .withMessage("El ID de usuario debe ser un número válido")
      .toInt()
      .custom(async (userId) => {
        return await validateUserExists(userId);
      }),

    body("images")
      .optional()
      .isArray()
      .withMessage("Las imágenes deben ser un arreglo"),
    body("images.*.nameServer")
      .optional()
      .isString()
      .withMessage("El nombre del servidor debe ser texto"),
    body("images.*.nameClient")
      .optional()
      .isString()
      .withMessage("El nombre del cliente debe ser texto"),
    body("images.*.ext")
      .optional()
      .isString()
      .withMessage("La extensión debe ser texto"),
    body("images.*.size")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El tamaño debe ser un número válido"),
    checkToken,
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    try {
      const { message, userId, images = [] } = req.body;

      const newPost = await prisma.$transaction(async (prisma) => {
        const post = await prisma.post.create({
          data: {
            message,
            userId,
          },
        });

        if (images && images.length > 0) {
          const postImages = images.map((image) => ({
            nameServer: image.nameServer,
            nameClient: image.nameClient,
            ext: image.ext,
            size: image.size,
            postId: post.id,
          }));

          await prisma.postImage.createMany({
            data: postImages,
          });
        }

        const completePost = await prisma.post.findUnique({
          where: { id: post.id },
          include: {
            User: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            Like: {
              include: {
                User: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            PostImage: true,
          },
        });

        return completePost;
      });

      const postResponse = {
        ...newPost,
        createdAt: moment(newPost.createdAt)
          .locale("es")
          .format("DD[,] MMM [del] YYYY"),
        likeCount: newPost.Like.length,
      };

      return res.status(201).json(
        formatResponse(
          {
            post: postResponse,
            message: "Publicación creada exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al crear publicación:", error);

      if (error.code === "P2002") {
        return res
          .status(409)
          .json(
            formatResponse({}, "Ya existe una publicación con estos datos")
          );
      }

      if (error.code === "P2003") {
        return res
          .status(400)
          .json(formatResponse({}, "El usuario especificado no existe"));
      }

      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

export default routerPost;

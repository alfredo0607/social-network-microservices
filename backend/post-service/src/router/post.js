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

// Obtener todas las publicaciones con sus relaciones
routerPost.get("/get-all-posts", checkToken, async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  try {
    // Obtener todas las publicaciones con sus relaciones
    const posts = await prisma.post.findMany({
      include: {
        // Incluir información del usuario que creó el post
        User: {
          select: {
            id: true,
            email: true,
            // Añade aquí otros campos del usuario que quieras mostrar
          },
        },
        // Incluir los likes del post
        Like: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                // Añade aquí otros campos del usuario que dio like
              },
            },
          },
        },
        // Incluir las imágenes del post
        PostImage: true,
      },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación, más recientes primero
      },
    });

    // Formatear la respuesta para incluir el conteo de likes
    const postsWithLikeCount = posts.map((post) => ({
      ...post,
      likeCount: post.Like.length,
      // Puedes añadir más campos formateados aquí si es necesario
    }));

    return res.status(200).json(
      formatResponse(
        {
          posts: postsWithLikeCount,
          totalPosts: posts.length,
          message: "Posts obtenidos exitosamente",
        },
        ""
      )
    );
  } catch (error) {
    console.error("Error al obtener posts:", error);
    return res.status(500).json(formatErrorResponse(error));
  }
});

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

      // Construir objeto where dinámicamente
      const whereClause = {};
      if (userId) {
        whereClause.userId = parseInt(userId);
      }

      // Construir objeto orderBy dinámicamente
      let orderByClause = {};
      if (sortBy === "likeCount") {
        // Para ordenar por conteo de likes, necesitaríamos una consulta más compleja
        // Por ahora mantenemos el orden por createdAt
        orderByClause = { createdAt: order };
      } else {
        orderByClause = { [sortBy]: order };
      }

      const skip = (pageNumber - 1) * limitNumber;

      const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
          where: whereClause,
          include: {
            User: {
              select: {
                id: true,
                email: true,
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
          orderBy: orderByClause,
          skip: skip,
          take: limitNumber,
        }),
        prisma.post.count({
          where: whereClause,
        }),
      ]);

      const postsWithLikeCount = posts.map((post) => ({
        ...post,
        likeCount: post.Like.length,
      }));

      return res.status(200).json(
        formatResponse(
          {
            posts: postsWithLikeCount,
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

      const postsWithLikeCount = posts.map((post) => ({
        ...post,
        likeCount: post.Like.length,
      }));

      return res.status(200).json(
        formatResponse(
          {
            posts: postsWithLikeCount,
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

// Obtener un post específico por ID
routerPost.get(
  "/get-post/:postId",
  [
    param("postId")
      .notEmpty()
      .withMessage("El ID del post es requerido")
      .isInt({ min: 1 })
      .withMessage("El ID del post debe ser un número válido")
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

      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(postId),
        },
        include: {
          User: {
            select: {
              id: true,
              email: true,
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

      if (!post) {
        return res
          .status(404)
          .json(formatResponse({}, "El post no fue encontrado"));
      }

      const postWithLikeCount = {
        ...post,
        likeCount: post.Like.length,
      };

      return res.status(200).json(
        formatResponse(
          {
            post: postWithLikeCount,
            message: "Post obtenido exitosamente",
          },
          ""
        )
      );
    } catch (error) {
      console.error("Error al obtener el post:", error);
      return res.status(500).json(formatErrorResponse(error));
    }
  }
);

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
    // Validación opcional para imágenes si las envías en el mismo request
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

      // Crear la publicación con transacción para asegurar consistencia
      const newPost = await prisma.$transaction(async (prisma) => {
        // 1. Crear la publicación principal
        const post = await prisma.post.create({
          data: {
            message,
            userId,
          },
        });

        // 2. Si hay imágenes, crearlas y asociarlas al post
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

        // 3. Obtener la publicación completa con relaciones
        const completePost = await prisma.post.findUnique({
          where: { id: post.id },
          include: {
            User: {
              select: {
                id: true,
                email: true,
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

      // Formatear respuesta
      const postResponse = {
        ...newPost,
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

      // Manejo específico de errores de base de datos
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

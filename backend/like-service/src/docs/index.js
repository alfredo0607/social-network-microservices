const swaggerOptions = {
  openapi: "3.0.3",

  info: {
    title: "Like Service - Social Network Microservices",
    description: "API para gestión de likes en publicaciones de la red social.",
    version: "1.0.0",
    contact: {
      name: "Alfredo Jose Dominguez Hernandez",
      email: "alfredojosedominguezhernandez@gmail.com",
      url: "https://github.com/alfredo0607/social-network-microservices",
    },
  },

  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor local",
    },
  ],

  tags: [
    {
      name: "Likes",
      description: "Endpoints para gestión de likes en publicaciones",
    },
  ],

  paths: {
    "/api/v1/likes/create-or-delete-like": {
      post: {
        tags: ["Likes"],
        summary: "Agregar o eliminar like a una publicación",
        description:
          "Si el usuario ya dio like a la publicación, lo elimina. Si no, lo agrega.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LikeRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Like gestionado exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LikeSuccess",
                },
              },
            },
          },
          401: {
            description: "Token inválido o no proporcionado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Publicación no encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          422: {
            description: "Error de validación",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/likes/post/{postId}/users": {
      get: {
        tags: ["Likes"],
        summary: "Obtener usuarios que dieron like a un post",
        description:
          "Retorna la lista de usuarios que dieron like a una publicación específica",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            description: "ID de la publicación",
            schema: {
              type: "integer",
              minimum: 1,
              example: 123,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Límite de usuarios a retornar (máximo 100)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 20,
              example: 20,
            },
          },
        ],
        responses: {
          200: {
            description: "Lista de usuarios obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsersLikedResponse",
                },
              },
            },
          },
          401: {
            description: "Token inválido o no proporcionado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Publicación no encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          422: {
            description: "Error de validación en parámetros",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      LikeRequest: {
        type: "object",
        required: ["postId", "userId"],
        properties: {
          postId: {
            type: "integer",
            description: "ID de la publicación",
            example: 123,
          },
          userId: {
            type: "integer",
            description: "ID del usuario",
            example: 456,
          },
        },
      },

      UserLiked: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 456,
          },
          email: {
            type: "string",
            example: "usuario@ejemplo.com",
          },
          name: {
            type: "string",
            example: "Juan Pérez",
          },
          likedAt: {
            type: "string",
            description: "Fecha en formato legible cuando se dio el like",
            example: "05, Nov del 2024",
          },
        },
      },

      LikeData: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 789,
          },
          postId: {
            type: "integer",
            example: 123,
          },
          userId: {
            type: "integer",
            example: 456,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-11-05T10:30:00.000Z",
          },
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 456,
              },
              email: {
                type: "string",
                example: "usuario@ejemplo.com",
              },
              name: {
                type: "string",
                example: "Juan Pérez",
              },
            },
          },
        },
      },

      LikeSuccess: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              like: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/LikeData",
                  },
                  {
                    type: "null",
                  },
                ],
                description:
                  "Información del like creado (solo cuando action es 'added')",
              },
              action: {
                type: "string",
                enum: ["added", "removed"],
                example: "added",
              },
              likeCount: {
                type: "integer",
                description: "Número total de likes en la publicación",
                example: 42,
              },
              message: {
                type: "string",
                example: "Like agregado exitosamente",
              },
            },
          },
        },
      },

      UsersLikedResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/UserLiked",
                },
              },
              totalUsers: {
                type: "integer",
                description: "Número total de usuarios retornados",
                example: 15,
              },
              message: {
                type: "string",
                example: "Usuarios que dieron like obtenidos exitosamente",
              },
            },
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "Credenciales inválidas",
          },
          data: {
            type: "object",
            example: {},
          },
        },
      },
    },
  },
};

export default swaggerOptions;

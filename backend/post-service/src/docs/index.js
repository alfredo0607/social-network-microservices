const swaggerOptions = {
  openapi: "3.0.3",

  info: {
    title: "Post Service - Social Network Microservices",
    description: "API para gestión de publicaciones en la red social.",
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
      name: "Publicaciones",
      description: "Endpoints para gestión de publicaciones",
    },
  ],

  paths: {
    "/api/v1/posts/get-posts-paginated": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener publicaciones con paginación",
        description:
          "Retorna una lista paginada de publicaciones con opciones de filtrado y ordenamiento",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            description: "Número de página",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
              example: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Límite de publicaciones por página (máximo 100)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              example: 10,
            },
          },
          {
            name: "userId",
            in: "query",
            required: false,
            description: "Filtrar por ID de usuario",
            schema: {
              type: "integer",
              minimum: 1,
              example: 123,
            },
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            description: "Campo por el cual ordenar",
            schema: {
              type: "string",
              enum: ["createdAt", "likeCount", "id"],
              default: "createdAt",
              example: "createdAt",
            },
          },
          {
            name: "order",
            in: "query",
            required: false,
            description: "Orden de los resultados",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
              example: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "Publicaciones obtenidas exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedPostsResponse",
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

    "/api/v1/posts/get-posts-by-user/{userId}": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener publicaciones de un usuario específico",
        description: "Retorna las publicaciones de un usuario con paginación",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "integer",
              minimum: 1,
              example: 123,
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Número de página",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
              example: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Límite de publicaciones por página (máximo 50)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 50,
              default: 10,
              example: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Publicaciones del usuario obtenidas exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserPostsResponse",
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
            description: "Usuario no encontrado",
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

    "/api/v1/posts/create-post": {
      post: {
        tags: ["Publicaciones"],
        summary: "Crear una nueva publicación",
        description:
          "Crea una nueva publicación con texto opcionalmente imágenes",
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
                $ref: "#/components/schemas/CreatePostRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Publicación creada exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreatePostResponse",
                },
              },
            },
          },
          400: {
            description: "Usuario no existe",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
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
          409: {
            description:
              "Conflicto - Ya existe una publicación con estos datos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          422: {
            description: "Error de validación en el cuerpo de la petición",
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
      CreatePostRequest: {
        type: "object",
        required: ["message", "userId"],
        properties: {
          message: {
            type: "string",
            minLength: 1,
            maxLength: 2000,
            description: "Contenido de la publicación",
            example:
              "¡Hola mundo! Esta es mi primera publicación en la red social.",
          },
          userId: {
            type: "integer",
            minimum: 1,
            description: "ID del usuario que crea la publicación",
            example: 123,
          },
          images: {
            type: "array",
            description: "Array de imágenes opcionales para la publicación",
            items: {
              type: "object",
              properties: {
                nameServer: {
                  type: "string",
                  description: "Nombre del archivo en el servidor",
                  example: "image_123456789.jpg",
                },
                nameClient: {
                  type: "string",
                  description: "Nombre original del archivo",
                  example: "mi_foto.jpg",
                },
                ext: {
                  type: "string",
                  description: "Extensión del archivo",
                  example: "jpg",
                },
                size: {
                  type: "integer",
                  minimum: 1,
                  description: "Tamaño del archivo en bytes",
                  example: 102400,
                },
              },
            },
          },
        },
      },

      Image: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          nameServer: {
            type: "string",
            example: "image_123456789.jpg",
          },
          nameClient: {
            type: "string",
            example: "mi_foto.jpg",
          },
          ext: {
            type: "string",
            example: "jpg",
          },
          size: {
            type: "integer",
            example: 102400,
          },
          postId: {
            type: "integer",
            example: 456,
          },
        },
      },

      Post: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 456,
          },
          message: {
            type: "string",
            example: "¡Hola mundo! Esta es mi primera publicación.",
          },
          userId: {
            type: "integer",
            example: 123,
          },
          createdAt: {
            type: "string",
            description: "Fecha formateada en español",
            example: "05, Nov del 2024",
          },
          userHasLiked: {
            type: "boolean",
            description:
              "Indica si el usuario actual dio like a esta publicación",
            example: true,
          },
          likeCount: {
            type: "integer",
            description: "Número total de likes en la publicación",
            example: 42,
          },
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 123,
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
          PostImage: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Image",
            },
          },
        },
      },

      PaginationInfo: {
        type: "object",
        properties: {
          totalPosts: {
            type: "integer",
            description: "Número total de publicaciones",
            example: 150,
          },
          totalPages: {
            type: "integer",
            description: "Número total de páginas",
            example: 15,
          },
          currentPage: {
            type: "integer",
            description: "Página actual",
            example: 1,
          },
          hasNextPage: {
            type: "boolean",
            description: "Indica si hay más páginas",
            example: true,
          },
          hasPreviousPage: {
            type: "boolean",
            description: "Indica si hay páginas anteriores",
            example: false,
          },
          limit: {
            type: "integer",
            description: "Límite de publicaciones por página",
            example: 10,
          },
        },
      },

      PaginatedPostsResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Post",
                },
              },
              pagination: {
                $ref: "#/components/schemas/PaginationInfo",
              },
              filters: {
                type: "object",
                properties: {
                  userId: {
                    oneOf: [
                      { type: "integer", example: 123 },
                      { type: "null" },
                    ],
                  },
                  sortBy: {
                    type: "string",
                    example: "createdAt",
                  },
                  order: {
                    type: "string",
                    example: "desc",
                  },
                },
              },
              message: {
                type: "string",
                example: "Posts obtenidos exitosamente",
              },
            },
          },
        },
      },

      UserPostsResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Post",
                },
              },
              pagination: {
                $ref: "#/components/schemas/PaginationInfo",
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    example: 123,
                  },
                },
              },
              message: {
                type: "string",
                example: "Posts del usuario obtenidos exitosamente",
              },
            },
          },
        },
      },

      CreatePostResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              post: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    example: 456,
                  },
                  message: {
                    type: "string",
                    example: "¡Hola mundo! Esta es mi primera publicación.",
                  },
                  userId: {
                    type: "integer",
                    example: 123,
                  },
                  createdAt: {
                    type: "string",
                    example: "05, Nov del 2024",
                  },
                  likeCount: {
                    type: "integer",
                    example: 0,
                  },
                  User: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 123,
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
                  Like: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                  PostImage: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Image",
                    },
                  },
                },
              },
              message: {
                type: "string",
                example: "Publicación creada exitosamente",
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

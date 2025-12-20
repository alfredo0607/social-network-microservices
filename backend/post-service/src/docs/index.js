const swaggerOptions = {
  openapi: "3.0.3",

  info: {
    title: "Posts Service - Social Network Microservices",
    description:
      "API para la gestión de publicaciones (posts) en la plataforma de microservicios de red social. Permite crear, obtener, actualizar y eliminar publicaciones, así como manejar likes e imágenes asociadas.",
    version: "1.0.0",
    contact: {
      name: "Alfredo Jose Dominguez Hernandez",
      email: "alfredojosedominguezhernandez@gmail.com",
      url: "https://github.com/alfredo0607/social-network-microservices",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },

  servers: [
    {
      url: "http://localhost:3002", // Asumiendo que el servicio de posts corre en puerto diferente
      description: "Servidor local de posts",
    },
    {
      url: "https://api.ejemplo.com/posts",
      description: "Servidor de producción",
    },
  ],

  tags: [
    {
      name: "Publicaciones",
      description: "Endpoints para gestión de publicaciones (posts)",
    },
    {
      name: "Likes",
      description: "Endpoints para gestión de likes en publicaciones",
    },
    {
      name: "Imágenes",
      description: "Endpoints para gestión de imágenes en publicaciones",
    },
  ],

  paths: {
    // ==================== RUTAS DE PUBLICACIONES ====================

    "/api/posts/get-all-posts": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener todas las publicaciones",
        description:
          "Retorna todas las publicaciones del sistema con sus relaciones (usuario, likes, imágenes)",
        operationId: "getAllPosts",

        responses: {
          200: {
            description: "Lista de publicaciones obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PostsListResponse",
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

    "/api/posts/get-posts-paginated": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener publicaciones paginadas",
        description:
          "Retorna publicaciones con paginación, filtros y ordenamiento",
        operationId: "getPostsPaginated",

        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número de página",
            required: false,
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
            description: "Cantidad de elementos por página",
            required: false,
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
            description: "Filtrar por ID de usuario",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              example: 5,
            },
          },
          {
            name: "sortBy",
            in: "query",
            description: "Campo para ordenar los resultados",
            required: false,
            schema: {
              type: "string",
              enum: ["createdAt", "id"],
              default: "createdAt",
              example: "createdAt",
            },
          },
          {
            name: "order",
            in: "query",
            description: "Dirección del ordenamiento",
            required: false,
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
            description: "Publicaciones paginadas obtenidas exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedPostsResponse",
                },
              },
            },
          },
          422: {
            description: "Parámetros de consulta inválidos",
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

    "/api/posts/get-posts-by-user/{userId}": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener publicaciones por usuario",
        description: "Retorna todas las publicaciones de un usuario específico",
        operationId: "getPostsByUser",

        parameters: [
          {
            name: "userId",
            in: "path",
            description: "ID del usuario",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
          },
          {
            name: "page",
            in: "query",
            description: "Número de página",
            required: false,
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
            description: "Cantidad de elementos por página",
            required: false,
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
            description: "Parámetros inválidos",
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

    "/api/posts/get-post/{postId}": {
      get: {
        tags: ["Publicaciones"],
        summary: "Obtener publicación específica",
        description:
          "Retorna una publicación específica por su ID con todas sus relaciones",
        operationId: "getPostById",

        parameters: [
          {
            name: "postId",
            in: "path",
            description: "ID de la publicación",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 123,
            },
          },
        ],

        responses: {
          200: {
            description: "Publicación obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SinglePostResponse",
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
            description: "Parámetro inválido",
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

    // ==================== RUTAS DE LIKES (ejemplo de expansión futura) ====================

    "/api/posts/like/{postId}": {
      post: {
        tags: ["Likes"],
        summary: "Dar like a una publicación",
        description:
          "Registra un like del usuario autenticado a una publicación",
        operationId: "likePost",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "postId",
            in: "path",
            description: "ID de la publicación a la que se dará like",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
        ],

        responses: {
          200: {
            description: "Like registrado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Like registrado exitosamente",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "El usuario ya dio like a esta publicación",
          },
          404: {
            description: "Publicación no encontrada",
          },
          401: {
            description: "Usuario no autenticado",
          },
          500: {
            description: "Error interno del servidor",
          },
        },
      },
    },

    // ==================== RUTAS DE IMÁGENES (ejemplo de expansión futura) ====================

    "/api/posts/{postId}/images": {
      post: {
        tags: ["Imágenes"],
        summary: "Subir imagen a publicación",
        description: "Sube una o más imágenes a una publicación existente",
        operationId: "uploadPostImages",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "postId",
            in: "path",
            description: "ID de la publicación",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  images: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description: "Archivos de imagen a subir",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Imágenes subidas exitosamente",
          },
          404: {
            description: "Publicación no encontrada",
          },
          401: {
            description: "Usuario no autenticado o no autorizado",
          },
          500: {
            description: "Error interno del servidor",
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
        description: "JWT token obtenido del servicio de autenticación",
      },
    },

    schemas: {
      // ==================== MODELOS BASE ====================

      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "ID único del usuario",
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@ejemplo.com",
            description: "Email del usuario",
          },
          // Puedes agregar más campos del usuario según tu modelo
        },
      },

      Like: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "ID único del like",
          },
          userId: {
            type: "integer",
            example: 1,
            description: "ID del usuario que dio like",
          },
          postId: {
            type: "integer",
            example: 123,
            description: "ID de la publicación",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T12:00:00.000Z",
            description: "Fecha y hora del like",
          },
          User: {
            $ref: "#/components/schemas/User",
          },
        },
      },

      PostImage: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "ID único de la imagen",
          },
          nameServer: {
            type: "string",
            example: "image_12345.jpg",
            description: "Nombre del archivo en el servidor",
          },
          nameClient: {
            type: "string",
            example: "mi_foto.jpg",
            description: "Nombre original del archivo del cliente",
          },
          ext: {
            type: "string",
            example: "jpg",
            description: "Extensión del archivo",
          },
          size: {
            type: "integer",
            example: 1024576,
            description: "Tamaño del archivo en bytes",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T12:00:00.000Z",
            description: "Fecha y hora de subida",
          },
        },
      },

      Post: {
        type: "object",
        required: ["message", "userId"],
        properties: {
          id: {
            type: "integer",
            example: 123,
            description: "ID único de la publicación",
          },
          message: {
            type: "string",
            example: "¡Hola mundo! Esta es mi primera publicación.",
            description: "Contenido de la publicación",
          },
          userId: {
            type: "integer",
            example: 1,
            description: "ID del usuario creador",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T12:00:00.000Z",
            description: "Fecha y hora de creación",
          },
          User: {
            $ref: "#/components/schemas/User",
            description: "Información del usuario creador",
          },
          Like: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Like",
            },
            description: "Lista de likes de la publicación",
          },
          PostImage: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PostImage",
            },
            description: "Lista de imágenes de la publicación",
          },
        },
      },

      // ==================== SCHEMAS DE RESPUESTA ====================

      PostWithLikeCount: {
        allOf: [
          {
            $ref: "#/components/schemas/Post",
          },
          {
            type: "object",
            properties: {
              likeCount: {
                type: "integer",
                example: 42,
                description: "Número total de likes",
              },
            },
          },
        ],
      },

      PostsListResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
            description: "Cadena vacía si no hay errores",
          },
          data: {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PostWithLikeCount",
                },
              },
              totalPosts: {
                type: "integer",
                example: 150,
                description: "Número total de publicaciones",
              },
              message: {
                type: "string",
                example: "Posts obtenidos exitosamente",
              },
            },
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
                  $ref: "#/components/schemas/PostWithLikeCount",
                },
              },
              pagination: {
                type: "object",
                properties: {
                  totalPosts: {
                    type: "integer",
                    example: 150,
                  },
                  totalPages: {
                    type: "integer",
                    example: 15,
                  },
                  currentPage: {
                    type: "integer",
                    example: 1,
                  },
                  hasNextPage: {
                    type: "boolean",
                    example: true,
                  },
                  hasPreviousPage: {
                    type: "boolean",
                    example: false,
                  },
                  limit: {
                    type: "integer",
                    example: 10,
                  },
                },
              },
              filters: {
                type: "object",
                properties: {
                  userId: {
                    type: "integer",
                    nullable: true,
                    example: 5,
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
                  $ref: "#/components/schemas/PostWithLikeCount",
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
                    example: 1,
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

      SinglePostResponse: {
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
                $ref: "#/components/schemas/PostWithLikeCount",
              },
              message: {
                type: "string",
                example: "Post obtenido exitosamente",
              },
            },
          },
        },
      },

      PaginationInfo: {
        type: "object",
        properties: {
          totalPosts: {
            type: "integer",
            example: 25,
          },
          totalPages: {
            type: "integer",
            example: 3,
          },
          currentPage: {
            type: "integer",
            example: 1,
          },
          hasNextPage: {
            type: "boolean",
            example: true,
          },
          hasPreviousPage: {
            type: "boolean",
            example: false,
          },
          limit: {
            type: "integer",
            example: 10,
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "Credenciales inválidas",
            description: "Mensaje de error descriptivo",
          },
          data: {
            type: "object",
            example: {},
            description: "Objeto vacío o datos adicionales del error",
          },
        },
      },

      ValidationError: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "El parámetro 'page' debe ser un número entero mayor a 0",
          },
          data: {
            type: "object",
            example: {},
          },
        },
      },
    },

    // ==================== PARÁMETROS REUTILIZABLES ====================

    parameters: {
      pageParam: {
        name: "page",
        in: "query",
        description: "Número de página",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 1,
        },
      },
      limitParam: {
        name: "limit",
        in: "query",
        description: "Cantidad de elementos por página",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 10,
        },
      },
    },

    // ==================== RESPONSES REUTILIZABLES ====================

    responses: {
      UnauthorizedError: {
        description: "Token inválido o expirado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
          },
        },
      },
      NotFoundError: {
        description: "Recurso no encontrado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
          },
        },
      },
      ValidationError: {
        description: "Error de validación de parámetros",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ValidationError",
            },
          },
        },
      },
      ServerError: {
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

  // ==================== CONFIGURACIONES ADICIONALES ====================

  externalDocs: {
    description: "Documentación completa del proyecto",
    url: "https://github.com/alfredo0607/social-network-microservices",
  },
};

export default swaggerOptions;

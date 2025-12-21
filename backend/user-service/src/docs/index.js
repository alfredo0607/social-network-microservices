const swaggerOptions = {
  openapi: "3.0.3",

  info: {
    title: "User Service - Social Network Microservices",
    description: "API para gestión de usuarios en la red social.",
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
      name: "Usuarios",
      description: "Endpoints para gestión de usuarios",
    },
  ],

  paths: {
    "/api/v1/users/get-all-users": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener todos los usuarios",
        description:
          "Retorna la lista completa de usuarios con opciones de búsqueda y ordenamiento",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            description: "Término para buscar en nombre, alias o email",
            schema: {
              type: "string",
              example: "juan",
            },
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            description: "Campo por el cual ordenar los usuarios",
            schema: {
              type: "string",
              enum: ["name", "alias", "email", "createdAt", "birthDate"],
              default: "name",
              example: "name",
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
              default: "asc",
              example: "asc",
            },
          },
        ],
        responses: {
          200: {
            description: "Usuarios obtenidos exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AllUsersResponse",
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

    "/api/v1/users/get-user/{userId}": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener un usuario específico",
        description: "Retorna la información detallada de un usuario por su ID",
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
            description: "ID del usuario a obtener",
            schema: {
              type: "integer",
              minimum: 1,
              example: 123,
            },
          },
        ],
        responses: {
          200: {
            description: "Usuario obtenido exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SingleUserResponse",
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

    "/api/v1/users/search-users": {
      get: {
        tags: ["Usuarios"],
        summary: "Buscar usuarios",
        description:
          "Busca usuarios por nombre, alias o email con resultados limitados",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Término de búsqueda (mínimo 2 caracteres)",
            schema: {
              type: "string",
              minLength: 2,
              example: "juan",
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Límite de resultados (máximo 50)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 50,
              default: 20,
              example: 20,
            },
          },
        ],
        responses: {
          200: {
            description: "Búsqueda completada exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SearchUsersResponse",
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
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 123,
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@ejemplo.com",
          },
          name: {
            type: "string",
            example: "Juan Pérez",
          },
          alias: {
            type: "string",
            example: "juanito",
          },
          birthDate: {
            type: "string",
            description: "Fecha de nacimiento formateada en español",
            example: "15, Mar del 1990",
          },
          createdAt: {
            type: "string",
            description: "Fecha de creación formateada en español",
            example: "01, Ene del 2024",
          },
          age: {
            type: "integer",
            nullable: true,
            description: "Edad calculada a partir de la fecha de nacimiento",
            example: 34,
          },
          postCount: {
            type: "integer",
            description: "Número total de publicaciones del usuario",
            example: 25,
          },
          likeCount: {
            type: "integer",
            description: "Número total de likes dados por el usuario",
            example: 150,
          },
        },
      },

      UserStats: {
        type: "object",
        properties: {
          totalPosts: {
            type: "integer",
            example: 25,
          },
          totalLikes: {
            type: "integer",
            example: 150,
          },
        },
      },

      SearchResult: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 123,
          },
          name: {
            type: "string",
            example: "Juan Pérez",
          },
          alias: {
            type: "string",
            example: "juanito",
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@ejemplo.com",
          },
          memberSince: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00.000Z",
          },
          postCount: {
            type: "integer",
            example: 25,
          },
        },
      },

      AllUsersResponse: {
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
                  $ref: "#/components/schemas/User",
                },
              },
              totalUsers: {
                type: "integer",
                description: "Número total de usuarios retornados",
                example: 50,
              },
              filters: {
                type: "object",
                properties: {
                  search: {
                    oneOf: [
                      { type: "string", example: "juan" },
                      { type: "null" },
                    ],
                  },
                  sortBy: {
                    type: "string",
                    example: "name",
                  },
                  order: {
                    type: "string",
                    example: "asc",
                  },
                },
              },
              message: {
                type: "string",
                example: "Usuarios obtenidos exitosamente",
              },
            },
          },
        },
      },

      SingleUserResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              user: {
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
                  alias: {
                    type: "string",
                    example: "juanito",
                  },
                  birthDate: {
                    type: "string",
                    example: "15, Mar del 1990",
                  },
                  createdAt: {
                    type: "string",
                    example: "01, Ene del 2024",
                  },
                  age: {
                    type: "integer",
                    nullable: true,
                    example: 34,
                  },
                  stats: {
                    $ref: "#/components/schemas/UserStats",
                  },
                },
              },
              message: {
                type: "string",
                example: "Usuario obtenido exitosamente",
              },
            },
          },
        },
      },

      SearchUsersResponse: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/SearchResult",
                },
              },
              totalResults: {
                type: "integer",
                description: "Número total de resultados encontrados",
                example: 10,
              },
              searchQuery: {
                type: "string",
                description: "Término de búsqueda utilizado",
                example: "juan",
              },
              message: {
                type: "string",
                example: "Búsqueda de usuarios completada",
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

const swaggerOptions = {
  openapi: "3.0.3",

  info: {
    title: "services auth - social network microservices",
    description:
      "API de autenticación para la plataforma de microservicios de red social.",
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
      name: "Autenticación",
      description: "Endpoints de autenticación",
    },
  ],

  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Autenticación"],
        summary: "Login de usuario",
        description: "Autentica un usuario y retorna un token JWT",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login exitoso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginSuccess",
                },
              },
            },
          },
          401: {
            description: "Credenciales inválidas",
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

    "/api/v1/auth/relogin": {
      get: {
        tags: ["Autenticación"],
        summary: "Renovar token JWT",
        description: "Valida el token actual y retorna uno nuevo",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: "Token renovado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ReloginSuccess",
                },
              },
            },
          },
          401: {
            description: "Token inválido o expirado",
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
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "usuario@ejemplo.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "Password123",
          },
        },
      },

      UserResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "usuario@ejemplo.com" },
          name: { type: "string", example: "Juan Pérez" },
          alias: { type: "string", example: "juanito" },
          birthDate: {
            type: "string",
            format: "date",
            example: "1990-01-01",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00.000Z",
          },
        },
      },

      LoginSuccess: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Login exitoso",
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          data: {
            $ref: "#/components/schemas/UserResponse",
          },
        },
      },

      ReloginSuccess: {
        type: "object",
        properties: {
          errores: {
            type: "string",
            example: "",
          },
          data: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Token validado con exito",
              },
              token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
              data: {
                $ref: "#/components/schemas/UserResponse",
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

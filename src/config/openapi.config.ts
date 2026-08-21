import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin Template API Docs",
      version: "1.0.0",
      description:
        "Interactive OpenAPI documentation and API explorer for the Admin Template backend.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: env.API_BASE_URL + env.API_PREFIX,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "better-auth.session_token",
          description: "Better Auth session cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer Token authentication",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object", nullable: true },
            message: { type: "string", nullable: true },
            error: { type: "string", nullable: true },
          },
        },
        SignInEmailPayload: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@admin.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Admin@123456",
            },

            rememberMe: {
              type: "boolean",
              example: true,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: {
              type: "string",
              example: "Wireless Noise-Canceling Headphones",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Premium audio experience with active noise control",
            },
            price: { type: "number", example: 199.99 },
            stock: { type: "integer", example: 45 },
            slug: {
              type: "string",
              example: "wireless-noise-canceling-headphones",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateProductPayload: {
          type: "object",
          required: ["name", "price", "stock"],
          properties: {
            name: { type: "string", example: "Ergonomic Mechanical Keyboard" },
            description: {
              type: "string",
              example: "Custom hot-swappable RGB keyboard",
            },
            price: { type: "number", example: 129.5 },
            stock: { type: "integer", example: 20 },
            slug: { type: "string", example: "product-1" },
          },
        },
        UpdateProductPayload: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Ergonomic Mechanical Keyboard v2",
            },
            description: {
              type: "string",
              example: "Updated layout with wireless BT 5.2",
            },
            price: { type: "number", example: 149.99 },
            stock: { type: "integer", example: 35 },
          },
        },
      },
    },
  },
  apis: ["./src/core/route-handler/*.ts", "./src/modules/**/*.ts"],
};

export const openApiSpec = swaggerJSDoc(options);

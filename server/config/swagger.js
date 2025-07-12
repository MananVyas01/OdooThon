const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReWear API Documentation',
      version: '1.0.0',
      description: 'A comprehensive API for the ReWear sustainable fashion platform',
      contact: {
        name: 'ReWear Team',
        email: 'admin@rewear.com',
        url: 'https://github.com/MananVyas01/OdooThon'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server'
      },
      {
        url: 'https://api.rewear.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'manager', 'admin'],
              description: 'User role'
            },
            profilePicture: {
              type: 'string',
              description: 'Profile picture URL'
            },
            points: {
              type: 'number',
              description: 'User points balance'
            }
          }
        },
        Item: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Item ID'
            },
            title: {
              type: 'string',
              description: 'Item title'
            },
            description: {
              type: 'string',
              description: 'Item description'
            },
            category: {
              type: 'string',
              enum: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories', 'activewear', 'formal', 'casual'],
              description: 'Item category'
            },
            size: {
              type: 'string',
              description: 'Item size'
            },
            condition: {
              type: 'string',
              enum: ['new', 'like-new', 'good', 'fair', 'poor'],
              description: 'Item condition'
            },
            brand: {
              type: 'string',
              description: 'Item brand'
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' },
                  isPrimary: { type: 'boolean' }
                }
              }
            },
            uploader: {
              type: 'string',
              description: 'User ID of uploader'
            },
            availability: {
              type: 'string',
              enum: ['available', 'swapped', 'hidden'],
              description: 'Item availability status'
            },
            points: {
              type: 'number',
              description: 'Points value of item'
            }
          }
        },
        SwapRequest: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Swap request ID'
            },
            item: {
              type: 'string',
              description: 'Requested item ID'
            },
            requestedBy: {
              type: 'string',
              description: 'Requester user ID'
            },
            itemOwner: {
              type: 'string',
              description: 'Item owner user ID'
            },
            mode: {
              type: 'string',
              enum: ['swap', 'points'],
              description: 'Swap mode'
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
              description: 'Swap request status'
            },
            message: {
              type: 'string',
              description: 'Request message'
            },
            offeredItem: {
              type: 'string',
              description: 'Offered item ID (for swap mode)'
            },
            pointsOffered: {
              type: 'number',
              description: 'Points offered (for points mode)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #10b981 }
    `,
    customSiteTitle: "ReWear API Documentation"
  })
};

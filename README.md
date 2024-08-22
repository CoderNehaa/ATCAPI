ATCAPI-

├── dist/   
├── node_modules/   
├── public/   
│   ├── .gitkeep/  
├── src/   
│   ├── config/     
│   │   ├── config.ts                 
│   │   ├── db.connect.ts                # Database connection setup
│   ├── controllers/             # Controllers to handle requests
│   │   └── article.controller.ts  # article-related logic
│   │   └── chat.controller.ts  
│   │   └── keyword.controller.ts  # category-related logic
│   │   └── comment.controller.ts  # comment-related logic
│   │   ├── user.controller.ts     # User-related logic
│   ├── interfaces             
│   │   └── response.interface.ts
│   ├── middlewares/              # Custom middleware functions
│   │   ├── auth.middleware.ts     
│   │   ├── email.middleware.ts     # Nodemailer mail sending middleware
│   │   ├── errorHandler.middleware.ts     # error handling middleware
│   │   ├── jwt-token.middleware.ts     
│   │   ├── formValidation.middleware.ts     # email and password validation
│   ├── models/                  # Database models (if using ORM)
│   │   ├── article.model.ts          # article model definition
│   │   ├── chat.model.ts          # chat model definition
│   │   ├── comment.model.ts          # category model definition
│   │   ├── keyword.model.ts          # comment model definition
│   │   ├── user.model.ts          # User model definition
│   ├── routes/                  # Route definitions
│   │   ├── article.routes.ts         # articles routes
│   │   ├── chat.routes.ts         # chat routes
│   │   ├── comment.routes.ts         # comment routes
│   │   ├── keyword.routes.ts         # category routes
│   │   ├── index.ts         # main router given to main application file (index.ts)
│   │   ├── users.routes.ts         # User routes
│   ├── index.ts                   # Main application file
│   └── passport.ts                # google and Facebook auth
├── .env                # Environment variables
├── .gitignore               
├── package.json                  
├── package-lock.json                  
├── README.md                
├── swagger.json                 
└── tsconfig.json                         # TypeScript configuration
└── vercel.json                         

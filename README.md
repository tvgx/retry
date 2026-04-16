# Ecommerce Backend

A simple NestJS backend for an ecommerce shop, built to improve backend development skills.

## Features

- **Auth** — JWT-based registration & login
- **Users** — User profile management
- **Categories** — Product category CRUD
- **Products** — Product CRUD with category relation and stock management
- **Orders** — Order creation, item tracking, automatic stock deduction

## Tech Stack

- [NestJS](https://nestjs.com/) — Framework
- [TypeORM](https://typeorm.io/) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — ORM & SQLite database
- [Passport JWT](https://www.passportjs.org/) — Authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — Password hashing
- [class-validator](https://github.com/typestack/class-validator) — DTO validation

## Getting Started

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Run tests
npm test

# Build for production
npm run build
npm run start:prod
```

The server runs on `http://localhost:3000` by default.

## Environment Variables

| Variable        | Default                          | Description               |
|-----------------|----------------------------------|---------------------------|
| `PORT`          | `3000`                           | Server port               |
| `JWT_SECRET`    | `default_jwt_secret_change_me`   | JWT signing secret        |
| `DATABASE_PATH` | `ecommerce.db`                   | SQLite database file path |

> **Note:** Always set a strong `JWT_SECRET` in production.

## API Endpoints

### Auth
| Method | Path             | Description        | Auth |
|--------|------------------|--------------------|------|
| POST   | /auth/register   | Register new user  | No   |
| POST   | /auth/login      | Login              | No   |

### Users
| Method | Path             | Description        | Auth |
|--------|------------------|--------------------|------|
| GET    | /users/profile   | Get my profile     | Yes  |
| GET    | /users           | List all users     | Yes  |
| GET    | /users/:id       | Get user by ID     | Yes  |
| PATCH  | /users/:id       | Update user        | Yes  |
| DELETE | /users/:id       | Delete user        | Yes  |

### Categories
| Method | Path              | Description            | Auth |
|--------|-------------------|------------------------|------|
| GET    | /categories       | List all categories    | No   |
| GET    | /categories/:id   | Get category by ID     | No   |
| POST   | /categories       | Create category        | Yes  |
| PATCH  | /categories/:id   | Update category        | Yes  |
| DELETE | /categories/:id   | Delete category        | Yes  |

### Products
| Method | Path              | Description          | Auth |
|--------|-------------------|----------------------|------|
| GET    | /products         | List all products    | No   |
| GET    | /products/:id     | Get product by ID    | No   |
| POST   | /products         | Create product       | Yes  |
| PATCH  | /products/:id     | Update product       | Yes  |
| DELETE | /products/:id     | Delete product       | Yes  |

### Orders
| Method | Path          | Description                | Auth |
|--------|---------------|----------------------------|------|
| POST   | /orders       | Create order               | Yes  |
| GET    | /orders       | List all orders            | Yes  |
| GET    | /orders/my    | List my orders             | Yes  |
| GET    | /orders/:id   | Get order by ID            | Yes  |
| PATCH  | /orders/:id   | Update order status        | Yes  |
| DELETE | /orders/:id   | Delete order               | Yes  |

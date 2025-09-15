# El Postrino

A simple application for ordering custom desserts.

## Folder Structure

```
.el-postrino/
├── backend/         # Node.js/Express backend
│   ├── db/          # JSON files acting as a database
│   ├── node_modules/
│   ├── package.json
│   └── server.js
└── frontend/        # Vanilla JS frontend
    ├── assets/
    ├── index.html
    ├── script.js
    └── style.css
```

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```

2.  **Frontend:**
    Open the `frontend/index.html` file in your browser.

## API Endpoints

### Postres

-   `GET /postres`: Get a list of all available desserts.

### Toppings

-   `GET /toppings`: Get a list of all available toppings.

### Pedidos

-   `POST /pedidos`: Create a new order.
-   `GET /pedidos/:id`: Get a specific order by its ID.

### Usuarios

-   `POST /usuarios`: Create a new user.
-   `GET /usuarios/:id`: Get a specific user by their ID.
-   `GET /usuarios/:id/pedidos`: Get the order history for a specific user.

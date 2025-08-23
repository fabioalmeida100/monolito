# Monolith Sample
This is a sample project that implements the monolith architecture. The project is for study purposes.

# Approach

The project use modules to organize the code.

## Modules

- `client-adm`: Module to manage clients.
- `invoice`: Module to manage invoices.
- `payment`: Module to manage payments.
- `product-adm`: Module to manage products.
- `store-catalog`: Module to manage store catalog.

Furthermore, the project use facade and factory for give a better interface to the client use the modules.

## How to run

```bash
npm install
npm run test
```

## Technologies

- Node.js
- TypeScript
- Jest
- Sequelize

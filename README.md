# System Matching API

## Description

Develop a matching system that connects property requests with relevant ads based on specific criteria.
We have 3 resources
Property request: when you need to rent or buy a property you make a request on the application with your specific needs and there are real estate agents on the application they will contact you to get what you need
Ad: agents can create ads for clients who want to rent or buy a property
User:
client: the user who can make requests
Agent: the user who can make ads
Admin: a super admin who can do anything

## Installation

- Clone the repository to your local machine.

### Database Setup

- Open Mongo Shell

```bash
use admin
```

```javascript
db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
});
```

```bash
use matching_system
```

```javascript
db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'matching_system' }],
});
```

**Note:** The `.env.example` file contains environment variables that are used by the application to connect to the database and Redis server, as well as the session secret key. Please review the file carefully before using it, and make any necessary changes to ensure that it works with your specific environment.

### Project Setup

```bash
$ pnpm install
```

### Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

```

### Project Documentation

- Swagger

## License

Nest is [MIT licensed](LICENSE).

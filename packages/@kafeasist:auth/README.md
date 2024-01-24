# @kafeasist:auth

This is the authentication package of kafeasist. It is used to manage the authentication of the users of the website and the mobile application of kafeasist.

## Table of contents

- [About `kafeasist:auth`](#about-kafeasistauth)
  - [Architecture](#architecture)
  - [JWT](#jwt)
  - [argon2](#argon2)
- [Parameters](#parameters)
  - [Login](#login)
  - [Register](#register)
  - [Forgot Password](#forgot-password)
- [Response object](#response-object)
  - [success](#success)
  - [token](#token)
  - [session](#session)
  - [message](#message)
  - [fields](#fields)
- [How to use](#how-to-use)
  - [Usage](#usage)

## About `kafeasist:auth`

### Architecture

Following image shows the architecture of the authentication package:

<p align="center">
	<img src="./assets/authentication.png" alt="Architecture" height=400>
</p>

### JWT

[JWT](https://jwt.io/) is a standard for creating access tokens for authentication. [JWT](https://jwt.io/) is a JSON object that contains a header, a payload and a signature. The signature is used to verify the token. [JWT](https://jwt.io/) is signed with a secret key. The secret key is stored in the environment variables.

The reason why [JWT](https://jwt.io/) is used is because both the website and the mobile application of kafeasist are using the same authentication package, therefore [JWT](https://jwt.io/) connects the two applications.

### argon2

The authentication package uses [argon2](https://www.npmjs.com/package/argon2) to hash the passwords of the users. Reason why [argon2](https://www.npmjs.com/package/argon2) is used is because it is a modern hashing algorithm that is designed to be resistant to GPU cracking attacks and it is also memory-hard, which makes it resistant to ASIC-based attacks.

## Parameters

Both procedures `login` and `register` require parameters. Here is the list of the parameters required for each procedure:

### Login

| Parameter  | Description                | Type     |
| ---------- | -------------------------- | -------- |
| `email`    | E-mail address of the user | `string` |
| `password` | Password of the user       | `string` |

### Register

The parameters for the `register` procedure are validated using custom made validators. Here is the list of the parameters required for the `register` procedure:

| Parameter         | Description                  | Type     |
| ----------------- | ---------------------------- | -------- |
| `firstName`       | First name of the user       | `string` |
| `lastName`        | Last name of the user        | `string` |
| `phone`           | Phone number of the user     | `string` |
| `email`           | E-mail address of the user   | `string` |
| `password`        | Password of the user         | `string` |
| `confirmPassword` | Confirmation of the password | `string` |

If these parameters are not provided in the correct type, the procedure will throw an error.

### Forgot Password

| Parameter | Description        | Type     |
| --------- | ------------------ | -------- |
| `email`   | E-mail of the user | `string` |

## Response object

A response standard is used to make the response of the procedures consistent. `AuthResponse` was declared in the `types/` folder:

```typescript
type AuthResponse =
  | {
      success: true;
      token: string;
      session: Session;
    }
  | {
      success: false;
      message: string;
      fields: string | string[];
    };
```

### success

`success` is a boolean that indicates whether the procedure was successful or not. If `success` is `true`, the procedure was successful. If `success` is `false`, the procedure was not successful.

- If the `success` was provided as `true`, then the `token` and the `user` should be provided.

- If the `success` was provided as `false`, then the `message` and the `fields` should be provided.

### token

`token` is a string that contains the [JWT](https://jwt.io/) token. The token is used to authenticate the user.

- The token is provided only if the `success` is `true`.

### session

`session` is an object that contains the information of the user. The `session` object is declared as follows:

```typescript
type Session = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified: Date | null;
};
```

- The `session` object is provided only if the `success` is `true`.
- The returned `session` object will be stored properly according to the application.

### message

`message` is a string that contains the error message.

- The error message is provided only if the `success` is `false`.

### fields

`fields` is a string or an array of strings that contains the fields that caused the error.

- The fields are provided only if the `success` is `false`.

## How to use

### Usage

Import the desired procedure from the package:

```typescript
import { login } from "@kafeasist/auth";
// OR
import { register } from "@kafeasist/auth";
```

Await the response and do whatever you want with it:

```typescript
/** app.ts */
import { login } from "@kafeasist/auth";

const response = await login({
  email: "foo@bar.com",
  password: "Foobar123",
});

if (response.success) {
  // The user is authenticated
  ...
} else {
  // The user is not authenticated
  ...
}
```

[⬆ Back to top](#table-of-contents)

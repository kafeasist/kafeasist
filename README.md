<p align="center">
  <img src="https://user-images.githubusercontent.com/40398628/219168270-f14d82ed-1466-4cf2-9d2f-e02bdf00bce4.png" width="130" alt="Logo" />
</p>

<h1 align="center">
  kafeasist
</h1>

<p align="center">
  kafeasist is a café/restaurant/bar management software made with ❤️. kafeasist is a software as a service that you can subscribe to monthly or yearly and leave whenever you want. kafeasist makes managing your business much more simpler with easy-to-use dashboard. Keeps track of your data and stores it in a cloud server so you wouldn't lose any of it! With kafeasist, you won't need any other software to run your business.
</p>

<div align="center">

[![Build][build-shield]][build-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]

</div>

# Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [kafeasist Stack](#kafeasist-stack)
  - [Turborepo](#turborepo)
  - [apps/](#apps/)
  - [packages/](#packages/)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)

# Getting started

## Prerequisites

This codebase is a monorepo, so you need to install `pnpm` globally to use it.

- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [pnpm](https://pnpm.io/) (v8.x or higher)

## Installation

Install the dependencies using `pnpm`:

```bash
pnpm install
```

## Usage

To start the development server, run:

```bash
pnpm dev
```

# kafeasist Stack

kafeasist is a monorepo that uses [pnpm](https://pnpm.io/) workspaces and uses the following technologies:

| Technology                                            | Description                                           | Used in                   |
| ----------------------------------------------------- | ----------------------------------------------------- | ------------------------- |
| [TypeScript](https://www.typescriptlang.org/)         | Used for the main programming language of the project | `*`                       |
| [Turborepo](https://turbo.build/)                     | Used for managing the monorepo                        | `*`                       |
| [GitHub Actions](https://github.com/features/actions) | Used for the main CI pipeline for the project         | `*`                       |
| [Tailwind CSS](https://tailwindcss.com/)              | Used for styling both web and mobile applications     | `apps/`                   |
| [Next.js](https://nextjs.org/)                        | Powers the web application                            | `apps/www/`               |
| [Expo](https://expo.dev/)                             | Powers the mobile application                         | `apps/mobile/`            |
| [MySQL](https://www.mysql.com/)                       | Used for the main database of the project             | `packages/@kafeasist:db/` |
| [Prisma](https://www.prisma.io/)                      | Manages and generates SQL for the database            | `packages/@kafeasist:db/` |

The project is structured as follows:

<p align="center">
  <img src="https://user-images.githubusercontent.com/40398628/233666479-ba44a2c6-ab72-46ae-a759-aaed58db2e70.png" alt="kafeasist Stack" height=500 />
</p>

## Turborepo

[Turborepo](https://turbo.build/) is a tool that helps you manage your monorepo. It is used to manage the monorepo and to run the CI pipeline. It is also used to run the development server.

## apps/

For more information about the `apps/` folder, please check the [apps/](apps/) folder.

## packages/

For more information about the `packages/` folder, please check the [packages/](packages/) folder.

# Contributing

Contributions to the project is highly appreciated. If you have any suggestions/questions/requests please consider [opening an issue](https://github.com/kafeasist/kafeasist/issues/new). If you want to contribute to the project, fixing an open issue is greatly recommended and appreciated. To see the all contribution rules please check the [contribution rules](CONTRIBUTING.md).

# License

This project is licensed under `GNU General Public License v3.0` if you want to see more, please check [LICENSE](LICENSE) for more information.

# Maintainers

| Name      | E-Mail                                     | Twitter                                       |
| --------- | ------------------------------------------ | --------------------------------------------- |
| Ege Onder | 40398628+EgeOnder@users.noreply.github.com | [@EgeOnder23](https://twitter.com/EgeOnder23) |

[⬆ Back to top](#table-of-contents)

[build-shield]: https://img.shields.io/github/actions/workflow/status/kafeasist/kafeasist/ci.yml?style=for-the-badge
[build-url]: https://github.com/kafeasist/kafeasist/actions
[contributors-shield]: https://img.shields.io/github/contributors/kafeasist/kafeasist.svg?style=for-the-badge
[contributors-url]: https://github.com/kafeasist/kafeasist/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kafeasist/kafeasist.svg?style=for-the-badge
[forks-url]: https://github.com/kafeasist/kafeasist/network/members
[stars-shield]: https://img.shields.io/github/stars/kafeasist/kafeasist.svg?style=for-the-badge
[stars-url]: https://github.com/kafeasist/kafeasist/stargazers

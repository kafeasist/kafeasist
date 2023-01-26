# kafeasist built with Node

[![Build][build-shield]][build-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ol>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
      </ol>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
      <ol>
        <li><a href="#pull-requests">Pull requests</a></li>
      </ol>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#maintainers">Maintainers</a></li>
  </ol>
</details>

## About the project

kafeasist is a café/restaurant/bar management software made with ❤️. kafeasist is a software as a service that you can subscribe to monthly or yearly and leave whenever you want. kafeasist makes managing your business much more simpler with easy-to-use dashboard. Keeps track of your data and stores it in a cloud server so you wouldn't lose any of it! With kafeasist, you won't need any other software to run your business.

## Getting started

**IMPORTANT:** _The installation guide is only for Linux distributions but you can follow the links for proper installation on your operating system._

Please follow this guide carefully to install _kafeasist built with Node_ to your local machine. This installation guide may differ from OS to OS. So if you use a different OS, please consider reading the installation documentations for your OS from the links given below.

### Prerequisites

-   Install **npm**: (guide can be found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
    ```sh
    sudo apt-get install nodejs npm
    ```
    Current tested versions can be found in the workflow file.
-   **(OPTIONAL)** Install **yarn**: (guide can be found [here](https://classic.yarnpkg.com/lang/en/docs/install))

    ```sh
    npm install -g yarn
    ```

-   Install **Redis**: (guide can be found [here](https://redis.io/docs/getting-started/installation/))

    ```sh
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    sudo apt-get update
    sudo apt-get install redis
    ```

    Start the Redis server on port **6379** (default port)

-   Install **PostgreSQL**: (guide can be found [here](https://www.postgresql.org/download/))

    ```sh
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

    sudo apt-get update
    sudo apt-get -y install postgresql
    ```

    Run PostgreSQL on port **5432** with the user **postgres** and **no password** (default config)

### Installation

-   Clone the repository:

    ```sh
    git clone https://github.com/EgeOnder/kafeasist.git
    ```

-   Install packages:

    With **npm**: (the guide will be on yarn, if you want to continue using npm, you need to figure out the commands yourself)

    ```sh
    npm install
    ```

    With **yarn**: (preferred, guide will contiune with this)

    ```sh
    yarn install
    ```

-   Build and/or watch:
    If you want to constantly build the project as the code changes, you can watch for the changes and auto-build using:
    ```sh
    yarn watch
    ```
    If you want to only build the project once, use:
    ```sh
    yarn build
    ```

### Usage

-   Run unit tests:

    ```sh
    yarn test
    ```

-   Run the project in development mode:

    ```sh
    yarn dev
    ```

-   Run the project without using **nodemon**:

    ```sh
    yarn start
    ```

-   Run the project on production mode:

    ```sh
    yarn start:prod
    ```

-   Force lint the code using **eslint**:

    ```sh
    yarn lint
    ```

## Contributing

Contributions to the project is highly appreciated. If you have any suggestions/questions/requests please consider [opening an issue](https://github.com/EgeOnder/kafeasist/issues/new). If you want to contribute to the project, fixing an open issue is greatly recommended and appreciated. To see the all contribution rules please check the [contribution rules](CONTRIBUTING.md).

### Pull requests

1. Fork the repository
2. Modify the code and make your amazing change
3. Create your feature branch
    ```sh
    git checkout -b feature/<your_feature>
    ```
4. Add your changes
    ```sh
    git add .
    ```
5. Commit your changes _(please respect the commit message standards)_
    ```sh
    git commit -m "feat: added amazing things!"
    ```
6. Push your changes
    ```sh
    git push -u origin feature/<your_feature>
    ```
7. Open a pull request from your branch

## License

This project is licensed under `GNU General Public License v3.0` if you want to see more, please check [LICENSE][license-url] for more information.

## Maintainers

| Name      | E-Mail                                     | Twitter                                       | Role      |
| --------- | ------------------------------------------ | --------------------------------------------- | --------- |
| Ege Onder | 40398628+EgeOnder@users.noreply.github.com | [@EgeOnder23](https://twitter.com/EgeOnder23) | developer |

[build-shield]: https://img.shields.io/github/actions/workflow/status/EgeOnder/kafeasist/main.yml?style=for-the-badge
[build-url]: https://github.com/EgeOnder/kafeasist/actions
[contributors-shield]: https://img.shields.io/github/contributors/EgeOnder/kafeasist.svg?style=for-the-badge
[contributors-url]: https://github.com/EgeOnder/kafeasist/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/EgeOnder/kafeasist.svg?style=for-the-badge
[forks-url]: https://github.com/EgeOnder/kafeasist/network/members
[stars-shield]: https://img.shields.io/github/stars/EgeOnder/kafeasist.svg?style=for-the-badge
[stars-url]: https://github.com/EgeOnder/kafeasist/stargazers
[license-shield]: https://img.shields.io/github/license/EgeOnder/kafeasist?style=for-the-badge
[license-url]: https://github.com/EgeOnder/kafeasist/blob/main/LICENSE

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Casm101/leovegas-technical-test">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.casinos.info%2Fwp-content%2Fuploads%2Fleovegas_color-2.png&f=1&nofb=1&ipt=e318c912b7b4262e253236fcd2208c8436a1c94ecea635c0f45033c71d34a7e0&ipo=images" alt="Logo" width="300" height="200">
  </a>

<h3 align="center">LeoVegas Technical Test</h3>

  <p align="center">
    A simple REST buit with Node.JS and Express!
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a simple REST API built on Node.JS by Christian Smith Mantas, using a mix of backend libraries as a technical test for the Backend Software Engineer porition at LeoVegas in July 2024.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This project was built with group of libraries ideated to work in unison, and to show different areas of knowledge and experience in backend development. They where chosen keeping in mind, performance, ease of use and developer experience.

* Express (main backend library).
* PrismaORM (ORM for database management and manipulation).
* Zod and Typescript (for typing and validation).
* Bcrypt and JWT (encryption and token signing).
* Jest and Supertest (for unit tests).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm version 20.15.0
  
  ```sh
  npm install npm@20.15.0 -g
  ```

* Docker (optionaly used for DB)
  
  ```
  https://docs.docker.com/engine/install/
  ```

### Installation

1. Clone the repo
   
  ```sh
  git clone https://github.com/Casm101/leovegas-technical-test
  ```

2. Install NPM packages
   
  ```sh
  npm install
  ```

3. Copy the `.env.example` file and fill with your own vairables
  
  ```sh
  cp .env.example .env
  ```

4. (OPTIONAL) Run the docker container to host a postgres database
   
  ```sh
  docker-compose up
  ```

5. Migrate existing DB changes
   
  ```sh
  npm run prisma:migrate
  ```

6. Run the dev server
   
  ```
  npm run dev
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Christian Smith Mantas - casm101@icloud.com

Project Link: [https://github.com/Casm101/leovegas-technical-test](https://github.com/Casm101/leovegas-technical-test)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
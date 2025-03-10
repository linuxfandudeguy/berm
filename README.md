
# `berm`

[demo vid](https://youtu.be/68irhURe3IQ)
![Screenshot 2024-09-29 4 16 09 PM](https://github.com/user-attachments/assets/cd6d64e3-606f-49f8-b3b3-8b0992164c24)


`berm` is a tool that allows you to run Docker shell images in the browser.


## Prerequisites

Before installing `berm`, ensure that you have the following:

- The `docker.io` package installed on your computer. You can install it using your package manager. For example, on Ubuntu, you can run:
  
  ```bash
  sudo apt-get install docker.io
  ```

- [Node.js](https://nodejs.org/) installed on your machine.

## Installation Methods

### Using PNPM (Highly Recommended)
<details>
  <summary>Click to Show PNPM Instructions</summary>

To initiate `berm` using PNPM, you can use one of the two methods below:

**Method 1: PNPM Init**

```bash
pnpm create berm 
pnpm install
```

**Method 2: PNPX**

```bash
pnpx create-berm@1.0.0
pnpm install
```

After the installation, you can start the server with:

```bash
pnpm run start
# or
pnpm start
```
</details>

### Using NPX
<details>
  <summary>Click to Show NPX Instructions</summary>

To initiate `berm` using NPX, you can use the method below:

**NPX Create**

```bash
npx create-berm@1.0.0
npm install
```

After the setup, start the server with:

```bash
npm run start
# or
npm start
```
</details>

### Using NPM
<details>
  <summary>Click to Show NPM Instructions</summary>

You can initiate `berm` using NPM as follows:

**Method 1: NPM Init**

```bash
npm init berm
npm install
```

**Method 2: NPM Exec**

```bash
npm exec create-berm@1.0.0
npm install
```

Once the installation is complete, start the server with:

```bash
npm run start
# or
npm start
```
</details>

### Using Yarn
<details>
  <summary>Click to Show Yarn Instructions</summary>

To initiate `berm` using Yarn, you can use the method below:

**Yarn Create**

```bash
yarn create berm@1.0.0
yarn install
```

After the installation, start the server with:

```bash
yarn run start
# or
yarn start
```
</details>

### Using Bun
<details>
  <summary>Click to Show Bun Instructions</summary>

If you're using Bun, initiate `berm` with the following method:

**Bun Create**

```bash
bun create berm@1.0.0
bun install
```

After installation, start the server with:

```bash
bun run start
# or
bun start
```
</details>

## Customization

The docker image can be customized at line 18 in the `server.js` file.

```javascript
const container = await docker.createContainer({
Image: 'archlinux', // Use your Docker image
Tty: true,
OpenStdin: true,
 StdinOnce: false,
 });
```
You can change the `Image` field to whatever you want.

By default it loads the Arch Linux Docker image.

If you did it right, it should log these following messages to the console:


```bash
Server running at http://localhost:3000
Container started: 2a8e1b27d0f5b538ef9b0bcad5c03d1deb8615ae33b46428188812b5e70d6c05
```

In this example:
- The server is running locally at **http://localhost:3000**.
- The Docker container has started, and the container ID is: **2a8e1b27d0f5b538ef9b0bcad5c03d1deb8615ae33b46428188812b5e70d6c05**. This long hexadecimal string is the unique identifier for your Docker container.


This ID will change depending on what docker image you decide to load.

## Features

- **Browser-Based Execution:** Run Docker images directly in your browser without the need for local Docker installation.
- **Compatibility:** Supports a variety of Docker images, allowing for flexible usage scenarios.


## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

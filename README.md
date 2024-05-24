# Aternos Auto

Aternos Auto is a project that automates the process of starting a server on Aternos. It uses Puppeteer for browser automation and is designed to log in, check the server status, and start the server if it's offline.

## Installation

To install the project, you need to have Node.js installed on your machine. After that, you can clone the repository and install the dependencies using npm:

```sh
git clone https://github.com/razikus/aternos-auto.git
cd aternos-auto
npm install
```

## Usage

To use the project, you need to provide your Aternos username and password. You can do this either by setting the `ATERNOS_USERNAME` and `ATERNOS_PASSWORD` environment variables in your ``.env`` file or by entering them manually when prompted.

To start the server, run the following command:

```sh
node src/index.js
```

If you want to use environment variables for authentication, use the `--env` flag:

```sh
node src/index.js --env
```

If `--env` is used, the script will look for the `ATERNOS_USERNAME` and `ATERNOS_PASSWORD` environment variables. If they are not found, the script will prompt you to enter your credentials manually.

## Dependencies

The project uses the following dependencies:

- [chalk](https://www.npmjs.com/package/chalk) for terminal string styling
- [chrome-aws-lambda](https://www.npmjs.com/package/chrome-aws-lambda) for Puppeteer deployment on AWS Lambda
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management
- [fake-useragent](https://www.npmjs.com/package/fake-useragent) for generating random user agent strings
- [is-plain-object](https://www.npmjs.com/package/is-plain-object) for checking if an object is a plain object
- [puppeteer-core](https://www.npmjs.com/package/puppeteer-core) for browser automation
- [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra) and [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth) for additional Puppeteer functionality

## License

This project is licensed under the MIT License.
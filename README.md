# REST API For Nimble Logistic Contract. (http://195.201.100.45/api-docs/)

This repository provides the API endpoints for a Nimble Logisitic Contract.

## Table of contents

1. [Running the server](#running-the-server)
1. [Running tests](#running-tests)
1. [Under the covers](#under-the-covers)
1. [Development](#development)
1. [Scaffold Development Reference](#scaffold-development-reference)

## Running the server

```
$ npm install
$ npm run build
$ npm start
```

Navigate to http://localhost:3000/health/ to ensure server is up and running.

Finally, navigate to the Swagger UI at http://localhost:3000/api-docs/.

## Running tests

```
$ npm run test
```

## Under the covers

You should have a good understanding of how a Hyperledger Fabric network and its SDK to interact with it works, but there are some high level concepts outlined here to understand the flow.

A *FileSystemWallet* is used to manage identities for interacting with the network. More information can be found in the [Hyperledger Fabric SDK for node.js doc](https://fabric-sdk-node.github.io/FileSystemWallet.html). Look in *server/helpers/wallet.ts* for some wallet helper functions.

A gateway to talk to the network is established with the [*Gateway*](https://fabric-sdk-node.github.io/Gateway.html) class, by passing the common connection profile, a specified identity, and the wallet that contains that identity.

```
// gateway and contract connection
await gateway.connect(ccp, {
  identity: user,
  wallet: walletHelper.getWallet(),
});
```

Once the gateway is established, you connect to the channel by a [*getNetwork*](https://fabric-sdk-node.github.io/Gateway.html#getNetwork__anchor) call to the gateway.

```
const network = await gateway.getNetwork(config.channelName);
```

Then make a call to get the chaincode with a [*getContract*](https://fabric-sdk-node.github.io/Network.html#getContract__anchor) call.

```
const contract = await network.getContract(config.chaincodeName, config.chaincodeName.contractName);
```
> `contractName` is optional parameter (if you don't have multiple contracts).

Once you have the contract object, you can start invoking and querying the chaincode!

```
// invoke transaction
const invokeResponse = await contract.submitTransaction('Health');

// query
const queryResponse = await contract.evaluateTransaction('Health');
```

**NOTE:** This application uses a custom module to dynamically create and mount middleware functions that connect to a Fabric gateway. See the [Fabric Routes Custom Middleware](docs/fabric-routes.md) section for more details.

## Development
This app is built using Node.js and the [express.js framework](https://expressjs.com/). The entire backend application is found within the *server* directory. The *public* directory contains the swagger.yaml used by the Swagger UI to display API definitions. Note that we use the [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) npm package to serve and render the Swagger UI, instead of directly including the ui source code.

To start the server in development mode, run `npm run dev`. This will start the server with [nodemon](https://github.com/remy/nodemon), which automatically restarts the node app when you make file changes. It simplifies testing when making changes and adding functionality.

The server is configured and started from the *server/server.ts* file. Routers that contain all the routes of your app are added in the *routes* directory. The corresponding controllers/handlers (the logic performed when those apis are called) of those routes are found in the *controllers* directory. When adding a new route to the api, you will first create a new router (or add to an existing router) in the *routes* directory, and also include it in *routes/index.ts*. Then you will add the logic function in the *controllers* directory. For example, if I wanted to add a new `/ping` route, you would create a *routes/ping.ts* file. The file's contents would look like this:

```
import * as config from 'config';
import * as express from 'express';
import { getLogger } from 'log4js';

// controller logic for this route
import * as pingCtrl from '../controllers/ping';

const router = express.Router();

/**
 * Set up logging
 */
const logger = getLogger('routes - ping');
logger.level = config.get('logLevel');

logger.debug('setting up /ping route');

/**
 * Add routes
 */
router.get('/', pingCtrl.default); // specify path and controller function for this route

module.exports = router; // export router
```

Routes are registered to the server by taking the exported router in *routes/index.ts*, which basically takes all of the routers in the directory and combines them to pass to the express app. At this point, we've created the new router, but it won't be registered with the express app. To do that, we either need to add the route information in *config/fabric-connections.json* file or open *routes/index.ts* and add the following lines:

```
import ping = require('./ping');
router.use('/ping', ping);
```

Now all we need to add is the logic. Create a *controllers/ping.ts* file. Remember our function name needs to match what we specified when adding the route to the router. The file's contents would look something like this:

```
import * as config from 'config';
import { getLogger } from 'log4js';

import * as util from '../helpers/util';

const logger = getLogger('controllers - ping');
logger.level = config.get('logLevel');

const pingCC = async (req, res) => {
  logger.debug('entering >>> pingCC()');

  // ping chaincode
  const jsonRes = {
    statusCode: 200,
    success: true,
    message: 'Pinged chaincode successfully!',
  };

  logger.debug('exiting <<< pingCC()');
  util.sendResponse(res, jsonRes);
};

export { pingCC as default };
```

That's it, you now have a new route in your server! Remember it's important to keep your *swagger.yaml* up to date when you add new endpoints or make changes to existing ones.

The *middlewares* directory contains any middleware that is used in the app, such as error handling in *error-handler.ts*.

The *helpers* directory contains any helper functions used in the app, such as a send response helper in *util.ts* to send a request response back.

For full API reference and documentation, start the server and navigate to http://localhost:3000/api-docs/.  Also, please see:

* [Fabric routes custom middleware](docs/fabric-routes.md)
* [Securing the endpoints](docs/security.md)
* [Data validation](docs/data-validation.md)
* [Wallet settings](docs/wallet.md)

## Scaffold Development Reference

This repository is using the [API-Bootstrap](https://github.com/IBM-Blockchain-Starter-Kit/api-bootstrap) scaffolded template from IBM Blockchain Team for the development. 
Thanks alot for the amazing work by them.

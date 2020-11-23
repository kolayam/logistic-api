/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as config from 'config';
import * as express from 'express';
import { Contract } from 'fabric-network';
import { getLogger } from 'log4js';
import { Location } from '../dto/location';
import { IOrderDetails } from '../dto/orderDetails';
import { Item } from '../dto/item';
import {LogisticProcess} from '../dto/logisticProcess';

import * as util from '../helpers/util';

const logger = getLogger('controllers - createOrder');
logger.level = "DEBUG"

const createOrder = async (req: express.Request, res: express.Response) => {
  logger.debug('entering >>> createMyAsset()');

  let jsonRes;
  try {
    // More info on the following calls: https://fabric-sdk-node.github.io/Contract.html

    // Get contract instance retrieved in fabric-routes middleware
    const contract: Contract = res.locals.mychannel['logistic-contract'];

    // Invoke transaction
    // Create transaction proposal for endorsement and sendTransaction to orderer
    // const value = req.body.value;

    const originLocation: Location = req.body.originLocation;
    const orderDetails: IOrderDetails[] = req.body.orderDetails;
    const epcList: string[] =req.body.epcList;
    const itemIdentifier: Item = req.body.itemIdentifier;
    const deliveryLocation: Location = req.body.deliveryLocation;
    const note: string[] = req.body.note;
    const custodian: string = req.body.custodian;

    const logisticProcess = new LogisticProcess(
        orderDetails,
        epcList,
        itemIdentifier,
        deliveryLocation,
        originLocation,
        note,
        custodian
    );
    
    const invokeResponse = await contract.submitTransaction('startLogisticProcess', JSON.stringify(logisticProcess));

    jsonRes = {
      result: JSON.parse(invokeResponse.toString()),
      statusCode: 200,
      success: true,
    };
  } catch (err) {
    jsonRes = {
      message: `${err.message}`,
      statusCode: 500,
      success: false,
    };
  }

  logger.debug('exiting <<< createOrder()');
  util.sendResponse(res, jsonRes);
};

export { createOrder as default };

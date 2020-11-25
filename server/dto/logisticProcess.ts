/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { IOrderDetails } from './orderDetails';
import {  Item } from './item'; // tslint:disable-line:max-line-length
import { Location } from './location';

export class LogisticProcess {

    public orderDetails: IOrderDetails;

    public epcList: string[];

    public itemIdentifier: Item;

    public deliveryLocation: Location;

    public originLocation: Location;

    public note: string[];

    public custodian: string;

    public eventTime: number;
    
    constructor(
        orderDetails: IOrderDetails,
        epcList: string[],
        itemIdentifier: Item,
        deliveryLocation: Location,
        originLocation: Location,
        note: string[],
        custodian: string,
        eventTime: number
     ) {
        this.orderDetails = orderDetails;
        this.epcList = epcList;
        this.itemIdentifier = itemIdentifier;
        this.deliveryLocation = deliveryLocation;
        this.originLocation = originLocation;
        this.note = note;
        this.custodian = custodian;
        this.eventTime = eventTime
    }
    
}

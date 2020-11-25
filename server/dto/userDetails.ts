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

export class IUseretails {
    public name: string;

    public user_id: string;

    public roles: string[];

    public party_hjid: string;

    public party_name: string;

    public email: string;

    public peer_organization: string;

    constructor(name: string, userId: string, roles: string[], partyHjid: string, partyName: string, email: string, peerOrganization: string) {
        this.name = name;
        this.user_id = userId;
        this.roles = roles;
        this.party_hjid = partyHjid;
        this.party_name = partyName;
        this.email = email;
        this.peer_organization = peerOrganization;
    }
}

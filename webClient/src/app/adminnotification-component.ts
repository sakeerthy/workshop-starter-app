
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, Inject } from '@angular/core';
import {Http} from '@angular/http';
import { ZoweNotification } from '../../../../zlux-platform/base/src/notification-manager/notification'
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';

const EVERYONE = "Everyone";
const INDIVIDUAL = "Individual";

@Component({
  selector: 'adminnotification',
  templateUrl: 'adminnotification-component.html',
  styleUrls: ['adminnotification-component.scss']
})

export class AdminNotificationComponent {
  private response: string;
  private items: any;
  private recipient: string;
  private displayText: boolean;
  
  constructor(private http: Http,
    @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition,
    ) {
    this.response = "";
    this.items = [{content: EVERYONE}, {content: INDIVIDUAL}]
    this.recipient = EVERYONE
    this.displayText = true;
  }

  selected(e: any): void {
    this.recipient = e.item.content
    if (e.item.content === EVERYONE) {
      this.recipient = e.item.content
      this.displayText = true;
    } else if (e.item.content === INDIVIDUAL) {
      this.recipient = ""
      this.displayText = false;
    }
  }

  sendRest(title: string, message: string): void {
    let url: string;
    let notification = new ZoweNotification(title, message, 1, "org.zowe.zlux.bootstrap")

    ZoweZLUX.pluginManager.loadPlugins('bootstrap').then((res: any) => {
      url = ZoweZLUX.uriBroker.pluginRESTUri(res[0], 'adminnotificationdata', '') + 'write'
      if (this.recipient === EVERYONE) {
        this.http.post(url, {"notification": notification, "recipient": EVERYONE})
        .subscribe(
          res => {
            this.response = JSON.parse(res['_body']).Response
          },
          error => {
            this.response = JSON.parse(error['_body']).Response
          })
      } else {
        this.http.post(url, {"username": this.recipient, "notification":notification, "recipient": INDIVIDUAL})
        .subscribe(
          res => {
            this.response = JSON.parse(res['_body']).Response
          },
          error => {
            this.response = JSON.parse(error['_body']).Response
          }
        )
      }
    })
  }
}



/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/


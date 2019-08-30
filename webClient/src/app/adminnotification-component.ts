
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Http} from '@angular/http';
import { ZoweNotification } from '../../../../zlux-platform/base/src/notification-manager/notification'

@Component({
  selector: 'adminnotification',
  templateUrl: 'adminnotification-component.html',
  styleUrls: ['adminnotification-component.css']
})

export class AdminNotificationComponent implements OnInit, AfterViewInit {
  public broadcast: boolean;
  private url: string;
  public response: string;

  constructor(private http: Http) {
    this.broadcast = true;
    this.response = "";
  }

  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {

  }

  onChange(e: any): void {
    console.log(e.target)
    if (e.target.value == "individual") {
      this.broadcast = false
      console.log(this.broadcast)
    } else if (e.target.value == "everyone") {
      this.broadcast = true
      console.log(this.broadcast)
    }
  }

  sendRest(username: string, title: string, message: string): void {
    console.log(username)
    console.log(title)
    let url: string;
    let notification = new ZoweNotification(title, message, 1, "org.zowe.zlux.bootstrap")
    ZoweZLUX.pluginManager.loadPlugins('bootstrap').then((res: any) => {
      url = ZoweZLUX.uriBroker.pluginRESTUri(res[0], 'adminnotificationdata', '') + 'write'
      if (this.broadcast) {
        this.http.post(url, {"notification": notification, "recipient": "everyone"})
        .subscribe(
          res => {
            this.response = JSON.parse(res['_body']).Response
          },
          error => {
            this.response = JSON.parse(error['_body']).Response
          })
      } else {
        this.http.post(url, {"username": username, "notification":notification, "recipient": "individual"})
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


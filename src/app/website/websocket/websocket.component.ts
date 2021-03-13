import { Component, OnInit } from "@angular/core";

@Component({
  selector:'web-socket',
  templateUrl:'./websocket.html',
  styleUrls:['./websocket.css']
})
export class WebSocketComponent implements OnInit {
  public messages:string[] = [];
  public constructor(){

    }
    ngOnInit(){
      const connection = new WebSocket("ws://localhost:8080/admin/signaling");
        connection.onopen = (session)=>{
            console.log(session);
            connection.send(JSON.stringify({user:'dattatray'}));
        };
        connection.onerror = (error)=>{
            console.log(error);
        };
        connection.onmessage = (message)=>{
          this.messages.push(message.data);
        };
    }
}

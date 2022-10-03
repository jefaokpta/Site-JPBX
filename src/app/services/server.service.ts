import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  // private url = 'http://localhost:8080/';
  // private url = 'https://email-site-jpbx.herokuapp.com/';
  private url = 'https://email-jpbx.fly.dev/';

  constructor(private http: HttpClient) { }

  public postServer(page: string, data){
    return this.http.post<Message>(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

}

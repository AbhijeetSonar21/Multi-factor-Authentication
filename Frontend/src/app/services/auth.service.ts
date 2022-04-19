import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = new BehaviorSubject(0);
  public auth$ = this.auth.asObservable();

  url = "http://127.0.0.1:5100/"
  // url = "http://192.168.1.231:5100/"
  constructor(private _http:HttpClient) { }

  auth_1(auth:any){
    return this._http.post(this.url + "auth_1",auth)
  }

  auth_2(auth:any){
    return this._http.post(this.url + "auth_2",auth)
  }

  auth_3(auth:any){
    return this._http.post(this.url + "auth_3",auth)
  }

  new_user(user:any){
    return this._http.post(this.url + "newdata",user)
  }

}

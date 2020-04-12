import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private httpOptions: any;
  public token: string;
  public token_expires: Date;
  public username: string;
  public user_id = -1;
  public errors: any = [];
  public authToken: string;
  public base_url = environment.base_url;
  public currentUser: Observable<any>;
  public userInfo:any;

  constructor(
    private http: HttpClient
  ) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };      
   } 

   public login(user) {
     this.http.post(this.base_url +'/api/token/', JSON.stringify(user), this.httpOptions).subscribe(
       data => {
         this.token = data['access'];
         this.updateData(data['access']);
         localStorage.setItem('access_token', this.token);
       },
       err => {
         this.errors = err['error'];
       }
     );

   }

   public register(user): Observable<any> {     
     const body = {
       username: user.username,
       email: user.email,
       password1: user.password1,
       password2: user.password2
     };

    return this.http.post(this.base_url + '/auth/signup/', JSON.stringify(body), this.httpOptions);    

   }

   public get loggedIn(): boolean {
     return localStorage.getItem('access_token') !== null;
   }

   private updateData(token) {
     this.token = token;
     this.errors = [];
     const token_parts = this.token.split(/\./);
     const token_decoded = JSON.parse(window.atob(token_parts[1]));
     this.user_id = token_decoded.user_id;     
     return this.user_id;    
   }

   public refreshToken() {     
     this.http.post(this.base_url +'/api/token/refresh/', JSON.stringify({
       token: this.token
     }), this.httpOptions).subscribe(
       data => {
         this.token = data['access'];
         this.updateData(this.token);
       },
       err => {
         this.errors = err['error'];
       }
     )     
   }

   public logout() {
     this.token = null;
     this.token_expires = null;
     this.user_id = null;
     localStorage.removeItem('access_token');
   }

   public getUserId(access) {
     this.user_id = this.updateData(access);
     return this.user_id;
   }

   public getUser(access): Observable<any> {
     let httpOption = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' +access
       })
     }
     return this.http.get(this.base_url + '/auth/user/', httpOption)
     
   }

   public tokenValidation(acc_token): Observable<any> {
     let token_valid: any;
     return this.http.post(this.base_url +'/api/token/refresh/', JSON.stringify({
      token: acc_token
    }), this.httpOptions);
   }
}

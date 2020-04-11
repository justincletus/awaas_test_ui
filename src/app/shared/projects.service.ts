import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public base_url = environment.base_url;
  private httpOptions: any;
  public token: string = localStorage.getItem('access_token');

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { 
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

  }

  public projectsList(): Observable<any> {
    return this.http.get(this.base_url + '/projects/');
  }

  createProject(body, access): Observable<any> {
    let user_id = this.authService.getUserId(access);

    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access
      })
    }
    
    return this.http.post(this.base_url + '/projects/', JSON.stringify(body), httpOption);
  }

  getProjectById(id): Observable<any> {
    return this.http.get(this.base_url + '/projects/' +id +'/')
  }

  projectUpdate(body, access): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access
      })
    }
    
    let url_path = '/projects/' + body['id'] + '/';
    return this.http.put(this.base_url + url_path, JSON.stringify(body), httpOption);
  }

  deleteProject(id, access): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access
      })
    };
    
    let url_path = '/projects/' +id + '/';
    return this.http.delete(this.base_url + url_path, httpOption);
  }
    
}

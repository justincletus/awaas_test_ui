import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ProjectsService } from './projects.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private httpOptions: any;
  public base_url = environment.base_url;

  constructor(
    private http: HttpClient,
    private userAuth: AuthService,
    private proj: ProjectsService,

  ) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
   }

   getTaskList(): Observable<any> {
     return this.http.get(this.base_url + '/tasks/', this.httpOptions);
   }

   getTaskById(proj_id): Observable<any> {
     return this.http.get(this.base_url + '/task_list/' + proj_id, this.httpOptions);
   }

   getTask(id): Observable<any> {
    return this.http.get(this.base_url + '/tasks/' + id +'/', this.httpOptions);
  }

  createTask(data, access) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +access
      })
    };
    return this.http.post(this.base_url +'/tasks/', JSON.stringify(data), httpOption);
  }

  updateTask(data, access) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +access
      })
    };
    return this.http.put(this.base_url +'/tasks/' + data['id'] +'/', JSON.stringify(data), httpOption);
  }

  deleteTask(id, access) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +access
      })
    };
    return this.http.delete(this.base_url +'/tasks/' + id +'/', httpOption);
  }
}

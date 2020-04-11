import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/shared/projects.service';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  private id;
  public project = {
    'id': -1,
    'user': 0,
    'title': '',
    'description': '',
    'date': ''
  };
  public errors = {};
  isEdit = false;
  projectEditForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private proj: ProjectsService,
    private userAuth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getProject();

  }

  getProject = () => {
    this.proj.getProjectById(this.id).subscribe(
      data => {
        this.project = data;
        console.log(data);
      },
      err => {
        console.log(err);
        this.errors = err['error'];
        this.flashMessage.show(err['error'], {
          cssClass: 'alert-danger', timeout:2000
        });
      }
    )
  }

  projectEdit = ($event, id) => {
    this.toggleDisplay();
  }

  projectDelete = ($event, id) => {
    let token = localStorage.getItem('access_token');
    let user_id = this.userAuth.getUserId(token);
    if (user_id != this.project.user){
      return this.router.navigate(['projects'])
    }
    this.userAuth.getUser(token).subscribe(
      data => {
        this.proj.deleteProject(id, token).subscribe(
          info => {
            return this.router.navigate(['projects']);
          },
          err => {
            console.log(err['error']);
          }
        );
      },
      err => {
        console.log(err['error']);
        this.errors = err['error'];
        this.flashMessage.show(err['error'], {
          cssClass: 'alert-danger', timeout:2000
        });
        if(this.errors['code'] == "token_not_valid") {
          console.log('user token is expired');
          this.userAuth.logout();
          this.router.navigate(['login']);
          return true;
        }
      }
    )
  }

  toggleDisplay() {
    let token = localStorage.getItem('access_token')
    if (this.userAuth.loggedIn) {
      let user_id = this.userAuth.getUserId(token)
      if (user_id == this.project.user) {
        this.isEdit = !this.isEdit;
      }
      else {
        return this.router.navigate(['projects'])
        console.log('current user do not have rights edit this project.');
      }
    }
      
  }

  onSubmit = () => {
    let token = localStorage.getItem('access_token');
    let token_value:any;
    this.userAuth.getUser(token).subscribe(
      data => {
        let update_data = this.projectEditForm.value;
        update_data['id'] = this.project['id'];
        update_data['user'] = this.project['user'];
        update_data['date'] = new Date().toJSON("yyyy/MM/dd HH:mm");
        
        this.proj.projectUpdate(update_data, token).subscribe(
          data => {
            console.log(data);
            this.router.navigate(['projects']);
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err['error']);
        this.errors = err['error'];
        this.flashMessage.show(err['error'], {
          cssClass: 'alert-danger', timeout:2000
        });
        if(this.errors['code'] == "token_not_valid") {
          console.log('user token is expired');
          this.userAuth.logout();
          this.router.navigate(['login']);
          return true;
        }
      }
    );    
  }
}

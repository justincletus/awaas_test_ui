import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ProjectsService } from '../shared/projects.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
// This is main projects module to create projects
export class ProjectsComponent implements OnInit {

  projects = [{
    id: 0,
    name: '',
    description: ''
  }];
  project_data = {
    'user': 0,
    'title': '',
    'description': ''
  }
  private userInfo;
  public errors: any;
  public edited = true;
  isShow = false;

  // Create project using this project form object
  projectForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public userAuth: AuthService,
    public proj: ProjectsService,
    private fb: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService
    
  ) { }

  ngOnInit(): void {
    
    if(this.userAuth.loggedIn) {
      // get the all projects from project API
      this.projectLists();
      // get the current logged in user detail
      this.getUserInfo();  
    }
    else {
      this.flashMessage.show("Please login see all available project details", {
        cssClass: 'alert-info', timeout:2000
      });
    }  
      
  }

  // Project create form will pop up which requested add project
  toggleDisplay() {
    if(this.userAuth.loggedIn) {
      this.isShow = !this.isShow;      
    } else {
      this.flashMessage.show("Test message", {
        cssClass: 'alert-danger', timeout:2000
      });
      this.router.navigate(['login']);
    }    
  }  

  // Display list of all project list
  projectLists = () => {
    this.proj.projectsList().subscribe(
      data => {
        this.projects = data
      },
      err => {
        this.errors = err['error']
      }
    );

  }

  // This will be called when user submit create project form
  onSubmit = () => {
    this.project_data = this.projectForm.value;
    let access = localStorage.getItem('access_token')
    this.project_data['user'] = this.userAuth.getUserId(access);
    this.userAuth.getUser(access).subscribe(
      data => {
        // console.log(data);
        this.proj.createProject(this.project_data, access).subscribe(
          data => {
            this.ngOnInit();
            return this.router.navigate(['home']);  
          },
          err => {
            console.log(err);
          }    
        )
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

  getUserInfo = () => {
    if (this.userAuth.loggedIn) {
      let access = this.userAuth.refreshToken();
    }
    let access = localStorage.getItem('access_token');
    let user_id = this.userAuth.getUserId(access);
    this.userAuth.getUser(access).subscribe(
      data => {
        console.log(data);
        this.userInfo = data;
      },
      err => {
        console.log(err['error'])
      }
    )
  }
}

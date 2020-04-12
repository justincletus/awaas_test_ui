import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/shared/tasks.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  public task = {
    id: 0,
    project: 0,
    user: 0,
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    date: ''
  };
  private id;
  public errors: any;
  isEdit: boolean = false;
  taskEditForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });
  constructor(
    private taskService: TasksService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTaskDetail();
  }

  getTaskDetail = () => {
    this.taskService.getTask(this.id).subscribe(
      data => {
        this.task = data;
      },
      err => {
        console.log(err['error']);
        this.errors = err['error'];
      }
    )
  }

  taskEdit = ($event, id) => {
    this.toggleDisplay();
  }

  taskDelete = ($event, id) => {
    let token = localStorage.getItem('access_token');
    let user_id = this.authService.getUserId(token);
    if (user_id != this.task.user){
      return this.router.navigate(['project', this.task.project, 'tasks'])
    }
    this.authService.getUser(token).subscribe(
      data => {
        // console.log(data);
        this.taskService.deleteTask(id, token).subscribe(
          info => {
            return this.router.navigate(['project', this.task.project, 'tasks']);
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
          this.authService.logout();
          this.router.navigate(['login']);
          return true;
        }
      }
    )

  }

  toggleDisplay() {
    let token = localStorage.getItem('access_token')
    if (this.authService.loggedIn) {
      let user_id = this.authService.getUserId(token)
      if (user_id == this.task.user) {
        this.isEdit = !this.isEdit
      }
      else {
        console.log('you do not having access rights.');
      }

    }

  }

  onSubmit() {
    let token = localStorage.getItem('access_token');
    let token_value:any;
    this.authService.getUser(token).subscribe(
      data => {
        let update_data = this.taskEditForm.value;
        update_data['id'] = this.task['id'];
        update_data['project'] = this.task['project']
        update_data['user'] = this.task['user'];
        update_data['date'] = new Date().toJSON("yyyy/MM/dd HH:mm");
        
        // console.log(update_data);
        this.taskService.updateTask(update_data, token).subscribe(
          data => {
            // console.log(data);
            this.router.navigate(['project', this.task['project'], 'tasks']);
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
          this.authService.logout();
          this.router.navigate(['login']);
          return true;
        }
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { TasksService } from '../shared/tasks.service';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  public task_list =[{
    'id': 0,
    'project': 0,
    'user': 0,
    'title': '',
    'description': '',
    'start_date': '',
    'end_date': ''
  }]
  model: NgbDateStruct;
  date: {
    year: number,
    month: number,
    day: number
  };

  private id;
  public errors:any;
  isTask: boolean = false;
  taskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl('')
  });

  constructor(
    public tasks: TasksService,
    private userAuth: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private calendar: NgbCalendar
    
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');    
    this.tasksById();
  }

  selectToday() {
    this.model = this.calendar.getToday();
    return this.model;
  }

  datePicker(){
    let t_date = this.selectToday();
    console.log(t_date);
  }

  toggleDisplay() {
    if(this.userAuth.loggedIn) {
      this.isTask = !this.isTask;
    } else {
      this.router.navigate(['login']);
    }
  }

  taskList = () => {
    this.tasks.getTaskList().subscribe(
      data => {
        this.task_list = data;
      },
      err => {
        console.log(err['error'])
      }
    );

  }

  tasksById = () => {
    this.tasks.getTaskById(this.id).subscribe(
      data => {
        this.task_list = data;
        console.log(this.task_list);
      },
      err => {
        console.log(err['error']);
        this.errors = err['error'];
        this.flashMessage.show(err['error'], {
          cssClass: 'alert-danger', timeout:2000
        });
      }
    )
  }

  formatDate(date) {
    let year = date['year'];
    let month = date['month'];
    let day = date['day'];
    let date_format = [year, month, day].join('-');  

    return date_format;
  }

  onSubmit() {
    let form_data = this.taskForm.value;
    form_data['project'] = this.id;
    console.log(form_data);
    let access = localStorage.getItem('access_token');
    form_data['user'] = this.userAuth.getUserId(access);
    let f_year = form_data['start_date']['year'];
    let f_mon = 
    console.log(f_year);
    form_data['start_date'] = this.formatDate(form_data['start_date']);
    form_data['end_date'] = this.formatDate(form_data['end_date']);
    this.userAuth.getUser(access).subscribe(
      data => {
        console.log(data);
        this.tasks.createTask(form_data, access).subscribe(
          data => {
            this.ngOnInit();
            return this.router.navigate(['project', this.id])
            console.log("Project created!");   
          },
          err => {
            console.log(err);        
          }    
        )
      },
      err => {
        console.log(err['error']);
        this.errors = err['error'];
        // this.flashMessage.show(err['error'], {
        //   cssClass: 'alert-danger', timeout:2000
        // });
        if(this.errors['code'] == "token_not_valid") {
          console.log('user token is expired');
          this.userAuth.logout();
          this.router.navigate(['login']);
          return true;
        }
      }
    )
  }

}

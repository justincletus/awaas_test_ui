import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user: any;
  public errors: any = []

  constructor(
    public _userAuth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = {
      username: '',
      email: '',
      password1: '',
      password2: ''
    };
    
  }

  register = () => {
    this._userAuth.register(this.user).subscribe(
      data => {
        if(data.user.username !== null) {
          this.router.navigate(['/home']);
        }
      },
      err => {
        console.log(err);
        this.errors = err['error'];
        
      }
    )
  }

}

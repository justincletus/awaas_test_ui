import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: any;

  constructor(
    public userAuth: AuthService
  ) { }

  ngOnInit(): void {
    this.user = {
      username: '',
      password: ''
    };

  }

  login() {
    this.userAuth.login({
      'username': this.user.username,
      'password': this.user.password
    });
  }

  refreshToken() {
    this.userAuth.refreshToken();
  }

  logout() {
    this.userAuth.logout();
  }

}

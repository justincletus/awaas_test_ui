import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navbarOpen = false;
  show:boolean = false;
  collapse: string;
  searchValue: string;
  // @Input() readonly placeholder: string = '';

  constructor(
    public userAuth: AuthService
  ) { }

  ngOnInit(): void {
  }

  toggleCollapse() {
    this.collapse = this.collapse == "open" ? 'close': 'open';
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen
  } 

}

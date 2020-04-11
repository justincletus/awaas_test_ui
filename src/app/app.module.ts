import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentComponent } from './layout/content/content.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { AuthService } from './shared/auth.service';
import { JwtModule } from '@auth0/angular-jwt'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { FlashMessagesModule } from 'angular2-flash-messages';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    HomeComponent,
    PageNotFoundComponent,
    ProjectsComponent,
    TasksComponent,
    ProjectDetailComponent,
    TaskDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["http://127.0.0.1:8000"]
      }
    }),
    // NgFlashMessagesModule.forRoot(),
    
  ],
  entryComponents: [AppComponent],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

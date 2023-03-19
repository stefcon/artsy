import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { NewPassComponent } from './new-pass/new-pass.component';
import { WorkshopPreviewComponent } from './workshop-preview/workshop-preview.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { ChatComponent } from './chat/chat.component';
import { NewWorkshopComponent } from './new-workshop/new-workshop.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { CommentsLikesComponent } from './comments-likes/comments-likes.component';
import { UsersListComponent } from './users-list/users-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { WorkshopRequestsComponent } from './workshop-requests/workshop-requests.component';
import { MapComponent } from './map/map.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginComponent,
    HeaderComponent,
    UserComponent,
    RegisterComponent,
    ResetPassComponent,
    NewPassComponent,
    WorkshopPreviewComponent,
    WorkshopsComponent,
    WorkshopDetailsComponent,
    ChatComponent,
    NewWorkshopComponent,
    EditWorkshopComponent,
    CommentsLikesComponent,
    UsersListComponent,
    EditUserComponent,
    WorkshopRequestsComponent,
    MapComponent,
    RegisterAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

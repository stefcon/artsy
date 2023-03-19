import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkshopsComponent } from './workshops/workshops.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { NewPassComponent } from './new-pass/new-pass.component';
import { AuthGuard } from './guards/auth.guard';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { ChatComponent } from './chat/chat.component';
import { AdminOrgGuard } from './guards/admin-org.guard';
import { NewWorkshopComponent } from './new-workshop/new-workshop.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { AdminGuard } from './guards/admin.guard';
import { UsersListComponent } from './users-list/users-list.component';
import { UserGuard } from './guards/user.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { WorkshopRequestsComponent } from './workshop-requests/workshop-requests.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';

const routes: Routes = [
  {path: '', component: WorkshopsComponent}, // TODO: Napravi pravi homepage...
  {path: 'workshops', component: WorkshopsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset-pass', component: ResetPassComponent},
  {path: 'reset', component: NewPassComponent},

  {path: 'register', component: RegisterComponent},
  {path: 'register/admin', component: RegisterAdminComponent},

  {path: 'profile', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'new-pass', component: NewPassComponent, canActivate: [AuthGuard]},
  {path: 'workshops/:id', component: WorkshopDetailsComponent, canActivate: [AuthGuard]},

  {path: 'new-workshop', component: NewWorkshopComponent, canActivate: [AuthGuard]}, //AdminOrgGuard
  {path: 'edit-workshop/:id', component: EditWorkshopComponent, canActivate: [AdminOrgGuard]},
  {path: 'edit-user/:username', component: EditUserComponent, canActivate: [UserGuard]},

  {path: 'users-list', component: UsersListComponent, canActivate: [AdminGuard]},
  {path: 'workshop-requests', component: WorkshopRequestsComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

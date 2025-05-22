import { Routes } from '@angular/router'
import { UserListComponent } from './components/user-list/user-list.component'
import { UserDetailsComponent } from './components/user-details/user-details.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserListComponent,
    title: 'User List'
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent
  }
];

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interface/user';
import { apiRoutes } from '../../api-routes';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient)

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiRoutes.getUsers);
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(apiRoutes.getUserById(id.toString()));
  }
}

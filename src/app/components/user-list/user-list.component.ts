import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';
import { catchError, finalize, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [NgForOf, NgIf, AsyncPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>
  isLoading: boolean = false

  private userService = inject(UsersService)
  private router = inject(Router)

  ngOnInit() {
    this.fetchUsers()
  }

  fetchUsers(): void {
    this.isLoading = true
    this.users$ = this.userService.getUsers().pipe(
      finalize(() => this.isLoading = false),
      catchError(() => {
        return of([]);
      })
    )
  }

  onItemClick(id: number) {
    this.router.navigate(['/users', id]);
  }

  buildValidUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }
}

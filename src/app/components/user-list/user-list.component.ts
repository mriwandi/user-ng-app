import { Component, inject, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [NgForOf, NgIf],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>
  users: User[] = []
  isLoading: boolean = false

  private userService = inject(UsersService)
  private router = inject(Router)

  ngOnInit() {
    this.getUserList()
  }

  getUserList(): void {
    this.users$ = this.userService.getUsers()
    this.users$.subscribe({
      next: (users) => {
        this.isLoading = false
        this.users = users
      },
      error: (_) => {
        this.isLoading = false
      }
    });
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

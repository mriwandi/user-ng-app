import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-user-list',
  imports: [NgForOf],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: User[] = []

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data
    });
  }

  onItemClick(id: number) {
    this.router.navigate(['/users', id]);
  }
}

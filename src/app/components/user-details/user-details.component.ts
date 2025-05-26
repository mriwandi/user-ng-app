import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  imports: [NgIf],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  user$!: Observable<User | null>
  user: User | null = null
  isLoading: boolean = false
  visibleUserNotFound: boolean = false

  private userService = inject(UsersService)
  private route = inject(ActivatedRoute)
  private location = inject(Location)

  ngOnInit() {
    this.isLoading = true
    const userId = this.route.snapshot.paramMap.get('id')
    this.getUserDetails(userId);
  }

  getUserDetails(userId: string | null) {
    this.user$ = this.userService.getUserById(Number(userId))
    this.user$.subscribe({
      next: (user) => {
        this.isLoading = false
        this.user = user
        this.visibleUserNotFound = !user
      },
      error: (_) => {
        this.isLoading = false
        this.visibleUserNotFound = true
      }
    })
  }

  onBackClick() {
    this.location.back()
  }
}

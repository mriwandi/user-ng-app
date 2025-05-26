import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, Location, NgIf } from '@angular/common';
import { catchError, finalize, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-details',
  imports: [NgIf, AsyncPipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  user$!: Observable<User | null>
  isLoading: boolean = false
  visibleUserNotFound: boolean = false

  private userService = inject(UsersService)
  private route = inject(ActivatedRoute)
  private location = inject(Location)

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id')
    this.fetchUserDetails(userId);
  }

  fetchUserDetails(userId: string | null) {
    this.isLoading = true
    this.user$ = this.userService.getUserById(Number(userId)).pipe(
      finalize(() => this.isLoading = false),
      catchError(() => {
        this.visibleUserNotFound = true
        return of(null);
      })
    )
  }

  onBackClick() {
    this.location.back()
  }
}

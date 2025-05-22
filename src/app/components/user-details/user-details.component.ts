import { Component } from '@angular/core';
import { User } from '../../interface/user';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-details',
  imports: [NgIf],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  user: User | null = null;

  constructor(
    private userService: UsersService, 
    private route: ActivatedRoute,
    private title: Title,
    private location: Location,
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id')
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe((data: User) => {
        this.user = data
        this.title.setTitle(`User Details - ${data.name}`);
      });
    }
  }

  onBackClick() {
    this.location.back()
  }
}

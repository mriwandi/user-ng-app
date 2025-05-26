import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserListComponent } from './user-list.component';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';
import { User } from '../../interface/user';
import { of, throwError } from 'rxjs';


describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'jdoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      website: 'example.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'Testville',
        zipcode: '12345',
        geo: { lat: '0.0', lng: '0.0' }
      },
      company: {
        name: 'TestCorp',
        catchPhrase: 'We test hard',
        bs: 'testing everything'
      }
    }
  ];

  beforeEach(async () => {
    const usersServiceMock = jasmine.createSpyObj('UsersService', ['getUsers']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent)
    component = fixture.componentInstance
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    usersServiceSpy.getUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserList method on init', () => {
    const spy = spyOn(component, 'getUserList');
    
    component.ngOnInit();

    expect(spy).toHaveBeenCalledTimes(1)
  });

  it('should set users on getUserList call', () => {
    component.getUserList();

    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error in getUserList', () => {
    usersServiceSpy.getUsers.and.returnValue(throwError(() => new Error('Failed to fetch')));

    component.getUserList();

    expect(component.users).toEqual([]);
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate to user detail when item clicked', () => {
    component.onItemClick(5);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users', 5]);
  });

  it('should build valid URL with http if missing', () => {
    expect(component.buildValidUrl('example.com')).toBe('http://example.com');
    expect(component.buildValidUrl('https://example.com')).toBe('https://example.com');
    expect(component.buildValidUrl('http://example.com')).toBe('http://example.com');
  });
});

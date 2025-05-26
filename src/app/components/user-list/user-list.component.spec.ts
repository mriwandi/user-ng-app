import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../interface/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
    const userServiceMock = jasmine.createSpyObj('UsersService', ['getUsers']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchUsers on init', () => {
    const spy = spyOn(component, 'fetchUsers');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isLoading to false after users load successfully', () => {
    usersServiceSpy.getUsers.and.returnValue(of(mockUsers));
    component.fetchUsers();

    component.users$.subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    expect(component.isLoading).toBeFalse();
  });

  it('should set isLoading to false and users$ to empty array on error', () => {
    usersServiceSpy.getUsers.and.returnValue(throwError(() => new Error('Failed')));
    component.fetchUsers();

    component.users$.subscribe(users => {
      expect(users).toEqual([]);
    });

    expect(component.isLoading).toBeFalse();
  });

  it('should navigate to user details on item click', () => {
    component.onItemClick(42);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users', 42]);
  });

  it('should build valid url when missing http/https', () => {
    expect(component.buildValidUrl('example.com')).toBe('http://example.com');
    expect(component.buildValidUrl('http://example.com')).toBe('http://example.com');
    expect(component.buildValidUrl('https://example.com')).toBe('https://example.com');
  });
});

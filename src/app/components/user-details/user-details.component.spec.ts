import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { of, throwError } from 'rxjs';
import { User } from '../../interface/user';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  const mockUser: User = {
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
  };

  beforeEach(async () => {
    const usersServiceMock = jasmine.createSpyObj('UsersService', ['getUserById']);
    const locationMock = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent, HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Location, useValue: locationMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') {
                    return '1'; // Mock user ID
                  }
                  return null;
                }
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    usersServiceSpy.getUserById.and.returnValue(of(mockUser));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should call getUserDetails on init', () => {
    const spy = spyOn(component, 'getUserDetails');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('1');
  });

  it ('should set user and isLoading on getUserDetails success', () => {
    component.getUserDetails('1');

    expect(component.user).toEqual(mockUser);
    expect(component.isLoading).toBeFalse();
    expect(component.visibleUserNotFound).toBeFalse();
  });

  it ('should set visibleUserNotFound to true when user is not found', () => {
    usersServiceSpy.getUserById.and.returnValue(of(null as unknown as User));
    component.getUserDetails('1');

    expect(component.user).toBeNull();
    expect(component.isLoading).toBeFalse();
    expect(component.visibleUserNotFound).toBeTrue();
  });

  it('should set visibleUserNotFound to true on error', () => {
    usersServiceSpy.getUserById.and.returnValue(throwError(() => new Error('Failed to fetch')));
    
    component.getUserDetails('1');
    
    expect(component.visibleUserNotFound).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate back when onBackClick is called', () => {
    component.onBackClick();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { User } from '../../interface/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
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
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Location, useValue: locationMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchUserDetails on ngOnInit with route param', () => {
    const spy = spyOn(component, 'fetchUserDetails').and.callThrough();
    usersServiceSpy.getUserById.and.returnValue(of(mockUser));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledOnceWith('1');
  });

  it('should set user$ observable and flags correctly on success', (done) => {
    usersServiceSpy.getUserById.and.returnValue(of(mockUser));

    component.fetchUserDetails('1');

    component.user$.subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(component.visibleUserNotFound).toBeFalse();
      done();
    });
    expect(component.isLoading).toBeFalse();
  });

  it('should handle null user response by setting visibleUserNotFound to true', (done) => {
    usersServiceSpy.getUserById.and.returnValue(of(null));

    component.fetchUserDetails('1');

    component.user$.subscribe(user => {
      expect(user).toBeNull();
      expect(component.visibleUserNotFound).toBeTrue();
      done();
    });
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error and set visibleUserNotFound to true', (done) => {
    usersServiceSpy.getUserById.and.returnValue(throwError(() => new Error('Error')));

    component.fetchUserDetails('1');

    component.user$.subscribe(user => {
      expect(user).toBeNull();
      expect(component.visibleUserNotFound).toBeTrue();
      done();
    });
    expect(component.isLoading).toBeFalse();
  });

  it('should call location.back on onBackClick', () => {
    component.onBackClick();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});

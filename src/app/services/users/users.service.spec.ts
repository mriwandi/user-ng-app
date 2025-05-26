import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../../interface/user';
import { apiRoutes } from '../../api-routes';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 4',
        city: 'Metropolis',
        zipcode: '12345',
        geo: { lat: '10.0', lng: '20.0' }
      },
      phone: '123-456-7890',
      website: 'example.com',
      company: {
        name: 'Example Inc',
        catchPhrase: 'Innovate the future',
        bs: 'business stuff'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiRoutes.getUsers);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch user by ID', () => {
    const mockUser = mockUsers[0];
    const id = mockUser.id;

    service.getUserById(id).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiRoutes.getUserById(id.toString()));
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite-service';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FavoriteService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('reads all favorites with GET', () => {
    service.getAll().subscribe();
    const request = httpTesting.expectOne('/api/test/favorites');

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('updates the note with PUT', () => {
    service.update('42', { note: 'À relancer' }).subscribe();
    const request = httpTesting.expectOne('/api/test/favorites/42');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ note: 'À relancer' });
    request.flush({});
  });

  it('deletes a favorite with DELETE', () => {
    service.delete('42').subscribe();
    const request = httpTesting.expectOne('/api/test/favorites/42');

    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});

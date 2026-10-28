import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudTest } from './crud-test';

describe('CrudTest', () => {
  let fixture: ComponentFixture<CrudTest>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTest],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudTest);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('loads the favorites when it opens', async () => {
    fixture.detectChanges();
    httpTesting.expectOne('/api/test/favorites').flush([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Aucun favori');
    httpTesting.verify();
  });
});

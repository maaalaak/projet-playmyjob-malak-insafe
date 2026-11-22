import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditor } from './profile-editor';

const USER = { id: '1', firstName: 'Malak', lastName: 'Melhaoui', email: 'malak@example.com', createdAt: '2026-11-22' };

describe('ProfileEditor', () => {
  let fixture: ComponentFixture<ProfileEditor>;
  let element: HTMLElement;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProfileEditor],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditor);
    element = fixture.nativeElement;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpTesting.expectOne({ method: 'GET', url: '/api/profile' }).flush(USER);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('fills the form with the profile and keeps the button disabled until a change', () => {
    expect(element.querySelector<HTMLInputElement>('[formControlName="firstName"]')?.value).toBe('Malak');
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('saves the changed profile', () => {
    const input: HTMLInputElement = element.querySelector('[formControlName="firstName"]')!;
    input.value = 'Insafe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    const request = httpTesting.expectOne({ method: 'PUT', url: '/api/profile' });
    expect(request.request.body.firstName).toBe('Insafe');
    request.flush({ ...USER, firstName: 'Insafe' });
    fixture.detectChanges();

    expect(element.textContent).toContain('Profil enregistré');
  });
});

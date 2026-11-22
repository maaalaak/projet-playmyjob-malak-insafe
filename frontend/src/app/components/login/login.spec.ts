import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let element: HTMLElement;
  let httpTesting: HttpTestingController;

  function fill(selector: string, value: string): void {
    const input: HTMLInputElement = element.querySelector(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitValidForm(): void {
    fill('input[type="email"]', 'malak@example.com');
    fill('input[type="password"]', 'motdepasse');
    element.querySelector('form')?.dispatchEvent(new Event('submit'));
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    element = fixture.nativeElement;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('keeps the button disabled while the form is invalid', () => {
    fill('input[type="email"]', 'sans-arobase');
    fill('input[type="password"]', 'motdepasse');

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('navigates to the offers once the backend accepts the login', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    submitValidForm();

    httpTesting.expectOne('/api/auth/login').flush({ token: 'jeton', user: {} });

    expect(navigate).toHaveBeenCalledWith(['/offers']);
  });

  it('shows the error sent by the backend', () => {
    submitValidForm();

    httpTesting
      .expectOne('/api/auth/login')
      .flush({ message: 'Email ou mot de passe incorrect' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Email ou mot de passe incorrect');
  });
});

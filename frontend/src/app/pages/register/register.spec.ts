import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let element: HTMLElement;
  let httpTesting: HttpTestingController;

  function fillForm(passwordConfirmation: string): void {
    const values: Record<string, string> = {
      firstName: 'Malak',
      lastName: 'Melhaoui',
      email: 'malak@example.com',
      password: 'motdepasse',
      passwordConfirmation,
    };

    Object.entries(values).forEach(([name, value]: [string, string]) => {
      const input: HTMLInputElement = element.querySelector(`[formControlName="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    });
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    element = fixture.nativeElement;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('keeps the button disabled when the passwords differ', () => {
    fillForm('autre-mot');

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('sends the account without the confirmation, then navigates to the offers', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fillForm('motdepasse');

    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    const request = httpTesting.expectOne('/api/auth/register');
    request.flush({ token: 'jeton', user: {} });

    expect(request.request.body).toEqual({
      firstName: 'Malak',
      lastName: 'Melhaoui',
      email: 'malak@example.com',
      password: 'motdepasse',
    });
    expect(navigate).toHaveBeenCalledWith(['/offers']);
  });
});

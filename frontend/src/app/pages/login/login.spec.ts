import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let element: HTMLElement;

  function fill(selector: string, value: string): void {
    const input: HTMLInputElement = element.querySelector(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('keeps the button disabled while the form is invalid', () => {
    fill('input[type="email"]', 'sans-arobase');
    fill('input[type="password"]', 'secret');

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('navigates to the offers once the valid form is sent', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fill('input[type="email"]', 'malak@example.com');
    fill('input[type="password"]', 'secret');

    element.querySelector('form')?.dispatchEvent(new Event('submit'));

    expect(navigate).toHaveBeenCalledWith(['/offers']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let element: HTMLElement;

  function fillForm(passwordConfirmation: string): void {
    const values: Record<string, string> = {
      firstName: 'Malak',
      lastName: 'Melhaoui',
      email: 'malak@example.com',
      password: 'secret',
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
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('keeps the button disabled when the passwords differ', () => {
    fillForm('autre');

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('navigates to the offers once the valid form is sent', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fillForm('secret');

    element.querySelector('form')?.dispatchEvent(new Event('submit'));

    expect(navigate).toHaveBeenCalledWith(['/offers']);
  });
});

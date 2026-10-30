import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  it('shows the logo and the navigation links', async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.header__logo')?.textContent).toContain('PlayMyJob');
    expect(element.querySelectorAll('.header__link').length).toBe(4);
  });
});

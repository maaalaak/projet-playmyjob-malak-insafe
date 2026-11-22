import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Header } from './header';

describe('Header', () => {
  async function createHeader(): Promise<ComponentFixture<Header>> {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    const fixture: ComponentFixture<Header> = TestBed.createComponent(Header);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => localStorage.clear());

  it('shows the logo, the navigation links and a login link', async () => {
    const element: HTMLElement = (await createHeader()).nativeElement;

    expect(element.querySelector('.header__logo')?.textContent).toContain('PlayMyJob');
    expect(element.querySelectorAll('.header__link').length).toBe(4);
    expect(element.querySelector('a[href="/login"]')).not.toBeNull();
  });

  it('logs the user out from the logout button', async () => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: {} }));
    const fixture: ComponentFixture<Header> = await createHeader();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(false);
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).not.toBeNull();
  });
});

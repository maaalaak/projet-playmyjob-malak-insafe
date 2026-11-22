import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  it('shows the concept, the example and a link to the offers', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Vis le métier');
    expect(element.querySelector('app-simulation-preview')).not.toBeNull();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/offers');
  });
});

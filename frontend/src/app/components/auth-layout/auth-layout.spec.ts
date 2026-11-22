import { TestBed } from '@angular/core/testing';
import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  it('shows the heading', () => {
    const fixture = TestBed.createComponent(AuthLayout);
    fixture.componentRef.setInput('heading', 'Connexion');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Connexion');
  });
});

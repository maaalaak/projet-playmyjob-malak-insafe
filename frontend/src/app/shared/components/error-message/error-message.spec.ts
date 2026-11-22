import { TestBed } from '@angular/core/testing';
import { ErrorMessage } from './error-message';

describe('ErrorMessage', () => {
  it('shows the message and warns the page when the user retries', () => {
    const fixture = TestBed.createComponent(ErrorMessage);
    fixture.componentRef.setInput('message', 'Le serveur ne répond pas.');
    fixture.detectChanges();

    const retry = vi.fn();
    fixture.componentInstance.retry.subscribe(retry);
    fixture.nativeElement.querySelector('button').click();

    expect(fixture.nativeElement.textContent).toContain('Le serveur ne répond pas.');
    expect(retry).toHaveBeenCalled();
  });
});

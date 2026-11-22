import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Simulation } from '../../interfaces/simulation';
import { HistoryList } from './history-list';

const FINISHED = {
  id: 'abc',
  offer: { title: 'Infirmier (H/F)', company: 'Clinique de Lyon' },
  status: 'finished',
  result: { title: 'Diplomate né', score: 78, strengths: [], advice: '' },
  createdAt: '2026-11-22T10:30:00.000Z',
} as unknown as Simulation;

const UNFINISHED = { ...FINISHED, id: 'def', status: 'playing', result: null } as unknown as Simulation;

describe('HistoryList', () => {
  it('shows each game and warns the page when the user asks to delete one', async () => {
    await TestBed.configureTestingModule({ imports: [HistoryList], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(HistoryList);
    fixture.componentRef.setInput('simulations', [FINISHED, UNFINISHED]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.history-list__item').length).toBe(2);
    expect(element.querySelector('a[href="/result/abc"]')).not.toBeNull();
    expect(element.textContent).toContain('Partie non terminée');

    const deleted = vi.fn();
    fixture.componentInstance.deleteRequested.subscribe(deleted);
    element.querySelector<HTMLButtonElement>('.history-list__item button')!.click();
    expect(deleted).toHaveBeenCalledWith(FINISHED);
  });
});

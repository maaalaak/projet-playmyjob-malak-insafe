import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AiResponse,
  AnalyzeDayRequest,
  CharacterReply,
  DayScript,
  ReplyRequest,
  SimulationResult,
  StartDayRequest,
} from '../interfaces/simulation';

@Injectable({
  providedIn: 'root',
})
export class SimulationTestService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = `${environment.apiUrl}/test/simulation`;

  public startDay(request: StartDayRequest): Observable<AiResponse<DayScript>> {
    return this.http.post<AiResponse<DayScript>>(`${this.baseUrl}/day`, request);
  }

  public reply(request: ReplyRequest): Observable<AiResponse<CharacterReply>> {
    return this.http.post<AiResponse<CharacterReply>>(`${this.baseUrl}/reply`, request);
  }

  public analyzeDay(request: AnalyzeDayRequest): Observable<AiResponse<SimulationResult>> {
    return this.http.post<AiResponse<SimulationResult>>(`${this.baseUrl}/analysis`, request);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelGraphRequest, ModelGraph, ModelCurrentWeatherRequest, ModelCurrentWeatherResponse } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class GraphServices {

  private baseUrl: string = "https://mision-3.onrender.com/graph";
  private _http: HttpClient = inject(HttpClient);

  public generatedGraph(request: ModelGraphRequest): Observable<ModelGraph> {
    return this._http.post<ModelGraph>(`${this.baseUrl}/generatedGraph`, request);
  }

  public getCurrentWeather(request: ModelCurrentWeatherRequest): Observable<ModelCurrentWeatherResponse> {
    return this._http.post<ModelCurrentWeatherResponse>(`${this.baseUrl}/currentWeather`, request);
  }
}

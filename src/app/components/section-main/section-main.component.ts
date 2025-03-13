import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import Plotly from "plotly.js-dist-min";
import { ModelCurrentWeatherResponse, ModelGraph, ModelGraphRequest } from '../../models/graph.model';
import { GraphServices } from '../../services/graph-services.service';

@Component({
  selector: 'app-section-main',
  templateUrl: './section-main.component.html',
  styleUrl: './section-main.component.css'
})
export class SectionMainComponent implements OnInit {

  @ViewChild("plotly", { static: true }) plotly!: ElementRef;
  protected graph: ModelGraph = {data: [], layout: {}}
  private _graphServices: GraphServices = inject(GraphServices);
  private weatherTypeSeleted: string = "sunny";
  protected currentWeather: ModelCurrentWeatherResponse = {} as ModelCurrentWeatherResponse;
  private requestData: ModelGraphRequest = {} as ModelGraphRequest;
  
  ngOnInit(): void {
    window.addEventListener("storage", this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === "request") {
      this.loadRequestFromStorage();
    }
  }

  private loadRequestFromStorage(): void {
    const storedRequest = localStorage.getItem("request");
    const storedCurrentWeather = localStorage.getItem("currentWeather");

    if (storedRequest && storedCurrentWeather) {
      this.currentWeather = JSON.parse(storedCurrentWeather);
      const request = JSON.parse(storedRequest);

      this.requestData = {
        params: request.params,
        weatherType: this.weatherTypeSeleted
      }
      this.generatedGraph(this.requestData);
    }
  }

  private generatedGraph(request: ModelGraphRequest): void {
    this._graphServices.generatedGraph(request).subscribe({
      next: (graph) => {
        this.graph = graph;
        this.createGraphElement();
      },
      error: (error) => {
        alert(error.message)
      }
    });
  }

  private createGraphElement(): void {
    const plotlyNew = Plotly.newPlot(this.plotly.nativeElement, this.graph.data, this.graph.layout);

    plotlyNew.then(() => {
      Plotly.relayout(this.plotly.nativeElement, {width: this.plotly.nativeElement.clientWidth, height: this.plotly.nativeElement.clientHeight});
    })

    plotlyNew
      .then(() => {
        window.addEventListener('resize', () => {
          Plotly.relayout(this.plotly.nativeElement, { width: this.plotly.nativeElement.clientWidth, height: this.plotly.nativeElement.clientHeight });
        });
      });
  }


  protected seletedWeatherType(value: string): void {
    this.weatherTypeSeleted = value;
    this.requestData.weatherType = this.weatherTypeSeleted;
    this.generatedGraph(this.requestData);
  }
}

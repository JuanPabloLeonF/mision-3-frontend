import { Component, inject, model, ModelSignal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModelCurrentWeatherRequest } from '../../models/graph.model';
import { GraphServices } from '../../services/graph-services.service';

@Component({
  selector: 'app-nav',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  public closeNav: ModelSignal<boolean> = model<boolean>(true);
  private _graphService: GraphServices = inject(GraphServices);
  protected formGroup!: FormGroup;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected inputFocus: { longitude: boolean, latitude: boolean, timezone: boolean } = { longitude: false, latitude: false, timezone: false };

  constructor() {
    this.formGroup = this.formBuilder.group({
      "longitude": ["", [
        Validators.required, 
        Validators.pattern("^[-+]?([1-9]\\d{0,2}|1\\d{3}|2\\d{3}|3[0-4]\\d{2}|35[0-9]{1})\\.\\d{1,6}$")
      ]],
      "latitude": ["", [
        Validators.required, 
        Validators.pattern("^[-+]?([1-9]\\d{0,2}|1\\d{3}|2\\d{3}|3[0-4]\\d{2}|35[0-9]{1})\\.\\d{1,6}$")
      ]],
      "timezone": ["", [
        Validators.required, 
        Validators.pattern("^[A-Za-z]+\/[A-Za-z]+$")
      ]],
    })
  }

  ngOnInit(): void {

    this.formGroup.get("longitude")?.valueChanges.subscribe(value => {
      (value) ? this.inputFocus.longitude = true : this.inputFocus.longitude = false;
    });

    this.formGroup.get("latitude")?.valueChanges.subscribe(value => {
      (value) ? this.inputFocus.latitude = true : this.inputFocus.latitude = false;
    });

    this.formGroup.get("timezone")?.valueChanges.subscribe(value => {
      (value) ? this.inputFocus.timezone = true : this.inputFocus.timezone = false;
    });
  }

  protected onSumit(): void {
    if (this.validateForm()) {
      const request: ModelCurrentWeatherRequest = {
        params: {
          longitude: this.formGroup.get("longitude")?.value,
          latitude: this.formGroup.get("latitude")?.value,
        },
        timeZone: this.formGroup.get("timezone")?.value,
      }

      this.getRequestCurrent(request);

      localStorage.setItem("request", JSON.stringify(request));

      window.dispatchEvent(new StorageEvent("storage", { key: "request", newValue: JSON.stringify(request) }));

      this.formGroup.reset();
      this.inputFocus = { longitude: false, latitude: false, timezone: false };
    }
  }

  private getRequestCurrent(request: ModelCurrentWeatherRequest): void {
    this._graphService.getCurrentWeather(request).subscribe({
      next: (weather) => {
        localStorage.setItem("currentWeather", JSON.stringify(weather));
        window.dispatchEvent(new StorageEvent("storage", { key: "currentWeather", newValue: JSON.stringify(weather) }));
        this.closeNavSection();
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  } 

  private validateForm(): boolean {

    let validateForm: boolean = false;

    if (this.formGroup.invalid) {
      let message: string = "";

      let fieldJsonLongitude = {
        data: "longitude", 
        messageRequired: "⚠️ La longitud es obligatoria.\n",
        messagePattern: "❌ La longitud debe ser un número válido con hasta 6 decimales.\n",
        required: "required",
        pattern: "pattern"
      }

      message += this.validateField(fieldJsonLongitude);

      let fieldJsonLatitude = {
        data: "latitude", 
        messageRequired: "⚠️ La latitud es obligatoria.\n",
        messagePattern: "❌ La latitud debe ser un número válido con hasta 6 decimales.\n",
        required: "required",
        pattern: "pattern"
      }

      message += this.validateField(fieldJsonLatitude);

      let fieldJsonTimezone = {
        data: "timezone", 
        messageRequired: "⚠️ La zona horaria es obligatoria.\n",
        messagePattern: "❌ La zona horaria debe estar en formato 'America/Bogota'.\n",
        required: "required",
        pattern: "pattern"
      }

      message += this.validateField(fieldJsonTimezone);
  
      alert(message);
      return validateForm;
    } else {
      return validateForm = true;
    }
  }

  private validateField(
    fieldJson: {
      data: string, 
      messageRequired: string,
      messagePattern: string,
      required: string,
      pattern: string
    }
  ): string {

    let message: string = "";

    if (this.formGroup.get(fieldJson.data)?.hasError(fieldJson.required)) {
      message += fieldJson.messageRequired;
    } else if (this.formGroup.get(fieldJson.data)?.hasError(fieldJson.pattern)) {
      message += fieldJson.messagePattern;
    }

    return message;
  }

  protected getLocation(): void {
    if (!navigator.geolocation) {
      alert("Geolocalización no es soportada por tu navegador.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
        this.formGroup.patchValue({
          latitude,
          longitude,
          timezone
        });

      },
      (error) => {
        alert(`Error obteniendo la ubicación: ${error.message}`);
      }
    );
  }
  
  protected closeNavSection(): void {
    this.closeNav.set(false);
  }

}

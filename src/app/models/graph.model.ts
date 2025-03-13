export interface ModelGraph {
    data: [];
    layout: {};
}

export interface ModelGraphRequest {
    params: {
        latitude: number;
        longitude: number;
    };
    weatherType: string;
}

export interface ModelCurrentWeatherRequest {
    params: {
        latitude: number;
        longitude: number;
    },
    timeZone: string
}

export interface ModelCurrentWeatherResponse {
    day: string,
    hour: string,
    temperature: string,
    temperatureMax: string,
    temperatureMin: string,
    weather: string
}

export interface ModelDataError {
    message: string;
    status: string;
    statusCode: number;
}
export interface CurrentWeather {
    latitude:              number;
    longitude:             number;
    generationtime_ms:     number;
    utc_offset_seconds:    number;
    timezone:              string;
    timezone_abbreviation: string;
    elevation:             number;
    current_units:         Units;
    current:               Current;
    hourly_units:          Units;
    hourly:                Hourly;
}

export interface Current {
    time:           string;
    interval:       number;
    temperature_2m: number;
    wind_speed_10m: number;
    weathercode: number;
}

export interface Units {
    time:                  string;
    interval?:             string;
    temperature_2m:        string;
    wind_speed_10m:        string;
    relative_humidity_2m?: string;
}

export interface Hourly {
    time:                 string[];
    temperature_2m:       number[];
    relative_humidity_2m: number[];
    wind_speed_10m:       number[];
}

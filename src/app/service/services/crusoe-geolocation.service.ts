import {Injectable} from "@angular/core";
import {Geolocation, Geoposition} from "@ionic-native/geolocation/ngx";

@Injectable(
  {
    providedIn: "root"
  }
)
export class CrusoeGeolocationService {
  constructor(
    private geolocation: Geolocation
  ) {
  }

  public async getCurrentGeolocation(): Promise<Geoposition> {
    return this.geolocation.getCurrentPosition();
  }
}

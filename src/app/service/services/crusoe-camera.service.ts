import {Injectable} from "@angular/core";
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Injectable(
  {
    providedIn: "root"
  }
)
export class CrusoeCameraService {
  constructor() {
  }

  public async takePicture(): Promise<string> {
    try {
      const picture = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      })
      return picture.dataUrl;
    } catch (error) {
      console.error(error);
    }
  }
}

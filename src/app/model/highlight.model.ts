import {HighlightMisc} from "./highlight.misc.model";
import {CameraPhoto} from "@capacitor/core";
import {Picture} from "./picture.model";

export class Highlight {
  constructor(
    public latitude: number,
    public longitude: number,
    public height: number,
    public timestamp: number,
    public pictures: Array<Picture>,
    public headline: string,
    public description: string,
    public miscs: Array<HighlightMisc>,
    public tags: Array<string>
  ) {
  }
}

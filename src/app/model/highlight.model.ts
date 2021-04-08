import {Timestamp} from "rxjs";
import {Picture} from "./picture.model";
import {HighlightMisc} from "./highlight.misc.model";

export class Highlight {
  constructor(
    public latitude: number,
    public longitude: number,
    public height: number,
    public timestamp: Date,
    public pictures: Array<Picture>,
    public headline: string,
    public description: string,
    public miscs: Array<HighlightMisc>,
    public tags: Array<string>
  ) {
  }
}

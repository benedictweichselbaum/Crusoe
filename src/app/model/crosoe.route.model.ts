import {Point} from "./point.model";
import {Highlight} from "./highlight.model";

export class CrusoeRoute {
  constructor(
    public points: Array<Point>,
    public highlights: Array<Highlight>,
    public headline: string,
    public description: string,
    public tags: Array<string>,
    public previewPicture: string,
    public departureTimestamp: Date,
    public arrivalTimestamp: Date
  ) {
  }
}

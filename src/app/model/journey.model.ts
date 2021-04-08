import {CrusoeRoute} from "./crosoe.route.model";
import {Highlight} from "./highlight.model";

export class Journey {

  constructor(
    public id: number,
    public routes: Array<CrusoeRoute>,
    public name: string,
    public subtitle: string,
    public tags: Array<string>,
    public description: string,
    public ownJourney: boolean,
    public departureTimestamp: Date,
    public arrivalTimestamp: Date,
    public highlights: Array<Highlight>,
    public previewPicture: string
  ) {
  }
}

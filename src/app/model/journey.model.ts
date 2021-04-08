import {CrusoeRoute} from "./crosoe.route.model";
import {Highlight} from "./highlight.model";

export class Journey {

  constructor(
    public key: string,
    public routes: Array<CrusoeRoute>,
    public name: string,
    public subtitle: string,
    public tags: Array<string>,
    public description: string,
    public ownJourney: boolean,
    public departureTimestamp: number,
    public arrivalTimestamp: number,
    public highlights: Array<Highlight>,
    public previewPicture: string
  ) {
  }
}

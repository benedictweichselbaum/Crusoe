import {Highlight} from "./highlight.model";
import {CrusoeRouteDtoModel} from "./crusoe.route.dto.model";

export class JourneyDtoModel {

  constructor(
    public routes: Array<CrusoeRouteDtoModel>,
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

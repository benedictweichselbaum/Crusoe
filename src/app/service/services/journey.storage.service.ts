import {Injectable} from "@angular/core";
import {Journey} from "../../model/journey.model";
import {Storage} from "@ionic/storage-angular";

@Injectable(
  {
    providedIn: "root"
  }
)
export class JourneyStorageService {

  constructor(public storage: Storage) {
    this.storage.create();
  }

  public async read(): Promise<Journey[]> {
    const journeys: Array<Journey> = [];
    await this.storage.forEach((value, key, i) => {
      journeys.push(value)
    });
    return journeys;
  }

  public async readSingleJourney(key: string): Promise<Journey> {
    return await this.storage.get(key);
  }

  public async create(key: string, journey: Journey) {
    return await this.storage.set(key, journey);
  }

  public async update(key: string, journey: Journey) {
    return await this.storage.set(key, journey);
  }

  public async deleteAll() {
    return await this.storage.clear();
  }

  public async delete(key: string) {
    return await this.storage.remove(key);
  }

  public async nextKey(): Promise<string> {
    const existentIds = await this.storage.keys();
    let maxId = 1;
    existentIds.forEach(key => {
      maxId = Math.max(maxId, Number(key))
    });
    return String(maxId + 1);
  }
}

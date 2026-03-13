import { getRepository } from "typeorm";
import { Ride } from "../rides/ride.model";

export async function cleanupOldRides() {
  const repo = getRepository(Ride);
  const oldRides = await repo
    .createQueryBuilder()
    .where("createdAt < NOW() - INTERVAL '1 months'")
    .getMany();

  if(oldRides.length) {
    await repo.remove(oldRides);
    console.log(`Archivadas ${oldRides.length} rides antiguas`);
  }
}
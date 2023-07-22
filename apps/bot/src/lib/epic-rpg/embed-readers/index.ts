import lootboxReader from './lootbox.reader';
import petsReader from './pets.reader';
import inventoryReader from './inventory.reader';
import guildReader from './guild.reader';
import profileReader from './profile.reader';
import progressReader from './progress.reader';
import wildPetReader from './wild-pet.reader';

const embedReaders = {
  lootbox: lootboxReader,
  pets: petsReader,
  inventory: inventoryReader,
  guild: guildReader,
  profile: profileReader,
  progress: progressReader,
  wildPet: wildPetReader,
};

export default embedReaders;

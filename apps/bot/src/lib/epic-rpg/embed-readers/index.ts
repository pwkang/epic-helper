import lootboxReader from './lootbox.reader';
import petsReader from './pets.reader';
import inventoryReader from './inventory.reader';
import guildReader from './guild.reader';
import profileReader from './profile.reader';
import progressReader from './progress.reader';
import wildPetReader from './wild-pet.reader';
import duelResultReader from './duel-result.reader';
import {_guildListReader} from './guild-list.reader';
import _artifactsReader from './artifacts.reader';

const embedReaders = {
  lootbox: lootboxReader,
  pets: petsReader,
  inventory: inventoryReader,
  guild: guildReader,
  profile: profileReader,
  progress: progressReader,
  wildPet: wildPetReader,
  duelResult: duelResultReader,
  guildList: _guildListReader,
  artifacts: _artifactsReader,
};

export default embedReaders;

import lootboxReader from './lootbox.reader';
import petsReader from './pets.reader';
import inventoryReader from './inventory.reader';

const embedReaders = {
  lootbox: lootboxReader,
  pets: petsReader,
  inventory: inventoryReader,
};

export default embedReaders;

import {Embed, User} from 'discord.js';
import scanInventory from '../../../../utils/epic_rpg/inventory/scanInventory';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

const RUBY_EMOJI = '<:ruby:603304907650629653>';

interface IRpgInventory {
  author: User;
  embed: Embed;
}

export default async function rpgInventory({author, embed}: IRpgInventory) {
  const inventory = scanInventory({embed});
  await updateUserRubyAmount({
    userId: author.id,
    type: 'set',
    ruby: inventory.ruby ?? 0,
  });
}

interface IIsUserInventory {
  embed: Embed;
  author: User;
}

export const isUserInventory = ({embed, author}: IIsUserInventory) =>
  embed.author?.name === `${author.username} — inventory`;

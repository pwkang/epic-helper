import {RPG_COMMAND_TYPE} from '../../constants/epic_rpg/rpg';
import {User} from 'discord.js';
import {getUserAccount} from '../../models/user/user.service';

interface IGetCdReduction {
  commandType: ValuesOf<Omit<typeof RPG_COMMAND_TYPE, 'pet'>>;
  userId: User['id'];
  cooldown: number;
}

const donorCdReduction = {
  nonDonor: 1,
  donor10: 0.9,
  donor20: 0.8,
  donor35: 0.65,
} as const;

const canReducedByDonor = {
  daily: false,
  weekly: false,
  lootbox: false,
  vote: false,
  hunt: true,
  adventure: true,
  training: true,
  duel: true,
  quest: true,
  working: true,
  farm: true,
  horse: true,
  arena: true,
  dungeon: true,
  use: false,
};

export const calcReducedCd = async ({commandType, userId, cooldown}: IGetCdReduction) => {
  const userAccount = await getUserAccount(userId);
  if (!userAccount) return cooldown;
  const donor = userAccount.config.donor;
  const donorP = userAccount.config.donorP;

  switch (commandType) {
    case RPG_COMMAND_TYPE.hunt:
      cooldown *= donorP ? donorCdReduction[donorP] : donorCdReduction[donor];
      break;
    default:
      cooldown *= canReducedByDonor[commandType] ? donorCdReduction[donor] : 1;
      break;
  }

  return cooldown;
};

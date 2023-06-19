import {Client} from 'discord.js';
import {userPetServices} from '../../../../models/user-pet/user-pet.service';
import {IUser} from '../../../../models/user/user.type';
import {getReminderChannel} from '../reminder-channel';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic-rpg/rpg';
import {djsMessageHelper} from '../../../discord.js/message';
import {convertNumToPetId} from '@epic-helper/utils';

export const userPetReminderTimesUp = async (client: Client, user: IUser) => {
  const channelId = await getReminderChannel({
    commandType: RPG_COMMAND_TYPE.pet,
    userId: user.userId,
    client,
  });
  if (!channelId || !client.channels.cache.has(channelId)) return;

  const userId = user.userId;
  const pets = await userPetServices.getUserReadyPets({userId});
  const petIds = pets.map((pet) => pet.petId);
  const petIdsStr = petIds.map(convertNumToPetId).map((i) => i.toUpperCase());
  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      content: `<@${userId}> pets \`${petIdsStr.join(' ')}\` ready to claim!`,
    },
  });
  await userPetServices.updateRemindedPets({
    petIds,
    userId,
  });
};

import {Client} from 'discord.js';
import {getUserReadyPets, updateRemindedPets} from '../../../../models/user-pet/user-pet.service';
import {convertNumToPetId} from '../../../../utils/petIdConversion';
import sendMessage from '../../../discord.js/message/sendMessage';
import {IUser} from '../../../../models/user/user.type';
import {getReminderChannel} from '../reminderChannel';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';

export const userPetReminderTimesUp = async (client: Client, user: IUser) => {
  const channelId = await getReminderChannel({
    commandType: RPG_COMMAND_TYPE.pet,
    userId: user.userId,
    client,
  });
  if (!channelId || !client.channels.cache.has(channelId)) return;

  const userId = user.userId;
  const pets = await getUserReadyPets({userId});
  const petIds = pets.map((pet) => pet.petId);
  const petIdsStr = petIds.map(convertNumToPetId).map((i) => i.toUpperCase());
  await sendMessage({
    client,
    channelId,
    options: {
      content: `<@${userId}> pets \`${petIdsStr.join(' ')}\` ready to claim!`,
    },
  });
  await updateRemindedPets({
    petIds,
    userId,
  });
};

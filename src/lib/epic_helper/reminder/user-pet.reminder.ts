import {Client} from 'discord.js';
import {getUserReadyPets, updateRemindedPets} from '../../../models/user-pet/user-pet.service';
import {convertNumToPetId} from '../../../utils/epic_rpg/pet/petIdConversion';
import sendMessage from '../../discord.js/message/sendMessage';
import {IUser} from '../../../models/user/user.type';

export const userPetReminderTimesUp = async (client: Client, user: IUser) => {
  const userId = user.userId;
  const pets = await getUserReadyPets({userId});
  const petIds = pets.map((pet) => pet.petId);
  const petIdsStr = petIds.map(convertNumToPetId).map((i) => i.toUpperCase());
  await sendMessage({
    client,
    channelId: user.config.channel,
    options: {
      content: `<@${userId}> pets \`${petIdsStr.join(' ')}\` ready to claim!`,
    },
  });
  await updateRemindedPets({
    petIds,
    userId,
  });
};

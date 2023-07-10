import {Client} from 'discord.js';
import {getReminderChannel} from '../reminder-channel';
import {djsMessageHelper} from '../../../discordjs/message';
import {convertNumToPetId, logger} from '@epic-helper/utils';
import {IUser} from '@epic-helper/models';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {generateUserReminderMessage} from '../message-generator/custom-message-generator';

export const userPetReminderTimesUp = async (client: Client, userAccount: IUser) => {
  const channelId = await getReminderChannel({
    commandType: RPG_COMMAND_TYPE.pet,
    userId: userAccount.userId,
    client,
  });
  if (!channelId || !client.channels.cache.has(channelId)) return;

  const userId = userAccount.userId;
  const pets = await userPetServices.getUserReadyPets({userId});
  const petIds = pets.map((pet) => pet.petId);

  await userPetServices.updateRemindedPets({
    petIds,
    userId,
  });
  if (!userAccount.toggle.reminder.pet) return;

  const nextReminder = await userReminderServices.getNextReadyCommand({
    userId,
  });

  const reminderMessage = await generateUserReminderMessage({
    client,
    userId,
    userAccount: userAccount,
    type: RPG_COMMAND_TYPE.pet,
    nextReminder: nextReminder ?? undefined,
    readyPetsId: petIds,
  });

  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      content: reminderMessage,
    },
  });
};

import {IUserConfig} from '../config.type';
import {removeUserHealReminder, setUserHealReminder} from '../../../../../models/user/user.service';
import djsInteractionHelper from '../../../../../lib/discord.js/interaction';

export const setHealReminder = async ({client, interaction}: IUserConfig) => {
  const userId = interaction.user.id;
  const toRemove = interaction.options.getBoolean('remove');
  const hp = interaction.options.getNumber('hp');

  let message;
  if (toRemove) {
    await removeUserHealReminder({
      userId,
    });
    message = 'Heal reminder removed';
  } else if (hp) {
    await setUserHealReminder({
      userId,
      hp,
    });
    message = `Heal reminder set to ${hp}`;
  } else {
    message = 'Please provide a valid HP target';
  }

  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      content: message,
    },
  });
};

import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import embedsList from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'toggle',
  commands: ['toggle', 't'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userToggle = await userService.getUserToggle(message.author.id);
    if (!userToggle) return;

    const embed = embedsList.toggle({
      embedsInfo: [
        {
          title: 'Common Features',
          children: [
            {
              value: userToggle.reminder.pet,
              label: 'Pets Reminder',
            },
            {
              value: userToggle.training.all,
              label: 'Give answer on training',
              children: [
                {
                  value: userToggle.training.ruby,
                  label: 'Ruby question',
                },
                {
                  value: userToggle.training.basic,
                  label: 'Other questions',
                },
              ],
            },
            {
              value: userToggle.petCatch,
              label: 'Give actions to catch pet',
            },
            {
              value: userToggle.emoji,
              label: 'Reminder emoji',
            },
            {
              value: userToggle.quest.all,
              label: 'Show cooldown on quest',
              children: [
                {
                  value: userToggle.quest.arena,
                  label: 'Arena',
                },
                {
                  value: userToggle.quest.miniboss,
                  label: 'Miniboss',
                },
              ],
            },
            {
              value: userToggle.heal,
              label: 'Heal reminder',
            },
            {
              value: userToggle.slash,
              label: 'Reminder with slash commands',
            },
            {
              value: userToggle.countdown.all,
              label: 'Show upcoming reminder countdown',
            },
            // {
            //   value: userToggle.event.loveShareAdv,
            //   label: 'Adventure -10% cooldown',
            // },
            // {
            //     path: "toggle.world.all",
            //     label: "World boost reminder",
            //     children: [
            //         {
            //             path: "toggle.world.monster",
            //             label: "Monster drop"
            //         },
            //         {
            //             path: "toggle.world.lootbox",
            //             label: "Lootbox drop"
            //         }
            //     ]
            // },
          ],
        },
        {
          title: 'Custom Reminder',
          value: userToggle.reminder.all,
          children: [
            {
              value: userToggle.reminder.all,
              label: 'All',
            },
            {
              value: userToggle.reminder.daily,
              label: 'Daily',
            },
            {
              value: userToggle.reminder.weekly,
              label: 'Weekly',
            },
            {
              value: userToggle.reminder.lootbox,
              label: 'Lootbox',
            },
            {
              value: userToggle.reminder.vote,
              label: 'Vote',
            },
            {
              value: userToggle.reminder.hunt,
              label: 'Hunt',
            },
            {
              value: userToggle.reminder.adventure,
              label: 'Adventure',
            },
            {
              value: userToggle.reminder.training,
              label: 'Training',
            },
            {
              value: userToggle.reminder.duel,
              label: 'Duel',
            },
            {
              value: userToggle.reminder.quest,
              label: 'Quest',
            },
            {
              value: userToggle.reminder.working,
              label: 'Working',
            },
            {
              value: userToggle.reminder.farm,
              label: 'Farm',
            },
            {
              value: userToggle.reminder.horse,
              label: 'Horse',
            },
            {
              value: userToggle.reminder.arena,
              label: 'Arena',
            },
            {
              value: userToggle.reminder.dungeon,
              label: 'Dungeon',
            },
            {
              value: userToggle.reminder.use,
              label: 'Epic Items',
            },
          ],
        },
        {
          title: 'Custom DMs',
          value: userToggle.dm.all,
          children: [
            {
              value: userToggle.dm.all,
              label: 'All',
            },
            {
              value: userToggle.dm.daily,
              label: 'Daily',
            },
            {
              value: userToggle.dm.weekly,
              label: 'Weekly',
            },
            {
              value: userToggle.dm.lootbox,
              label: 'Lootbox',
            },
            {
              value: userToggle.dm.vote,
              label: 'Vote',
            },
            {
              value: userToggle.dm.hunt,
              label: 'Hunt',
            },
            {
              value: userToggle.dm.adventure,
              label: 'Adventure',
            },
            {
              value: userToggle.dm.training,
              label: 'Training',
            },
            {
              value: userToggle.dm.duel,
              label: 'Duel',
            },
            {
              value: userToggle.dm.quest,
              label: 'Quest',
            },
            {
              value: userToggle.dm.working,
              label: 'Working',
            },
            {
              value: userToggle.dm.farm,
              label: 'Farm',
            },
            {
              value: userToggle.dm.horse,
              label: 'Horse',
            },
            {
              value: userToggle.dm.arena,
              label: 'Arena',
            },
            {
              value: userToggle.dm.dungeon,
              label: 'Dungeon',
            },
            {
              value: userToggle.dm.use,
              label: 'Epic Items',
            },
            {
              value: userToggle.dm.pet,
              label: 'Pets',
            },
            // {
            //     path: "toggle.dm.world",
            //     label: "World boost"
            // }
          ],
        },
        {
          title: 'Custom Mentions',
          value: userToggle.mentions.all,
          children: [
            {
              value: userToggle.mentions.all,
              label: 'All',
            },
            {
              value: userToggle.mentions.daily,
              label: 'Daily',
            },
            {
              value: userToggle.mentions.weekly,
              label: 'Weekly',
            },
            {
              value: userToggle.mentions.lootbox,
              label: 'Lootbox',
            },
            {
              value: userToggle.mentions.vote,
              label: 'Vote',
            },
            {
              value: userToggle.mentions.hunt,
              label: 'Hunt',
            },
            {
              value: userToggle.mentions.adventure,
              label: 'Adventure',
            },
            {
              value: userToggle.mentions.training,
              label: 'Training',
            },
            {
              value: userToggle.mentions.duel,
              label: 'Duel',
            },
            {
              value: userToggle.mentions.quest,
              label: 'Quest',
            },
            {
              value: userToggle.mentions.working,
              label: 'Working',
            },
            {
              value: userToggle.mentions.farm,
              label: 'Farm',
            },
            {
              value: userToggle.mentions.horse,
              label: 'Horse',
            },
            {
              value: userToggle.mentions.arena,
              label: 'Arena',
            },
            {
              value: userToggle.mentions.dungeon,
              label: 'Dungeon',
            },
            {
              value: userToggle.mentions.use,
              label: 'Epic Items',
            },
            {
              value: userToggle.mentions.pet,
              label: 'Pets',
            },
            {
              value: userToggle.mentions.petCatch,
              label: 'Pet Catch',
            },
            {
              value: userToggle.mentions.trainingAnswer,
              label: 'Training Answer',
            },
          ],
        },
      ],
      embedAuthor: {
        name: `${message.author.username}'s toggle`,
        iconURL: message.author.avatarURL() ?? undefined,
      },
    });
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {embeds: [embed]},
    });
  },
};

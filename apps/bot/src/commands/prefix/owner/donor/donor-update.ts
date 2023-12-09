import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {donorService} from '@epic-helper/services';
import {PATREON_PATRON_STATUS, patreonApi} from '@epic-helper/libs';


export default <PrefixCommand>{
  name: 'donorUpdate',
  commands: ['donor update', 'donor u', 'd update', 'd u'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const patrons = await patreonApi.getPatrons();
    await donorService.registerDonors(
      patrons.map((patron) => ({
        discord: {
          userId: patron.discord.userId,
        },
        patreon: {
          email: patron.patreon.email,
          userId: patron.patreon.userId,
          memberId: patron.patreon.memberId,
          fullName: patron.patreon.fullName,
        },
        tier: patron.currentTier,
        expiresAt: patron.subscription.nextChargeDate,
        active: patron.subscription.patronStatus === PATREON_PATRON_STATUS.activePatron,
      })),
    );
    await djsMessageHelper.send({
      options: {
        content: 'Done',
      },
      channelId: message.channel.id,
      client,
    });
  },
};

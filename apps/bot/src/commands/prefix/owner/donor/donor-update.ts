import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import patreonApi from '../../../../lib/patreon/api/patreon';
import {toPatrons} from '../../../../lib/patreon/api/patreon.transformer';
import donorService from '../../../../services/database/donor.service';
import ms from 'ms';
import {PATREON_PAYMENT_STATUS} from '../../../../lib/patreon/patreon.constant';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'donorUpdate',
  commands: ['donor update', 'donor u', 'd update', 'd u'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const data = await patreonApi.getPatrons(client);
    if (!data) return;
    const patrons = toPatrons({
      data: data.data,
      included: data.included
    });
    await donorService.registerDonors(
      patrons.map((patron) => ({
        discord: {
          userId: patron.discord.userId
        },
        patreon: {
          email: patron.patreon.email,
          userId: patron.patreon.userId,
          memberId: patron.patreon.memberId,
          fullName: patron.patreon.fullName
        },
        tier: patron.currentTier,
        expiresAt:
          patron.subscription.lastChargeDate &&
          patron.subscription.lastChargeStatus === PATREON_PAYMENT_STATUS.paid
            ? new Date(
              patron.subscription.lastChargeDate?.getTime() + ms('31d')
            )
            : patron.subscription.lastChargeDate
      }))
    );
    await djsMessageHelper.send({
      options: {
        content: 'Done'
      },
      channelId: message.channel.id,
      client
    });
  }
};

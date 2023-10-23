import type {Client, Guild, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {djsMemberHelper} from '../../../discordjs/member';
import {djsMessageHelper} from '../../../discordjs/message';
import {BOT_COLOR} from '@epic-helper/constants';
import type {ITTVerificationRules} from '@epic-helper/models';
import messageFormatter from '../../../discordjs/message-formatter';
import toggleServerChecker from '../../toggle-checker/server';

interface ICheckAndAssignTTRole {
  client: Client;
  server: Guild;
  author: User;
  channelId: string;
  timeTravels: number;
}

export const _verifyTT = async ({
  server,
  author,
  client,
  channelId,
  timeTravels,
}: ICheckAndAssignTTRole) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return;

  const toggleServer = await toggleServerChecker({
    serverId: server.id,
  });
  if (!toggleServer?.ttVerification) return;

  const ttVerificationSettings = serverAccount.settings.ttVerification;
  if (!ttVerificationSettings) return;
  if (ttVerificationSettings.channelId !== channelId) return;

  const member = await djsMemberHelper.getMember({
    client,
    serverId: server.id,
    userId: author.id,
  });
  if (!member) return;

  const fulfilledRoles = ttVerificationSettings.rules.filter(
    (rule) =>
      rule.minTT <= timeTravels && (!rule.maxTT || rule.maxTT >= timeTravels),
  );
  const notFulfilledRoles = ttVerificationSettings.rules.filter(
    (rule) =>
      rule.minTT > timeTravels || (rule.maxTT && rule.maxTT < timeTravels),
  );

  const rolesToAssign = fulfilledRoles.filter(
    (role) => !member.roles.cache.has(role.roleId),
  );
  if (rolesToAssign.length) {
    await djsMemberHelper.addRoles({
      client,
      serverId: server.id,
      roleIds: rolesToAssign.map((role) => role.roleId),
      userId: author.id,
    });
  }

  const rolesToRemove = notFulfilledRoles.filter((role) =>
    member.roles.cache.has(role.roleId),
  );
  if (rolesToRemove.length) {
    await djsMemberHelper.removeRoles({
      client,
      serverId: server.id,
      roleIds: rolesToRemove.map((role) => role.roleId),
      userId: author.id,
    });
  }

  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [
        getEmbed({
          server,
          author,
          addedRole: rolesToAssign,
          removedRole: rolesToRemove,
        }),
      ],
    },
  });
};

interface IGetEmbed {
  server: Guild;
  author: User;
  addedRole: ITTVerificationRules[];
  removedRole: ITTVerificationRules[];
}

const getEmbed = ({author, addedRole, removedRole}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: author.username,
    iconURL: author.avatarURL() || undefined,
  });
  if (addedRole.length) {
    embed.addFields({
      name: 'Added roles',
      value:
        addedRole
          .map((role) => `- ${messageFormatter.role(role.roleId)}`)
          .join('\n') || '-',
    });
  }
  if (removedRole.length) {
    embed.addFields({
      name: 'Removed roles',
      value:
        removedRole
          .map((role) => `- ${messageFormatter.role(role.roleId)}`)
          .join('\n') || '-',
    });
  }
  if (!addedRole.length && !removedRole.length) {
    embed.setDescription('No action was performed.');
  } else {
    embed.addFields({
      name: 'Info',
      value: addedRole.length
        ? addedRole.map((role) => role.message).join('\n')
        : '-',
    });
  }

  return embed;
};

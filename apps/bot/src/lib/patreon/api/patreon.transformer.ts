import {
  IFetchPatreonCampaignMembersResponse,
  IFetchPatreonCampaignResponse,
  IIncludeItem,
  IUserAttributes,
} from '../type';
import {
  PATREON_INCLUDE_TYPE,
  PATREON_PATRON_STATUS,
  PATREON_PAYMENT_STATUS,
} from '../patreon.constant';
import {ValuesOf} from '@epic-helper/ts-utils';

interface ITier {
  id: string;
  amountCents?: number;
  discordRoleIds?: string[];
  totalPatrons?: number;
  title?: string;
}

interface ICampaignInfo {
  totalPatrons?: number;
  tiers: ITier[];
}

export const toCampaignInfo = (response: IFetchPatreonCampaignResponse): ICampaignInfo[] => {
  const campaignInfo: ICampaignInfo[] = [];

  for (let campaign of response.data) {
    const tiers: ITier[] = [];
    for (let tier of campaign.relationships.tiers.data) {
      const includedTier = response.included.find((i) => i.id === tier.id);
      if (includedTier) {
        tiers.push({
          id: tier.id,
          amountCents: includedTier.attributes.amount_cents,
          discordRoleIds: includedTier.attributes.discord_role_ids,
          totalPatrons: includedTier.attributes.patron_count,
          title: includedTier.attributes.title,
        });
      }
    }
    campaignInfo.push({
      totalPatrons: campaign.attributes.patron_count,
      tiers,
    });
  }
  return campaignInfo;
};

interface IPatron {
  memberId: string;
  email?: string;
  subscription: {
    lastChargeDate?: Date;
    lastChargeStatus?: ValuesOf<typeof PATREON_PAYMENT_STATUS>;
    lifetimeSupportCents?: number;
    nextChargeDate?: Date;
    patronStatus?: ValuesOf<typeof PATREON_PATRON_STATUS>;
    pledgeRelationshipStart?: Date;
  };
  currentTier: {
    id: string;
  };
  discord: {
    userId?: string;
  };
}

export const toPatrons = (response: IFetchPatreonCampaignMembersResponse): IPatron[] => {
  const patrons: IPatron[] = [];
  for (let member of response.data) {
    const userAttributes = response.included.find(
      (i) => i.type === PATREON_INCLUDE_TYPE.user && i.id === member.relationships.user.data.id
    ) as IIncludeItem<IUserAttributes> | undefined;
    const lastChargeDate = member.attributes.last_charge_date;
    const lastChargeStatus = member.attributes.last_charge_status;
    const lifetimeSupportCents = member.attributes.lifetime_support_cents;
    const nextChargeDate = member.attributes.next_charge_date;
    const patronStatus = member.attributes.patron_status;
    const pledgeRelationshipStart = member.attributes.pledge_relationship_start;
    const currentTierId = member.relationships.currently_entitled_tiers.data[0]?.id;
    const discordUserId = userAttributes?.attributes.social_connections?.discord?.user_id;

    const patron: IPatron = {
      memberId: member.id,
      subscription: {
        lastChargeDate: lastChargeDate ? new Date(lastChargeDate) : undefined,
        lastChargeStatus,
        lifetimeSupportCents,
        nextChargeDate: nextChargeDate ? new Date(nextChargeDate) : undefined,
        patronStatus,
        pledgeRelationshipStart: pledgeRelationshipStart
          ? new Date(pledgeRelationshipStart)
          : undefined,
      },
      currentTier: {
        id: currentTierId,
      },
      discord: {
        userId: discordUserId ?? undefined,
      },
    };
    patrons.push(patron);
  }

  return patrons;
};

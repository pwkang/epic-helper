import patreonLib from './patreon.lib';
import * as dotenv from 'dotenv';
import axios from 'axios';
import {logger} from '../../utils/logger';
import {IFetchPatreonCampaignMembersResponse, IFetchPatreonCampaignResponse} from './type';
import {toCampaignInfo, toPatrons} from './patreon.transformer';

dotenv.config();

const PATREON_CAMPAIGN_ID = process.env.PATREON_CAMPAIGN_ID!;
const PATREON_ACCESS_TOKEN = process.env.PATREON_ACCESS_TOKEN!;

const patreonAxiosClient = axios.create({
  headers: {
    Authorization: `Bearer ${PATREON_ACCESS_TOKEN}`,
  },
});

export const getPatrons = async () => {
  const url = patreonLib.generateFetchPatreonApiUrl({
    campaignId: PATREON_CAMPAIGN_ID,
    count: 20,
    include: {
      member: [
        'last_charge_date',
        'last_charge_status',
        'lifetime_support_cents',
        'currently_entitled_amount_cents',
        'patron_status',
        'pledge_relationship_start',
        'next_charge_date',
        'email',
      ],
      user: ['social_connections'],
    },
  });

  try {
    const response = await patreonAxiosClient.get(url);
    console.log(JSON.stringify(response.data, null, 2));
    return toPatrons(response.data as IFetchPatreonCampaignMembersResponse);
  } catch (e: any) {
    logger({
      logLevel: 'error',
      message: e,
      variant: 'PATREON_SERVICE',
    });
    return null;
  }
};

const getCampaignInfo = async () => {
  const url = patreonLib.generateFetchCampaignUrl({
    include: {
      tiers: ['amount_cents', 'patron_count', 'discord_role_ids', 'title'],
      campaign: [
        'patron_count',
        'is_monthly',
        'is_charged_immediately',
        'discord_server_id',
        'creation_name',
      ],
    },
  });
  try {
    const response = await patreonAxiosClient.get(url);
    return toCampaignInfo(response.data as IFetchPatreonCampaignResponse);
  } catch (e: any) {
    logger({
      logLevel: 'error',
      message: e,
      variant: 'PATREON_SERVICE',
    });
    return null;
  }
};

const patreonService = {
  getPatrons,
  getCampaignInfo,
};

export default patreonService;

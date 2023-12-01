import type {Embed} from 'discord.js';
import {RPG_ARTIFACTS_TYPE} from '@epic-helper/constants';

const hasOwned = (rows: string[], type: string) => {
  const row = rows.find(row => row.includes(type));
  return !!row?.includes('✅');
};

const _artifactsReader = (embed: Embed) => {
  const rows = embed.fields.flatMap(field => field.value.split('\n'));

  const topHat = hasOwned(rows, RPG_ARTIFACTS_TYPE.topHat);
  const coinRing = hasOwned(rows, RPG_ARTIFACTS_TYPE.coinRing);
  const goldenPan = hasOwned(rows, RPG_ARTIFACTS_TYPE.goldenPan);
  const masterKey = hasOwned(rows, RPG_ARTIFACTS_TYPE.masterKey);
  const pocketWatch = hasOwned(rows, RPG_ARTIFACTS_TYPE.pocketWatch);
  const vampireTeeth = hasOwned(rows, RPG_ARTIFACTS_TYPE.vampireTeeth);
  const clausBelt = hasOwned(rows, RPG_ARTIFACTS_TYPE.clausBelt);

  const pocketWatchDescIndex = rows.findIndex(row => row.includes(RPG_ARTIFACTS_TYPE.pocketWatch));
  const pocketWatchPercent = rows[pocketWatchDescIndex + 1].match(/([\d.]+)%/)?.[1] ?? '0';

  return {
    topHat,
    coinRing,
    goldenPan,
    masterKey,
    pocketWatch,
    vampireTeeth,
    clausBelt,
    pocketWatchPercent: Number(pocketWatchPercent),
  };
};

export default _artifactsReader;

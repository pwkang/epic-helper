import {Embed} from 'discord.js';

interface IProfileReader {
  embed: Embed;
}

const profileReader = ({embed}: IProfileReader) => {
  const level = embed.fields[0].value.split('\n')[0].match(/\*\*Level\*\*: (\d+)/)?.[1] ?? 0;
  const currentArea = embed.fields[0].value.split('\n')[2].match(/\*\*Area\*\*: (\d+)/)?.[1] ?? 0;
  const maxArea = embed.fields[0].value.split('\n')[2].match(/\(Max: (\d+)\)/)?.[1] ?? 0;
  const timeTravels =
    embed.fields[0].value.split('\n')[3].match(/\*\*Time travels\*\*: (\d+)/)?.[1] ?? 0;
  const atk = embed.fields[1].value.match(/AT\*\*: (\d+)/)?.[1] ?? 0;
  const dek = embed.fields[1].value.match(/DEF\*\*: (\d+)/)?.[1] ?? 0;
  const life = embed.fields[1].value.match(/LIFE\*\*: (\d+)/)?.[1] ?? 0;
  const maxLife = embed.fields[1].value.match(/LIFE\*\*: \d+\/(\d+)/)?.[1] ?? 0;
  const horseTier = embed.fields[2].value.match(/tier(\d+)mount/)?.[1] ?? 0;
  const bank = embed.fields[3].value.match(/Bank\*\*: ([\d,]+)/)?.[1] ?? '0';
  const coins = embed.fields[3].value.match(/Coins\*\*: ([\d,]+)/)?.[1] ?? '0';
  const epicCoins = embed.fields[3].value.match(/EPIC coins\*\*: ([\d,]+)/)?.[1] ?? '0';
  const partnerName = embed.footer?.text?.match(/Married to (.+)/)?.[1] ?? '';
  const rank = embed.footer?.text?.match(/RANK: (\d+)/)?.[1] ?? 0;

  return {
    level: Number(level),
    currentArea: Number(currentArea),
    maxArea: Number(maxArea),
    timeTravels: Number(timeTravels),
    atk: Number(atk),
    dek: Number(dek),
    life: Number(life),
    maxLife: Number(maxLife),
    horseTier: Number(horseTier),
    bank: Number(bank.replaceAll(',', '')),
    coin: Number(coins.replaceAll(',', '')),
    epicCoin: Number(epicCoins.replaceAll(',', '')),
    partnerName,
    rank: Number(rank),
  };
};

export default profileReader;

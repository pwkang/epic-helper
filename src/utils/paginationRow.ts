import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

interface IGenerateNavigationRow {
  page: number;
  total: number;
  itemPerPage: number;
  all?: boolean;
}

export const generateNavigationRow = ({page, total, itemPerPage, all}: IGenerateNavigationRow) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('first')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⏪')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('prev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('next')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(page === Math.floor(total / itemPerPage))
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('last')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⏩')
      .setDisabled(page === Math.floor(total / itemPerPage))
  );
  if (all)
    row.addComponents(
      new ButtonBuilder().setCustomId('all').setStyle(ButtonStyle.Primary).setLabel('All')
    );
  return row;
};

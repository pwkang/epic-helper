import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

interface IGenerateNavigationRow {
  page: number;
  total: number;
  itemsPerPage: number;
  all?: boolean;
}

export const generateNavigationRow = ({page, total, itemsPerPage, all}: IGenerateNavigationRow) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  if (total > 2)
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
      .setDisabled(page === Math.floor(total / itemsPerPage))
  );
  if (total > 2)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('last')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏩')
        .setDisabled(page === Math.floor(total / itemsPerPage))
    );
  if (all)
    row.addComponents(
      new ButtonBuilder().setCustomId('all').setStyle(ButtonStyle.Primary).setLabel('All')
    );
  return row;
};

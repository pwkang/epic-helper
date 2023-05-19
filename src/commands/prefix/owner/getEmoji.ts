import {COMMAND_TYPE} from '../../../constants/bot';

interface Type {
  [key: string]: string;
}

export default <PrefixCommand>{
  name: 'listEmoji',
  commands: ['list emoji', 'le'],
  type: COMMAND_TYPE.dev,
  execute: (client, message) => {
    const emojis = message.guild && [...message.guild?.emojis.cache.values()];
    const emojiList =
      emojis?.map((emoji) => ({
        name: emoji.name,
        emoji: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
      })) ?? [];

    const emojiMap: Type = {};

    for (const emoji of emojiList) {
      if (!emoji.name) continue;
      emojiMap[emoji.name] = emoji.emoji;
    }
    console.log(emojiMap);
  },
};

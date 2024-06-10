import type {IHelpCommand, IHelpCommandsGroup} from '@epic-helper/types';

export const HELP_COMMANDS: IHelpCommand[] = [
  {
    name: 'Group Cooldowns',
    prefixCommands: [
      'group cd',
      'gcd',
    ],
    description: 'Link up to 5 players, and view cooldowns of all players in 1 command',
    usage: '`gcd` - View group cooldowns\n`gcd set @player1 @player2 hunt duel ...` - update users and commands type\n`gcd remove @player1 @player2` - remove users\n`gcd reset` - Reset and clear all group cooldowns',
    type: 'command',
  },
  {
    name: 'Custom reminder channel',
    prefixCommands: [
      '/account reminder-channel',
    ],
    description: 'Able to setup different channels to send the reminders for different commands',
    usage: '`/account reminder-channel` \n- Set selected commands to current channel\n- Remove settings of selected command',
    type: 'command',
  },
  {
    name: 'Duel',
    prefixCommands: [
      '/duel',
    ],
    description: 'Report duel record to guild\n\n**Notes**\n- Reporting with same message link will update previous record, instead of create new one\n- Bot will auto read the duel report in any server the bot has joined\n- You can undo your records multiple times\n',
    usage: '`/duel add` -> Manual report a result\n`/duel list` -> List duel records of a guild\n`/duel modify` -> Modify records of any member\n`/duel reset` -> reset all duel records\n`/duel undo` -> Undo a record',
    type: 'command',
  },
  {
    name: 'Stats',
    prefixCommands: [
      'stats',
      'stat',
      'st',
    ],
    description: 'View total commands you have done \n\n```\n| Stats of  | Non-Donor | Donor |\n| Today     |    ✗      |   ✓   |\n| Yesterday |    ✓      |   ✓   |\n| This Week |    ✗      |   ✓   |\n| Last Week |    ✓      |   ✓   |\n| Best      |    ✓      |   ✓   |\n```',
    usage: '`st`',
    type: 'command',
  },
  {
    name: 'Cooldowns',
    prefixCommands: [
      'cooldowns',
      'cooldown',
      'cd',
    ],
    description: 'View all the registered reminder',
    usage: '`cd`',
    type: 'command',
  },
  {
    name: 'Pet fusion',
    prefixCommands: [
      'petfusion',
      'petfuse',
      'pf',
    ],
    description: 'Given list of pets ID, and check whether its safe to fuse while keeping all the skills',
    usage: '`pf [ID] ...`\n\ne.g.\n`pf a b c d lmao aa`',
    type: 'command',
  },
  {
    name: 'Pet cd',
    prefixCommands: [
      'petcd',
    ],
    description: 'View all your pets that are currently adventuring',
    usage: '`petcd`',
  },
  {
    name: 'Custom Message',
    prefixCommands: [
      'custommessage',
      'cm',
    ],
    description: 'You can customize your reminder message with any messages when your command is ready\n\n** You need to be donor to customize the reminder message',
    usage: '`cm` - view settings\n`cm set [type] [messages]` - Update reminder message of a command\n`cm reset` - Reset every settings you have set',
    type: 'command',
  },
  {
    name: 'Guild Reminder',
    description: 'Server admin can setup multiple guilds in a server. Each guild can setup a reminder in a channel when guild upgrade/raid is ready.',
    usage: '1. Use `/guild setup` - Setup a new guild\n2. Use `/guild remidner` - Setup guild reminder\n3. Assign role to all guild members\n4. Do `rpg guild list` to register all members\n5. Type `rpg guild` to register reminder',
    type: 'feature',
  },
  {
    name: 'TT Verification',
    description: 'Server admin can setup the bot to auto assign roles based on player\'s time traveller amount\n\ne.g.\ntt0 - tt1 -> `@tt0`\ntt2 - tt19 -> `@tt2`\n\nRequired EPIC Token: 12',
    usage: '`/server tt-verification set-rule` -> Add a new rule\n`/server tt-verification remove-rule` -> Remove a rule\n`/server tt-verification set-channel` -> Set tt verification channel',
    type: 'feature',
  },
  {
    name: 'Donate',
    prefixCommands: [
      'donate',
      'patreon',
      'donor',
    ],
    description: 'Get Patreon link to support the bot',
    usage: '`donate`',
    type: 'command',
  },
  {
    name: 'Vote',
    prefixCommands: [
      'vote',
    ],
    description: 'Get the link to vote the bot',
    usage: '`vote`',
    type: 'command',
  },
  {
    name: 'EPIC Token',
    description: 'By donating to EPIC Helper, you will get EPIC Tokens, different tier gives different amount of tokens. \n\nEPIC Tokens can be only used on a server and unlocks certain perks\n- 5 tokens ➜ unlimited enchant channels\n- 12 tokens ➜ TT verification\n\nServer with EPIC Tokens also able to give donor perks for server members. \nFor every 100 members in the server, 1 EPIC Token is needed\n\ne.g.\n1 Token, 100 members ➜ all the members can enjoy donor perks.\n1 Token, 101 members ➜ donor perks are disabled\n2 Token, 101 members -> All members can enjoy perks',
    usage: '`/epic-token use` - use EPIC Tokens to boost a server\n`/epic-token remove` - remove all EPIC Tokens from a server',
    type: 'feature',
  },
  {
    name: 'View token status and boosters list',
    prefixCommands: [
      'server token boost',
      'stb',
    ],
    description: 'View EPIC Token boosted on server, list of boosters\n\nType `help epic token` for more information',
    usage: '`servertokenboost`',
    type: 'command',
  },
  {
    name: 'Server settings',
    prefixCommands: [
      'server settings',
      'ss',
    ],
    description: 'View server settings',
    usage: '`serversettings`',
  },
  {
    name: 'View links',
    prefixCommands: [
      'invite',
      'inv',
    ],
    description: 'View the links to invite the bot and link to join support server',
    usage: '`invite`',
    type: 'command',
  },
  {
    name: 'Statistic',
    prefixCommands: [
      'stats',
      'stat',
      'st',
    ],
    description: 'View the total amount of commands you have done in a day, week',
    usage: '`stats`',
    type: 'command',
  },
  {
    name: 'Materials / STT Score Calculator',
    prefixCommands: [
      'calc',
      'c',
    ],
    description: '**Material Calculator:**\n- Calculate total amount of your materials you will have in different area if you follow the trade rate\n\n**STT Score Calculator:**\n- Based on your current materials, calculate estimated STT score in area 15',
    usage: '`calc [current area]` - Material calculator\n`rpg i [current area]`\n\n`calc [current area] [level]` - STT Calculator\n`rpg i [current area] [level]`',
    type: 'command',
  },
  {
    name: 'Calculate fusion score of selected pets',
    prefixCommands: [
      'petfuse',
      'petfusion',
      'pf',
    ],
    description: 'Select list of pets and calculate the score of each skills',
    usage: '`pf a b g h lmao zz`',
  },
  {
    name: 'View pet adventure list',
    prefixCommands: [
      'petcd',
    ],
    description: 'View list of pets in adventure',
    usage: '`petcd`',
    type: 'command',
  },
  {
    name: 'Custom Messages',
    prefixCommands: [
      'custommessage',
      'cm',
    ],
    description: 'Customize reminder messages',
    usage: '`cm` - view custom message settings\n`cm set [type] [message]` - Set messages for selected type\n`cm reset [type]` - Reset message of selected type to default settings\n\n**Available Types**\n`daily`, `weekly`, `lootbox`, `vote`, `hunt`, `adventure`, `training`, `duel`, `quest`, `working`, `farm`, `horse`, `arena`, `dungeon`, `epicitem`, `pet`',
    type: 'command',
  },
  {
    name: 'Toggle',
    prefixCommands: [
      'toggle',
      't',
    ],
    description: 'Enable/Disable features without turning off your account',
    usage: '`toggle` - view toggle settings\n`toggle on [ID] [ID] ...` - Enable feature\n`toggle off [ID] [ID] ...` - Disable feature\n`toggle reset` - Reset everything to default settings',
    type: 'command',
  },
  {
    name: 'Register',
    prefixCommands: [
      'register',
    ],
    description: 'Register an account',
    usage: '`register`',
    type: 'command',
  },
  {
    name: 'Turn on account',
    prefixCommands: [
      'on',
    ],
    description: 'Turn on the bot for your account\nIf you want to disable any features, you can use `toggle` to disable/enable certain features',
    usage: '`on`',
    type: 'command',
  },
  {
    name: 'Info',
    prefixCommands: [
      'info',
    ],
    description: 'Show bot basic info',
    usage: '`info`',
    type: 'command',
  },
  {
    name: 'Turn off account',
    prefixCommands: [
      'off',
    ],
    description: 'Turn off the bot for your account. Bot will not track your message except commands start with bot prefix or mentions',
    usage: '`off`',
    type: 'command',
  },
  {
    name: 'Delete account',
    prefixCommands: [
      'delete',
    ],
    description: 'Delete your account',
    usage: '`delete`',
    type: 'command',
  },
  {
    name: 'Set RPG Donor',
    prefixCommands: [
      'donor',
    ],
    description: 'Set your EPIC RPG donor tier to update reminder cooldown',
    usage: '`donor`',
    type: 'command',
  },
  {
    name: 'Set EPIC RPG partner donor tier',
    prefixCommands: [
      'donorp',
    ],
    description: 'This is required only if you wish to hunt with your partner cooldown',
    usage: '`donorp`',
    type: 'command',
  },
  {
    name: 'Set enchant tier',
    prefixCommands: [
      'setenchant',
      'set enchant',
      'se',
    ],
    description: 'Set your desired enchant tier\nYou will be muted when you got target enchant tier or higher\nEnchant mute only works in channel set by server admin',
    usage: '`setenchant`',
    type: 'command',
  },
  {
    name: 'Show account settings',
    prefixCommands: [
      'settings',
      's',
    ],
    description: 'Show your personal account settings',
    usage: '`settings`',
    type: 'command',
  },
  {
    name: 'Help',
    prefixCommands: [
      'help',
      'h',
    ],
    description: 'Show all available commands and features',
    usage: '`help [command/feature]`',
    type: 'command',
  },
  {
    name: 'Enchant Mute Helper',
    description: 'Bot will mute you when you enchant and get target tier or higher',
    type: 'feature',
  },
];

export const HELP_COMMANDS_GROUPS: IHelpCommandsGroup[] = [{
  type: 'commands',
  commands: [{
    name: 'Register',
    prefixCommands: ['register'],
    description: 'Register an account',
    usage: '`register`',
    type: 'command',
  }, {
    name: 'Show account settings',
    prefixCommands: ['settings', 's'],
    description: 'Show your personal account settings',
    usage: '`settings`',
    type: 'command',
  }, {
    name: 'Turn on account',
    prefixCommands: ['on'],
    description: 'Turn on the bot for your account\nIf you want to disable any features, you can use `toggle` to disable/enable certain features',
    usage: '`on`',
    type: 'command',
  }, {
    name: 'Turn off account',
    prefixCommands: ['off'],
    description: 'Turn off the bot for your account. Bot will not track your message except commands start with bot prefix or mentions',
    usage: '`off`',
    type: 'command',
  }, {
    name: 'Set enchant tier',
    prefixCommands: ['setenchant', 'set enchant', 'se'],
    description: 'Set your desired enchant tier\nYou will be muted when you got target enchant tier or higher\nEnchant mute only works in channel set by server admin',
    usage: '`setenchant`',
    type: 'command',
  }, {
    name: 'Set RPG Donor',
    prefixCommands: ['donor'],
    description: 'Set your EPIC RPG donor tier to update reminder cooldown',
    usage: '`donor`',
    type: 'command',
  }, {
    name: 'Set EPIC RPG partner donor tier',
    prefixCommands: ['donorp'],
    description: 'This is required only if you wish to hunt with your partner cooldown',
    usage: '`donorp`',
    type: 'command',
  }, {
    name: 'Toggle',
    prefixCommands: ['toggle', 't'],
    description: 'Enable/Disable features without turning off your account',
    usage: '`toggle` - view toggle settings\n`toggle on [ID] [ID] ...` - Enable feature\n`toggle off [ID] [ID] ...` - Disable feature\n`toggle reset` - Reset everything to default settings',
    type: 'command',
  }, {
    name: 'Delete account',
    prefixCommands: ['delete'],
    description: 'Delete your account',
    usage: '`delete`',
    type: 'command',
  }],
  order: 1,
  name: 'Account',
  fieldLabel: '👤 Account commands👤',
}, {
  type: 'commands',
  commands: [{
    name: 'Server settings',
    prefixCommands: ['server settings', 'ss'],
    description: 'View server settings',
    usage: '`serversettings`',
  }, {
    name: 'View token status and boosters list',
    prefixCommands: ['server token boost', 'stb'],
    description: 'View EPIC Token boosted on server, list of boosters\n\nType `help epic token` for more information',
    usage: '`servertokenboost`',
    type: 'command',
  }],
  order: 2,
  name: 'Server',
  fieldLabel: '🏛️ Server commands 🏛️',
}, {
  type: 'commands',
  commands: [{
    name: 'Info',
    prefixCommands: ['info'],
    description: 'Show bot basic info',
    usage: '`info`',
    type: 'command',
  }, {
    name: 'Help',
    prefixCommands: ['help', 'h'],
    description: 'Show all available commands and features',
    usage: '`help [command/feature]`',
    type: 'command',
  }, {
    name: 'View links',
    prefixCommands: ['invite', 'inv'],
    description: 'View the links to invite the bot and link to join support server',
    usage: '`invite`',
    type: 'command',
  }, {
    name: 'Vote',
    prefixCommands: ['vote'],
    description: 'Get the link to vote the bot',
    usage: '`vote`',
    type: 'command',
  }, {
    name: 'Donate',
    prefixCommands: ['donate', 'patreon', 'donor'],
    description: 'Get Patreon link to support the bot',
    usage: '`donate`',
    type: 'command',
  }],
  order: 3,
  name: 'Information',
  fieldLabel: '🧾 Information commands🧾',
}, {
  type: 'commands',
  commands: [{
    name: 'Pet cd',
    prefixCommands: ['petcd'],
    description: 'View all your pets that are currently adventuring',
    usage: '`petcd`',
  }, {
    name: 'Materials / STT Score Calculator',
    prefixCommands: ['calc', 'c'],
    description: '**Material Calculator:**\n- Calculate total amount of your materials you will have in different area if you follow the trade rate\n\n**STT Score Calculator:**\n- Based on your current materials, calculate estimated STT score in area 15',
    usage: '`calc [current area]` - Material calculator\n`rpg i [current area]`\n\n`calc [current area] [level]` - STT Calculator\n`rpg i [current area] [level]`',
    type: 'command',
  }, {
    name: 'Cooldowns',
    prefixCommands: ['cooldowns', 'cooldown', 'cd'],
    description: 'View all the registered reminder',
    usage: '`cd`',
    type: 'command',
  }, {
    name: 'Stats',
    prefixCommands: ['stats', 'stat', 'st'],
    description: 'View total commands you have done \n\n```\n| Stats of  | Non-Donor | Donor |\n| Today     |    ✗      |   ✓   |\n| Yesterday |    ✓      |   ✓   |\n| This Week |    ✗      |   ✓   |\n| Last Week |    ✓      |   ✓   |\n| Best      |    ✓      |   ✓   |\n```',
    usage: '`st`',
    type: 'command',
  }, {
    name: 'Duel',
    prefixCommands: ['/duel'],
    description: 'Report duel record to guild\n\n**Notes**\n- Reporting with same message link will update previous record, instead of create new one\n- Bot will auto read the duel report in any server the bot has joined\n- You can undo your records multiple times\n',
    usage: '`/duel add` -> Manual report a result\n`/duel list` -> List duel records of a guild\n`/duel modify` -> Modify records of any member\n`/duel reset` -> reset all duel records\n`/duel undo` -> Undo a record',
    type: 'command',
  }],
  order: 4,
  name: 'Utilities',
  fieldLabel: '⚙️ Utilities commands⚙️',
}, {
  type: 'commands',
  commands: [{
    name: 'Custom Message',
    prefixCommands: ['custommessage', 'cm'],
    description: 'You can customize your reminder message with any messages when your command is ready\n\n** You need to be donor to customize the reminder message',
    usage: '`cm` - view settings\n`cm set [type] [messages]` - Update reminder message of a command\n`cm reset` - Reset every settings you have set',
    type: 'command',
  }, {
    name: 'Pet fusion',
    prefixCommands: ['petfusion', 'petfuse', 'pf'],
    description: 'Given list of pets ID, and check whether its safe to fuse while keeping all the skills',
    usage: '`pf [ID] ...`\n\ne.g.\n`pf a b c d lmao aa`',
    type: 'command',
  }, {
    name: 'Custom reminder channel',
    prefixCommands: ['/account reminder-channel'],
    description: 'Able to setup different channels to send the reminders for different commands',
    usage: '`/account reminder-channel` \n- Set selected commands to current channel\n- Remove settings of selected command',
    type: 'command',
  }, {
    name: 'Group Cooldowns',
    prefixCommands: ['group cd', 'gcd'],
    description: 'Link up to 5 players, and view cooldowns of all players in 1 command',
    usage: '`gcd` - View group cooldowns\n`gcd set @player1 @player2 hunt duel ...` - update users and commands type\n`gcd remove @player1 @player2` - remove users\n`gcd reset` - Reset and clear all group cooldowns',
    type: 'command',
  }],
  order: 5,
  name: 'Donor',
  fieldLabel: '⭐ Donor commands ⭐',
}, {
  type: 'features',
  commands: [{
    name: 'Enchant Mute Helper',
    description: 'Bot will mute you when you enchant and get target tier or higher',
    type: 'feature',
  }, {
    name: 'TT Verification',
    description: 'Server admin can setup the bot to auto assign roles based on player\'s time traveller amount\n\ne.g.\ntt0 - tt1 -> `@tt0`\ntt2 - tt19 -> `@tt2`\n\nRequired EPIC Token: 12',
    usage: '`/server tt-verification set-rule` -> Add a new rule\n`/server tt-verification remove-rule` -> Remove a rule\n`/server tt-verification set-channel` -> Set tt verification channel',
    type: 'feature',
  }, {
    name: 'EPIC Token',
    description: 'By donating to EPIC Helper, you will get EPIC Tokens, different tier gives different amount of tokens. \n\nEPIC Tokens can be only used on a server and unlocks certain perks\n- 5 tokens ➜ unlimited enchant channels\n- 12 tokens ➜ TT verification\n\nServer with EPIC Tokens also able to give donor perks for server members. \nFor every 100 members in the server, 1 EPIC Token is needed\n\ne.g.\n1 Token, 100 members ➜ all the members can enjoy donor perks.\n1 Token, 101 members ➜ donor perks are disabled\n2 Token, 101 members -> All members can enjoy perks',
    usage: '`/epic-token use` - use EPIC Tokens to boost a server\n`/epic-token remove` - remove all EPIC Tokens from a server',
    type: 'feature',
  }, {
    name: 'Guild Reminder',
    description: 'Server admin can setup multiple guilds in a server. Each guild can setup a reminder in a channel when guild upgrade/raid is ready.',
    usage: '1. Use `/guild setup` - Setup a new guild\n2. Use `/guild remidner` - Setup guild reminder\n3. Assign role to all guild members\n4. Do `rpg guild list` to register all members\n5. Type `rpg guild` to register reminder',
    type: 'feature',
  }],
  order: 5,
  name: 'Features',
  fieldLabel: '🎲 Features List 🎲',
}];

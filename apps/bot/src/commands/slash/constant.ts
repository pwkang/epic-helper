export const SLASH_COMMAND = {
  account: {
    name: 'account',
    description: 'Account related commands',
    delete: {
      name: 'delete',
      description: 'Delete your account',
    },
    customMessage: {
      name: 'custom-message',
      description: 'Customize the reminder messages for different reminders',
    },
    donor: {
      name: 'donor',
      description: 'Set EPIC RPG donor tier',
    },
    donorPartner: {
      name: 'donor-partner',
      description: 'Set EPIC RPG partner donor tier',
    },
    enchantTier: {
      name: 'enchant-tier',
      description: 'Set the enchant tier for enchant mute helper',
    },
    healReminder: {
      name: 'heal-reminder',
      description: 'Set the heal reminder HP target',
    },
    off: {
      name: 'off',
      description: 'Turn off your account',
    },
    on: {
      name: 'on',
      description: 'Turn on your account',
    },
    register: {
      name: 'register',
      description: 'Register your account',
    },
    reminderChannel: {
      name: 'reminder-channel',
      description: 'Set the reminder channel',
    },
    settings: {
      name: 'settings',
      description: 'View your account settings',
    },
  },
  epicToken: {
    name: 'epic-token',
    description: 'EPIC RPG token related commands',
    use: {
      name: 'use',
      description: 'Use your epic token on this server',
    },
    remove: {
      name: 'remove',
      description: 'Remove all your epic token from a server',
    },
  },
  guild: {
    name: 'guild',
    description: 'Guild settings',
    setup: {
      name: 'setup',
      description: 'Setup a new the guild',
    },
    settings: {
      name: 'settings',
      description: 'Show guild settings',
    },
    reminder: {
      name: 'reminder',
      description: 'Update reminder settings',
    },
    duel: {
      name: 'duel',
      description: 'Update Duel Log settings',
    },
    leader: {
      name: 'leader',
      description: 'Leader of the guild, can modify guild settings without admin permission',
    },
    delete: {
      name: 'delete',
      description: 'Delete the guild',
    },
    toggle: {
      name: 'toggle',
      description: 'Toggle guild settings',
      set: {
        name: 'set',
        description: 'Update guild toggle',
      },
      show: {
        name: 'show',
        description: 'Show guild toggle',
      },
      reset: {
        name: 'reset',
        description: 'Reset guild toggle',
      },
    },
  },
  pet: {
    name: 'pet',
    description: 'Pet commands',
    calcFusionScore: {
      name: 'calc-fusion-score',
      description: 'Calculate fusion score',
    },
    list: {
      name: 'list',
      description: 'List your pets',
    },
    cd: {
      name: 'cd',
      description: 'List of pets on adventure',
    },
  },
  server: {
    name: 'server',
    description: 'Server configuration',
    settings: {
      name: 'settings',
      description: 'View the server settings',
    },
    randomEvents: {
      name: 'random-events',
      description: 'set message to send when random events occur (type "clear" to remove)',
    },
    ttVerification: {
      name: 'tt-verification',
      description: 'Set the TT verification',
      setRule: {
        name: 'set-rule',
        description: 'Add a new assign rule for TT Verification',
      },
      setChannel: {
        name: 'set-channel',
        description: 'Set the TT verification channel',
      },
      removeRule: {
        name: 'remove-rule',
        description: 'Remove an existing rule',
      },
    },
    enchantMute: {
      name: 'enchant-mute',
      description: 'Enchant Mute',
      channels: {
        name: 'channels',
        description: 'Set the enchant mute channels',
      },
      duration: {
        name: 'duration',
        description: 'Set the enchant mute duration',
      },
    },
    admins: {
      name: 'admin',
      description: 'Server admins',
      add: {
        name: 'add',
        description: 'Add Admin',
      },
      clear: {
        name: 'clear',
        description: 'Clear Admin List',
      },
      list: {
        name: 'list',
        description: 'View Admin List',
      },
      remove: {
        name: 'remove',
        description: 'Remove Admin',
      },
    },
    adminRoles: {
      name: 'admin-role',
      description: 'Server admin roles',
      add: {
        name: 'add',
        description: 'Add Admin Role',
      },
      clear: {
        name: 'clear',
        description: 'Clear Admin Roles',
      },
      list: {
        name: 'list',
        description: 'View Admin Roles',
      },
      remove: {
        name: 'remove',
        description: 'Remove Admin Role',
      },
    },
    toggle: {
      name: 'toggle',
      description: 'Toggle server settings',
      set: {
        name: 'set',
        description: 'Update server toggle',
      },
      show: {
        name: 'show',
        description: 'Show server toggle',
      },
      reset: {
        name: 'reset',
        description: 'Reset server toggle',
      },
    },
  },
  toggle: {
    name: 'toggle',
    description: 'Toggle commands',
    set: {
      name: 'set',
      description: 'Update personal toggle settings',
    },
    show: {
      name: 'show',
      description: 'Show personal toggle settings',
    },
    reset: {
      name: 'reset',
      description: 'Reset personal toggle settings',
    },
  },
  duel: {
    name: 'rrduel',
    description: 'Duel reports commands',
    add: {
      name: 'add',
      description: 'Submit a new duel report to your guild',
    },
    list: {
      name: 'list',
      description: 'List all duel reports of your guild',
    },
    undo: {
      name: 'undo',
      description: 'Undo your last duel report',
    },
    modify: {
      name: 'modify',
      description: 'Modify the duel record of a user',
    },
    reset: {
      name: 'reset',
      description: 'Reset the duel reports of a guild',
    },
  },
  stats: {
    name: 'stats',
    description: 'Command counter',
  },
  invite: {
    name: 'invite',
    description: 'Invite EPIC Helper to another server or join the official server',
  },
  info: {
    name: 'info',
    description: 'General information about the bot',
  },
  help: {
    name: 'help',
    description: 'Show all commands or information of EPIC Helper',
  },
} as const;

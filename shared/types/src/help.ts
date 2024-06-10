
export interface IHelpCommandsGroup {
  name?: string;
  fieldLabel?: string;
  commands?: IHelpCommand[];
  order?: number;
  type?: 'commands' | 'features';
}

export interface IHelpCommand {
  name?: string;
  prefixCommands?: string[];
  description?: string;
  usage?: string;
  type?: 'feature' | 'command';
}

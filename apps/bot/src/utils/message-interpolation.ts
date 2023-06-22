interface IInterpolateMessage {
  message: string;
  variables: Record<string, string>;
}

export const interpolateMessage = ({message, variables}: IInterpolateMessage) => {
  const regex = /{([^}]+)}/g;
  return message.replace(regex, (_, match) => {
    return variables[match] || '';
  });
};

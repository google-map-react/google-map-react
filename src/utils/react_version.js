
export function isReact14(React) {
  const { version } = React;
  if (typeof version !== 'string') {
    return false;
  }

  const sections = version.split('.');
  const major = parseInt(sections[0], 10);
  const minor = parseInt(sections[1], 10);

  return major === 0 && minor > 13;
}

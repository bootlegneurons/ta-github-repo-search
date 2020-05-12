export default (name: string): string => {
  const envName = `REACT_APP_${name}`;
  return (typeof process.env[envName] !== undefined ? process.env[envName] : '') as string;
};

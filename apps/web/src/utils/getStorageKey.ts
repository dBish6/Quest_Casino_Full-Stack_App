export default function getStorageKey (memberId: string, identifier: string) {
  return `qc:user:${memberId}:${identifier}`;
};

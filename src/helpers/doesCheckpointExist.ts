import { getCurrentCheckpoints } from './getCurrentCheckpoints';

export function doesCheckpointExist(requestedModelName: string): boolean {
  const currentCheckpoints = getCurrentCheckpoints();
  const checkpointExists = currentCheckpoints.some((model) => model.name === requestedModelName);

  return checkpointExists;
}

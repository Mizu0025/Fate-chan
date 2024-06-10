import { doesCheckpointExist } from '../helpers/doesCheckpointExist';
import { getCurrentCheckpoints } from '../helpers/getCurrentCheckpoints';

jest.mock('../helpers/getCurrentCheckpoints', () => ({
  getCurrentCheckpoints: jest.fn(),
}));

const mockExistingArray = [{ name: 'modelA' }, { name: 'modelB' }];

describe('doesCheckpointExist', () => {
  it('should return true when the checkpoint exists', () => {
    // Arrange
    const mockCheckpoint = 'modelA';

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockExistingArray);
    const result = doesCheckpointExist(mockCheckpoint);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when the checkpoint does not exist', () => {
    // Arrange
    const mockCheckpoint = 'modelC';

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockExistingArray);
    const result = doesCheckpointExist(mockCheckpoint);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false when there are no checkpoints', () => {
    // Arrange
    const mockCheckpoint = 'modelA';

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue([]);
    const result = doesCheckpointExist(mockCheckpoint);

    // Assert
    expect(result).toBe(false);
  });
});

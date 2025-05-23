
import { getAllSetupData } from '../../utils/indexeddb';
import authService from '../../data/auth-service';

const ProfileModel = {
  async getUserProfile() {
    const setupData = await getAllSetupData();
    const userData = authService.getUserData();

    return {
      avatar: null,
      fullName: setupData[0]?.name || '',
      username: userData?.username || '',
      experience: setupData[0]?.experience || '',
    };
  }
};

export default ProfileModel;


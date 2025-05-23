import ProfileModel from "./profile-model";

const ProfilePresenter = {
  async init(view) {
    const profile = await ProfileModel.getUserProfile();
    view.showProfile(profile);
  }
};

export default ProfilePresenter;

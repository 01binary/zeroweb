import React, { FC } from 'react';
import useProfile from '../../hooks/useProfile';
import {
  ImageLinkButton,
  InlineLinkButton,
  ProfileBlurb,
  ProfileBlurbsSection,
  ProfileField,
  ProfileInput,
  ProfileRow,
  StyledBlurbIcon,
  StyledLocationIcon,
} from './Profile.styles';
import SaveIcon from '../../images/accept.svg';
import CancelIcon from '../../images/cancel.svg';

const ProfileBlurbs: FC<{
  profile: ReturnType<typeof useProfile>['profile'];
  isForAnotherUser: boolean;
  isSaving: boolean;
  editBioRef: React.MutableRefObject<HTMLInputElement>;
  editingBio: boolean;
  bioText: string;
  setBioText: (text: string) => void;
  handleEditBio: ReturnType<typeof useProfile>['handleEditBio'];
  editLocationRef: React.MutableRefObject<HTMLInputElement>;
  editingLocation: boolean;
  locationText: string;
  setLocationText: (text: string) => void;
  handleEditLocation: ReturnType<typeof useProfile>['handleEditLocation'];
}> = ({
  profile,
  isForAnotherUser,
  isSaving,
  editBioRef,
  editingBio,
  bioText,
  setBioText,
  handleEditBio,
  editLocationRef,
  editingLocation,
  locationText,
  setLocationText,
  handleEditLocation,
}) => (
  <ProfileBlurbsSection isLoading={isSaving}>
    <ProfileRow>
      <StyledBlurbIcon />
      <ProfileField>
        {editingBio ? (
          <ProfileInput
            type="text"
            placeholder="bio"
            ref={editBioRef}
            value={bioText ?? ''}
            onChange={(e) => setBioText(e.target.value)}
          />
        ) : profile?.bio ? (
          <ProfileBlurb>{profile.bio}</ProfileBlurb>
        ) : (
          <ProfileBlurb secondary>no bio</ProfileBlurb>
        )}
      </ProfileField>

      {editingBio ? (
        <>
          <ImageLinkButton onClick={() => handleEditBio(false, true)}>
            <SaveIcon />
          </ImageLinkButton>
          <ImageLinkButton onClick={() => handleEditBio(false)}>
            <CancelIcon />
          </ImageLinkButton>
        </>
      ) : isForAnotherUser ? null : (
        <InlineLinkButton
          disabled={isSaving}
          onClick={() => handleEditBio(true)}
        >
          edit
        </InlineLinkButton>
      )}
    </ProfileRow>

    <ProfileRow>
      <StyledLocationIcon />
      <ProfileField>
        {editingLocation ? (
          <ProfileInput
            type="text"
            placeholder="location"
            ref={editLocationRef}
            value={locationText ?? ''}
            onChange={(e) => setLocationText(e.target.value)}
          />
        ) : profile?.locationName ? (
          <ProfileBlurb secondary>{profile.locationName}</ProfileBlurb>
        ) : (
          <ProfileBlurb secondary>no location</ProfileBlurb>
        )}
      </ProfileField>

      {editingLocation ? (
        <>
          <ImageLinkButton onClick={() => handleEditLocation(false, true)}>
            <SaveIcon />
          </ImageLinkButton>
          <ImageLinkButton onClick={() => handleEditLocation(false)}>
            <CancelIcon />
          </ImageLinkButton>
        </>
      ) : isForAnotherUser ? null : (
        <InlineLinkButton
          disabled={isSaving}
          onClick={() => handleEditLocation(true)}
        >
          edit
        </InlineLinkButton>
      )}
    </ProfileRow>
  </ProfileBlurbsSection>
);

export default ProfileBlurbs;

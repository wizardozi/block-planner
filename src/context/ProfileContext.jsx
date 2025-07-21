import { createContext, useContext, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'profiles';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setProfiles(JSON.parse(saved));
  }, []);

  const saveProfiles = (newProfiles) => {
    setProfiles(newProfiles);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfiles));
  };

  const addProfile = (profile) => {
    const newProfiles = [...profiles, profile];
    saveProfiles(newProfiles);
  };
  const deleteProfile = (profileToDelete) => {
    setProfiles((prev) =>
      prev.filter((profile) => profile.id !== profileToDelete.id)
    );
  };

  const updateProfile = (updatedProfile) => {
    const newProfiles = profiles.map((p) =>
      p.id === updatedProfile.id ? updatedProfile : p
    );
    saveProfiles(newProfiles);
  };

  const getProfileById = (id) => {
    return profiles.find((profile) => profile.id === id);
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        addProfile,
        deleteProfile,
        updateProfile,
        getProfileById,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileManager = () => useContext(ProfileContext);

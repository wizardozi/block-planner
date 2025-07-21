import { createContext, useContext, useEffect, useState } from 'react';

// Replace with localStorage or your own persistence logic later
const LOCAL_STORAGE_KEY = 'projects';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProjects));
  };

  const addProject = (project) => {
    const newProjects = [...projects, project];
    saveProjects(newProjects);
  };

  const deleteProject = (projectToDelete) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== projectToDelete.id)
    );
  };

  const updateProject = (updatedProject) => {
    const newProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    saveProjects(newProjects);
  };

  const getProjectById = (id) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        deleteProject,
        updateProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectManager = () => useContext(ProjectContext);

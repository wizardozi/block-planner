import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskManager } from '../context/TaskContext';
import { usePageManager } from '../context/PageContext';
import { useProjectManager } from '../context/ProjectContext';
import { useProfileManager } from '../context/ProfileContext';

export default function ContentHeader() {
  const { id, projectId, taskId, profileId, pageId } = useParams();
  const trueId = id || projectId || taskId || profileId || pageId;

  const { tasks, setTasks, updateTask, addTask, deleteTask, getTaskById } =
    useTaskManager();

  const { pages, getPageById } = usePageManager();

  const { projects, addProject, deleteProject, updateProject, getProjectById } =
    useProjectManager();

  const { profiles, addProfile, deleteProfile, updateProfile, getProfileById } =
    useProfileManager();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;

    let current;
    if (path.startsWith('/task/')) {
      current = getTaskById(trueId);
    } else if (path.startsWith('/page/')) {
      current = getPageById(trueId);
    } else if (path.startsWith('/project/')) {
      current = getProjectById(trueId);
    } else if (path.startsWith('/profile/')) {
      current = getProfileById(trueId);
    }

    if (!current) return;

    const trail = [];

    while (current) {
      trail.unshift({ name: current.name, id: current.id });
      if (!current.parentId) break;
      current =
        getTaskById(current.parentId) ||
        getProjectById(current.parentId) ||
        getProfileById(current.parentId);
    }

    setBreadcrumbs(trail);
  }, [id, tasks, projects, profiles]);

  return (
    <div className="pb-2 text-sm min-h-8">
      {breadcrumbs.length === 0 ? (
        <span>No breadcrumbs found</span>
      ) : (
        breadcrumbs.map((crumb, idx) => (
          <span key={crumb.id}>
            {idx > 0 && ' / '}
            {crumb.name}
          </span>
        ))
      )}
    </div>
  );
}

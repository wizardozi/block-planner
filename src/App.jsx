import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TaskView from './views/TaskView';
import ProjectView from './views/ProjectView';
import PageView from './views/PageView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="task/:taskId" element={<TaskView />} />
          <Route path="page/:pageId" element={<PageView />} />
          <Route path="project/:projectId" element={<ProjectView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

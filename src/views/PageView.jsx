import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageManager } from '../context/PageContext';
import PageBlock from '../components/PageBlock';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../components/ContentHeader';

const PageView = ({ pageId: propPageId, mode = 'page', onClose }) => {
  const navigate = useNavigate();

  const params = useParams();

  const [page, setPage] = useState(null);

  const [viewMode, setViewMode] = useState(mode);

  const pageId = propPageId || params.pageId;

  const { getPageById, updatePage } = usePageManager();

  useEffect(() => {
    const foundPage = getPageById(pageId);
    setPage(foundPage || null);
  }, [pageId, getPageById]);

  useEffect(() => {
    if (viewMode === 'page' && propPageId) {
      navigate(`/page/${propPageId}`);
    }
  }, [viewMode, propPageId, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Escape' &&
        (viewMode === 'modal' || viewMode === 'drawer')
      ) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, onClose]);

  if (!page) return <div className="p-4 text-gray-500">Page not found.</div>;

  const content = (
    <PageBlock
      key={page.id}
      pageData={page}
      onUpdate={(newData) => updatePage(page.id, newData)}
    />
  );

  // 🔄 Decide layout based on mode
  if (viewMode === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-sm max-w-2xl w-full shadow-md">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
          >
            ×
          </button>
          {content}
          <div className="absolute top-2 left-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border border-gray-200  px-2 py-1 text-sm   shadow-none"
            >
              <option value="modal">Modal</option>
              <option value="drawer">Drawer</option>
              <option value="page">Page</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'drawer') {
    return (
      <div className="fixed top-0 right-0 h-full w-[60%] bg-white dark:bg-neutral-800 z-50 shadow-md p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>
        {content}
        <div className="absolute top-2 left-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="modal">Modal</option>
            <option value="drawer">Drawer</option>
            <option value="page">Page</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      <ContentHeader />
      {content}
    </div>
  );
};

export default PageView;

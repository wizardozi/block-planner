import { createContext, useContext, useEffect, useState } from 'react';

// Replace with localStorage or your own persistence logic later
const LOCAL_STORAGE_KEY = 'pages';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setPages(JSON.parse(saved));
  }, []);

  const savePages = (newPages) => {
    setPages(newPages);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPages));
  };

  const addPage = (page) => {
    const newPages = [...pages, page];
    savePages(newPages);
  };

  const deletePage = (pageToDelete) => {
    setPages((prev) => prev.filter((page) => page.id !== pageToDelete.id));
  };

  const updatePage = (updatedPage) => {
    const newPages = pages.map((p) =>
      p.id === updatedPage.id ? updatedPage : p
    );
    savePages(newPages);
  };

  const getPageById = (id) => {
    return pages.find((page) => page.id === id);
  };

  return (
    <PageContext.Provider
      value={{
        pages,
        addPage,
        deletePage,
        updatePage,
        getPageById,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePageManager = () => useContext(PageContext);

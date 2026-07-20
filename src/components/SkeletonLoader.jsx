import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div className="w-full space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
          </div>
        );
      case 'chart':
        return (
          <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse flex items-end justify-between p-4 space-x-2">
            <div className="h-[20%] bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-[50%] bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-[80%] bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-[40%] bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-[90%] bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
          </div>
        );
      case 'card':
      default:
        return (
          <div className="glass-card rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4 animate-pulse">
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};
export default SkeletonLoader;

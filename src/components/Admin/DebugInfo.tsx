import { useData } from '../../contexts/DataContext';

const DebugInfo = () => {
  const { state } = useData();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div>Projects Count: {state.projects.length}</div>
      <div>Loading: {state.loading.projects ? 'Yes' : 'No'}</div>
      <div>Error: {state.errors.projects || 'None'}</div>
      <div>Last Updated: {state.lastUpdated.projects ? new Date(state.lastUpdated.projects).toLocaleTimeString() : 'Never'}</div>
      <div className="mt-2">
        <div className="font-semibold">First Project:</div>
        <div>Title: {state.projects[0]?.title || 'None'}</div>
        <div>Description: {state.projects[0]?.description?.substring(0, 50) || 'None'}...</div>
      </div>
    </div>
  );
};

export default DebugInfo;


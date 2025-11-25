import { useData } from '../../contexts/DataContext';

const StateDebugger = () => {
  const { state } = useData();
  
  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2 text-yellow-400">State Debugger</h3>
      <div className="space-y-1">
        <div><strong>Projects Count:</strong> {state.projects.length}</div>
        <div><strong>Loading:</strong> {state.loading.projects ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {state.errors.projects || 'None'}</div>
        <div><strong>Last Updated:</strong> {state.lastUpdated.projects ? new Date(state.lastUpdated.projects).toLocaleTimeString() : 'Never'}</div>
        
        <div className="mt-2">
          <div className="font-semibold text-green-400">Projects List:</div>
          {state.projects.map((project, index) => (
            <div key={project._id} className="ml-2 text-xs">
              {index + 1}. {project.title} (ID: {project._id.substring(0, 8)}...)
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <div className="font-semibold text-blue-400">Raw State:</div>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({
              projectsCount: state.projects.length,
              loading: state.loading.projects,
              error: state.errors.projects,
              lastUpdated: state.lastUpdated.projects
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StateDebugger;


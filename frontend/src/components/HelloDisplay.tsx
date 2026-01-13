import { HelloResponse } from '@shared/hello.types';

interface HelloDisplayProps {
  data: HelloResponse;
}

/**
 * Component to display hello message
 */
export function HelloDisplay({ data }: HelloDisplayProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {data.message}
        </h1>
        
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">
            <span className="font-semibold">ID:</span> {data.id}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Timestamp:</span>{' '}
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Connected to backend</span>
        </div>
      </div>
    </div>
  );
}

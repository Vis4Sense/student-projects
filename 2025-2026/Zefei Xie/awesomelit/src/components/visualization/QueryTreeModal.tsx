import React, { useState, useEffect } from 'react';
import { Tree, CustomNodeElementProps } from 'react-d3-tree';
import type { RawNodeDatum } from 'react-d3-tree';
import { PipelineState, QueryRecord } from '@/types/pipeline';

interface QueryTreeModalProps {
 visible: boolean;
 onClose: () => void;
 pipelineState: PipelineState | null;
}

interface TreeNodeData extends RawNodeDatum {
 name: string;
 queryRecord: QueryRecord;
 children?: TreeNodeData[];
 attributes: {
   status: 'pending' | 'completed' | 'unexplored';
 };
}

const QueryTreeModal: React.FC<QueryTreeModalProps> = ({
 visible,
 onClose,
 pipelineState,
}) => {
 const [selectedQuery, setSelectedQuery] = useState<QueryRecord | null>(null);
 const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
 const [loading, setLoading] = useState(false);

 // Build tree structure from query_history
 useEffect(() => {
   if (!pipelineState?.query_history || pipelineState.query_history.length === 0) {
     setTreeData(null);
     setSelectedQuery(null);
     return;
   }

   setLoading(true);
   try {
     const buildTree = (queries: QueryRecord[]): TreeNodeData | null => {
       const rootQuery = queries.find(q => !q.parent_query);
       if (!rootQuery) {
         console.warn('No root query found in query history');
         return null;
       }

       const createNode = (query: QueryRecord): TreeNodeData => {
         const children = queries
           .filter(q => q.parent_query === query.query_text)
           .map(createNode);

         return {
           name: query.query_text,
           queryRecord: query,
           children: children.length > 0 ? children : undefined,
           attributes: {
             status: query.status,
           },
         };
       };

       return createNode(rootQuery);
     };

     const tree = buildTree(pipelineState.query_history);
     setTreeData(tree);

     if (tree) {
       setSelectedQuery(tree.queryRecord);
     }
   } catch (error) {
     console.error('Error building query tree:', error);
     setTreeData(null);
   } finally {
     setLoading(false);
   }
 }, [pipelineState]);

 // Custom node rendering
 const renderCustomNode = (rd3tNodeProps: CustomNodeElementProps) => {
   const nodeDatum = rd3tNodeProps.nodeDatum as unknown as TreeNodeData;
   const isSelected = selectedQuery?.query_text === nodeDatum.queryRecord.query_text;

   const statusColors: Record<'pending' | 'completed' | 'unexplored', string> = {
     pending: '#fb923c',
     completed: '#4ade80',
     unexplored: '#d4d4d8',
   };

   const handleNodeClick = () => {
     setSelectedQuery(nodeDatum.queryRecord);
   };

   return (
     <g>
       <circle
         r={20}
         fill={isSelected ? '#3b82f6' : statusColors[nodeDatum.queryRecord.status]}
         stroke={isSelected ? '#1e40af' : '#fff'}
         strokeWidth={isSelected ? 3 : 2}
         style={{ cursor: 'pointer' }}
         onClick={handleNodeClick}
       />
       <text
         fill="#000"
         strokeWidth="0"
         x="30"
         y="5"
         style={{
           fontSize: '14px',
           fontWeight: isSelected ? 'bold' : 'normal',
           cursor: 'pointer',
         }}
         onClick={handleNodeClick}
       >
         {nodeDatum.name.length > 30
           ? `${nodeDatum.name.substring(0, 30)}...`
           : nodeDatum.name}
       </text>
     </g>
   );
 };

 // Get status badge style
 const getStatusBadgeClass = (status: string): string => {
   switch (status) {
     case 'pending':
       return 'bg-orange-100 text-orange-800 border-orange-200';
     case 'completed':
       return 'bg-green-100 text-green-800 border-green-200';
     case 'unexplored':
       return 'bg-gray-100 text-gray-800 border-gray-200';
     default:
       return 'bg-gray-100 text-gray-800 border-gray-200';
   }
 };

 // Render synthesis output
 const renderSynthesisOutput = () => {
  if (!selectedQuery) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No Query Selected</div>
          <p className="text-gray-500 text-sm">Select a query node to view its output</p>
        </div>
      </div>
    );
  }

  if (selectedQuery.status !== 'completed' || !selectedQuery.output) {
    return (
      <div className="flex w-full justify-center h-full">
        <div className="text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
             <h3 className="text-base font-semibold text-gray-900 mb-2">Query</h3>
             <p className="text-gray-700 text-sm break-words">{selectedQuery.query_text}</p>
          </div>

          <br/>

          <div className="text-gray-400 text-lg mb-2">No Output Available</div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(selectedQuery.status)}`}>
            {selectedQuery.status.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  const output = selectedQuery.output;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Query Title */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Query</h3>
        <p className="text-gray-700 text-sm break-words">{selectedQuery.query_text}</p>
      </div>

      {/* Answer */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Answer</h3>
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{output.answer}</p>
      </div>

      {/* Confidence Score */}
      {output.confidence_score !== undefined && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900">Confidence Score:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              output.confidence_score > 0.8 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-orange-100 text-orange-800 border-orange-200'
            }`}>
              {(output.confidence_score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Citations */}
      {output.citations && output.citations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Citations ({output.citations.length})
          </h3>
          <div className="space-y-3">
            {output.citations.map((citation, index) => (
              <div
                key={`${citation.paper_id}-${index}`}
                className="bg-gray-50 border border-gray-200 rounded-md p-3"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 break-words">{citation.paper_title}</h4>
                  <blockquote className="bg-white border-l-4 border-blue-500 p-3 text-sm italic text-gray-700 break-words">
                    "{citation.excerpt}"
                  </blockquote>
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className="text-gray-500 break-all">Paper ID: {citation.paper_id}</span>
                    <span className="text-gray-300">|</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded border border-blue-200">
                      Confidence: {(citation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structure */}
      {output.structure && Object.keys(output.structure).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Answer Structure</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-[300px] border border-gray-200">
            {JSON.stringify(output.structure, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};


 // Render tree section
 const renderTreeSection = () => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading query tree...</p>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No Data</div>
          <p className="text-gray-500 text-sm">No query history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <span className="text-gray-600">Status Legend:</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs border border-orange-200">
            Pending
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-200">
            Completed
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs border border-gray-200">
            Unexplored
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tree
          data={treeData}
          renderCustomNodeElement={renderCustomNode}
          orientation="vertical"
          translate={{ x: 300, y: 50 }}
          pathFunc="step"
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          nodeSize={{ x: 200, y: 100 }}
          zoom={0.8}
          enableLegacyTransitions
        />
      </div>
    </div>
  );
};


 if (!visible) return null;

 return (
   <div className="fixed inset-0 z-50 flex items-center justify-center">
     {/* Backdrop */}
     <div
       className="absolute inset-0 bg-black/50"
       onClick={onClose}
     />

     {/* Modal */}
     <div className="relative bg-white rounded-lg shadow-xl w-[90vw] h-[85vh] max-w-[1600px] flex flex-col">
       {/* Header */}
       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
         <h2 className="text-xl font-semibold text-gray-900">Query History Tree</h2>
         <button
           onClick={onClose}
           className="text-gray-400 hover:text-gray-600 transition-colors"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>

       {/* Content */}
       <div className="flex flex-1 min-h-0">
         {/* Left side - Tree Graph */}
         <div className="w-[45%] border-r border-gray-200 bg-gray-50 overflow-hidden">
            {renderTreeSection()}
        </div>

         {/* Right side - Synthesis Output */}
         <div className="flex flex-1 w-[55%] p-6 overflow-y-auto overflow-x-hidden bg-white">
           {renderSynthesisOutput()}
         </div>
       </div>
     </div>
   </div>
 );
};

export default QueryTreeModal;

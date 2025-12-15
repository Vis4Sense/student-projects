import React, { useState, useEffect } from 'react';
import { Tree, CustomNodeElementProps, TreeLinkDatum } from 'react-d3-tree';
import type { RawNodeDatum } from 'react-d3-tree';

// 假设这些接口来自 '@/types/pipeline' 或在此处定义以供完整性
export interface SemanticDelta {
    magnitude: number;
    added: string[];
    removed: string[];
}

export interface SynthesisAgentOutput {
    answer: string;
    confidence_score: number;
    citations?: {
        paper_id: string;
        paper_title: string;
        excerpt: string;
        confidence: number;
    }[];
    structure?: Record<string, any>;
}

export interface QueryRecord {
    query_text: string;
    parent_query: string | null;
    status: 'pending' | 'completed' | 'unexplored';
    output?: SynthesisAgentOutput;
    semantic_delta?: SemanticDelta;
}

export interface PipelineState {
    query_history: QueryRecord[];
    stage: 'initializing' | 'running' | 'completed' | 'failed';
}
// --- 接口定义结束 ---


interface QueryTreeModalProps {
  visible: boolean;
  onClose: () => void;
  pipelineState: PipelineState | null;
  onSelectQuery: (queryText: string) => Promise<void>;
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
  onSelectQuery,
}) => {
  const [selectedQuery, setSelectedQuery] = useState<QueryRecord | null>(null);
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [deltaWarning, setDeltaWarning] = useState(false);

  // Build tree structure from query_history
  useEffect(() => {
    if (!pipelineState?.query_history || pipelineState.query_history.length === 0) {
      setTreeData(null);
      setSelectedQuery(null);
      setDeltaWarning(false);
      return;
    }

    setLoading(true);
    let hasSemanticDeltaData = false;

    try {
      const buildTree = (queries: QueryRecord[]): TreeNodeData | null => {
        const allQueryTexts = new Set(queries.map(q => q.query_text));

        let rootQuery = queries.find(q => !q.parent_query || !allQueryTexts.has(q.parent_query));

        if (!rootQuery && queries.length > 0) {
          console.warn('No clear root query found. Using the first query as fallback root.');
          rootQuery = queries[0];
        }

        if (!rootQuery) {
          return null;
        }

        const createNode = (query: QueryRecord): TreeNodeData => {
          if (query.semantic_delta && (query.semantic_delta.added.length || query.semantic_delta.removed.length)) {
            hasSemanticDeltaData = true;
          }

          const children = queries
            .filter(q => q.parent_query === query.query_text)
            .map(child => createNode(child));

          const node: TreeNodeData = {
            name: query.query_text,
            queryRecord: query,
            children: children.length > 0 ? children : undefined,
            attributes: {
              status: query.status,
            },
          };

          return node;
        };

        return createNode(rootQuery);
      };

      const tree = buildTree(pipelineState.query_history);
      setTreeData(tree);

      setDeltaWarning(!hasSemanticDeltaData);

      if (tree) {
        setSelectedQuery(tree.queryRecord);
      }
    } catch (error) {
      console.error('Error building query tree:', error);
      setTreeData(null);
      setDeltaWarning(false);
    } finally {
      setLoading(false);
    }
  }, [pipelineState]);

const renderCustomNode = (rd3tNodeProps: CustomNodeElementProps) => {
    const { nodeDatum } = rd3tNodeProps;
    const data = nodeDatum as unknown as TreeNodeData;
    const isSelected = selectedQuery?.query_text === data.queryRecord.query_text;

    const statusColors: Record<'pending' | 'completed' | 'unexplored', string> = {
      pending: '#fb923c',
      completed: '#4ade80',
      unexplored: '#d4d4d8',
    };

    const handleNodeClick = () => {
      setSelectedQuery(data.queryRecord);
    };

    const delta = data.queryRecord.semantic_delta;
    const hasDelta = delta && (delta.added.length || delta.removed.length);

    const renderDeltaForeignObject = () => {
      if (!hasDelta) {
        return null;
      }

      const displayAdded = delta.added.slice(0, 3);
      const displayRemoved = delta.removed.slice(0, 3);
      const hasMore = delta.added.length > 3 || delta.removed.length > 3;
      const magnitude = (delta.magnitude * 100).toFixed(0);

      const FO_WIDTH = 220;
      const FO_HEIGHT = 125;

      return (
        <foreignObject
          width={FO_WIDTH}
          height={FO_HEIGHT}
          x={-(FO_WIDTH / 2)}
          y={30}
        >
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '6px',
              fontSize: '11px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              whiteSpace: 'normal',
              maxHeight: `${FO_HEIGHT}px`,
              overflow: 'auto',
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedQuery(data.queryRecord);
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#374151', fontSize: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '2px' }}>
              Shift: {magnitude}%
            </div>
            {displayAdded.map((word, i) => (
              <div key={`add-${i}`} style={{ color: '#16a34a', fontWeight: '600', lineHeight: '1.3' }}>
                + {word}
              </div>
            ))}
            {displayRemoved.map((word, i) => (
              <div key={`rem-${i}`} style={{ color: '#dc2626', fontWeight: '600', lineHeight: '1.3' }}>
                - {word}
              </div>
            ))}
            {hasMore && (
              <div style={{ color: '#6b7280', fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>
                ... ({(delta.added.length + delta.removed.length) - (displayAdded.length + displayRemoved.length)} more)
              </div>
            )}
          </div>
        </foreignObject>
      );
    };

    const MAX_QUERY_LENGTH = 30;
    const displayedQuery = data.name.length > MAX_QUERY_LENGTH
        ? `${data.name.substring(0, MAX_QUERY_LENGTH - 3)}...`
        : data.name;

    return (
      <g>
        {renderDeltaForeignObject()}

        {/* Node circle */}
        <circle
          r={20}
          fill={isSelected ? '#3b82f6' : statusColors[data.queryRecord.status]}
          stroke={isSelected ? '#1e40af' : '#fff'}
          strokeWidth={isSelected ? 3 : 2}
          style={{ cursor: 'pointer' }}
          onClick={handleNodeClick}
        />

        <text
          fill="#000"
          strokeWidth="0"
          x="0"
          y={165}
          style={{
            fontSize: '12px',
            fontWeight: isSelected ? 'bold' : 'normal',
            cursor: 'pointer',
            textAnchor: 'middle',
            maxWidth: '220px',
          }}
          onClick={handleNodeClick}
        >
          {displayedQuery}
        </text>
      </g>
    );
  };

  // Path class function and other helper functions (保持不变)
  const getPathClass = (link: TreeLinkDatum) => {
    const target = link.target.data as unknown as TreeNodeData;
    const delta = target.queryRecord.semantic_delta;

    if (!delta) return 'link-default';

    const magnitude = delta.magnitude;
    if (magnitude > 0.6) return 'link-pivot';
    if (magnitude > 0.3) return 'link-moderate';
    return 'link-fine-tune';
  };

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

  const renderSemanticDelta = (delta: SemanticDelta) => {
    const getMagnitudeColor = (magnitude: number) => {
      if (magnitude < 0.3) return 'text-green-600';
      if (magnitude < 0.6) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getMagnitudeLabel = (magnitude: number) => {
      if (magnitude < 0.3) return 'Minor shift';
      if (magnitude < 0.6) return 'Moderate shift';
      return 'Major shift';
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Semantic Analysis</h3>

        {/* Magnitude */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">Semantic Change:</span>
            <span className={`text-sm font-semibold ${getMagnitudeColor(delta.magnitude)}`}>
              {getMagnitudeLabel(delta.magnitude)} ({(delta.magnitude * 100).toFixed(1)}%)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                delta.magnitude < 0.3 ? 'bg-green-500' :
                delta.magnitude < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${delta.magnitude * 100}%` }}
            />
          </div>
        </div>

        <br/>

        {/* Added concepts */}
        {delta.added.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700 block mb-1">Added Concepts:</span>
            <div className="flex flex-wrap gap-1">
              {delta.added.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full border border-green-200"
                >
                  +{concept}
                </span>
              ))}
            </div>
          </div>
        )}

        <br/>

        {/* Removed concepts */}
        {delta.removed.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700 block mb-1">Removed Concepts:</span>
            <div className="flex flex-wrap gap-1">
              {delta.removed.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full border border-red-200"
                >
                  -{concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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

    if (selectedQuery.status === 'pending' && !selectedQuery.output) {
      return (
        <div className="flex flex-col gap-2 w-full justify-center h-full">
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

    const handleExploreQuery = async () => {
      if (!onSelectQuery) return;

      if (selectedQuery.status === 'unexplored') {
        try {
          await onSelectQuery(selectedQuery.query_text);
        } catch (error) {
          console.error('Failed to explore query:', error);
        }
      }
    };

    if (selectedQuery.status === 'unexplored' && !selectedQuery.output) {
      return (
        <div className="flex flex-col gap-2 w-full justify-center h-full">
          <div className="text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Query</h3>
              <p className="text-gray-700 text-sm break-words">{selectedQuery.query_text}</p>
            </div>

            <br/>

            {/* Show semantic delta if available */}
            {selectedQuery.semantic_delta && renderSemanticDelta(selectedQuery.semantic_delta)}

            <br/>

            <div className="text-gray-400 text-lg mb-2">No Output Available</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(selectedQuery.status)}`}>
              {selectedQuery.status.toUpperCase()}
            </span>
          </div>

          {pipelineState?.stage === 'completed' && (
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
              <button
                onClick={handleExploreQuery}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors 
                  bg-blue-600 text-white hover:bg-blue-700`}
              >
                Explore This Query Further
              </button>
            </div>
          )}

          {pipelineState?.stage !== 'completed' && (
            <div className="flex items-center border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
              <span className="text-sm text-gray-600">
                You have to finish the pipeline first to explore queries further
              </span>
            </div>
          )}
        </div>
      );
    }

    if (!selectedQuery.output) {
      return (
        <div>empty output</div>
      );
    }

    const output = selectedQuery.output;

    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Query Title */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Query</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{selectedQuery.query_text}</p>
          {selectedQuery.parent_query && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">Parent Query:</span>
              <p className="text-xs text-gray-600 mt-1">{selectedQuery.parent_query}</p>
            </div>
          )}
        </div>

        {/* Semantic Delta (if available) - 在详细信息面板中全面展示 */}
        {selectedQuery.semantic_delta && renderSemanticDelta(selectedQuery.semantic_delta)}

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
        <style>
          {`
            .link-default {
              stroke: #d4d4d8;
              stroke-width: 1px;
            }
            .link-fine-tune {
              stroke: #94a3b8;
              stroke-width: 1.5px;
              stroke-dasharray: 5; 
            }
            .link-moderate {
              stroke: #64748b;
              stroke-width: 2.5px;
            }
            .link-pivot {
              stroke: #334155;
              stroke-width: 4px;
            }
          `}
        </style>

        <div className="px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="text-gray-600 font-medium">Status Legend (Node):</span>
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
          <div className="flex items-center gap-4 text-sm flex-wrap mt-2">
            <span className="text-gray-600 font-medium">Edge Legend (Semantic Shift):</span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <span className="text-xs text-gray-600">Minor (&lt;30%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-gray-500 border-t border-dashed border-gray-500"></div>
              <span className="text-xs text-gray-600">Moderate (30-60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-1 bg-gray-700"></div>
              <span className="text-xs text-gray-600">Major (&gt;60%)</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Tree
            data={treeData}
            renderCustomNodeElement={renderCustomNode}
            pathClassFunc={getPathClass}
            orientation="horizontal"
            translate={{ x: 150, y: 300 }}
            pathFunc="step"
            separation={{ siblings: 1.5, nonSiblings: 2.5 }}
            nodeSize={{ x: 300, y: 200 }}
            zoom={0.7}
            centeringTransitionDuration={500}
            enableLegacyTransitions
            shouldCollapseNeighborNodes={false}
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
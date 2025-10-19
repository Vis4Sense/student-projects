'use client';

import { atom, useAtom } from 'jotai';

type SelectedNode = {
  id: string;
  type: string;
} | null;

const selectedNodeAtom = atom<SelectedNode>(null);

export function useSelectedNode() {
  const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

  return {
    selectedNode,
    selectNode: (id: string, type: string) => setSelectedNode({ id, type }),
    clearSelection: () => setSelectedNode(null),
  };
}

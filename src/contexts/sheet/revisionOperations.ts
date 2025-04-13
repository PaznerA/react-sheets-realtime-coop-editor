
import { SheetData, SheetRevision } from "@/types/sheet";

export const createRevision = (prevData: SheetData, description: string): SheetData => {
  const newRevision: SheetRevision = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    description,
    rows: JSON.parse(JSON.stringify(prevData.rows)),
  };
  
  // Zajistíme, že revisions existuje
  const currentRevisions = prevData.revisions || [];
  
  return {
    ...prevData,
    revisions: [...currentRevisions, newRevision],
    currentRevision: currentRevisions.length,
  };
};

export const loadRevision = (prevData: SheetData, revisionIndex: number): SheetData => {
  const revisions = prevData.revisions || [];
  
  if (revisionIndex < 0 || revisionIndex >= revisions.length) {
    return prevData;
  }
  
  return {
    ...prevData,
    rows: JSON.parse(JSON.stringify(revisions[revisionIndex].rows)),
    currentRevision: revisionIndex,
  };
};


import { SheetData, SheetRevision } from "@/types/sheet";

export const createRevision = (prevData: SheetData, description: string): SheetData => {
  const newRevision: SheetRevision = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    description,
    rows: JSON.parse(JSON.stringify(prevData.rows)),
  };
  
  return {
    ...prevData,
    revisions: [...prevData.revisions, newRevision],
    currentRevision: prevData.revisions.length,
  };
};

export const loadRevision = (prevData: SheetData, revisionIndex: number): SheetData => {
  if (revisionIndex < 0 || revisionIndex >= prevData.revisions.length) {
    return prevData;
  }
  
  return {
    ...prevData,
    rows: JSON.parse(JSON.stringify(prevData.revisions[revisionIndex].rows)),
    currentRevision: revisionIndex,
  };
};


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SheetProvider } from "@/contexts/SheetContext";
import SheetEditor from "@/components/SheetEditor/SheetEditor";
import { getProject, getSheetData, saveSheetData } from "@/services/projectService";
import { SheetData } from "@/types/sheet";
import { toast } from "@/components/ui/use-toast";
import { createEmptySheet } from "@/data/defaultTemplates";

const Editor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  useEffect(() => {
    if (projectId) {
      const projectData = getProject(projectId);
      if (projectData) {
        setProject(projectData);
        const sheet = getSheetData(projectData.sheetId);
        if (sheet) {
          setSheetData(sheet);
        } else {
          // Initialize with empty sheet if none exists
          const emptySheet = createEmptySheet();
          setSheetData(emptySheet);
          saveSheetData(projectData.sheetId, emptySheet);
        }
      } else {
        toast({
          title: "Chyba",
          description: "Projekt nebyl nalezen",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Načítání...</p>
      </div>
    );
  }

  if (!project || !sheetData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Projekt nebyl nalezen nebo není k dispozici.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-md p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm opacity-80">{project.description}</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="bg-white rounded-md shadow-soft">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Správa dat</h2>
            <SheetProvider initialData={sheetData} sheetId={project.sheetId}>
              <SheetEditor />
            </SheetProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;

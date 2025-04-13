
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject } from "@/services/projectService";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { TemplateSelector } from "@/components/TemplateSelector/TemplateSelector";
import { toast } from "@/components/ui/use-toast";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: "", description: "", templateId: "" });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedProjects = getProjects();
    setProjects(fetchedProjects);
  }, []);

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Chyba",
        description: "Prosím zadejte název projektu",
        variant: "destructive"
      });
      return;
    }

    try {
      // Vytvoříme nový projekt s unitId (prázdný string jako default)
      const createdProject = createProject({
        name: newProject.name,
        description: newProject.description,
        sheetId: Math.random().toString(36).substring(2, 15),
        unitId: "" // Default prázdný unitId
      });

      setProjects([...projects, createdProject]);
      setNewProject({ name: "", description: "", templateId: "" });
      setOpen(false);
      
      toast({
        title: "Úspěch",
        description: "Projekt byl úspěšně vytvořen"
      });
      
      // Naviguj do editoru nového projektu
      navigate(`/editor/${createdProject.id}`);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit projekt",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      
      toast({
        title: "Úspěch",
        description: "Projekt byl úspěšně smazán"
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat projekt",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projekty</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nový projekt</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nový projekt</DialogTitle>
              <DialogDescription>
                Vytvořte nový projekt a začněte spravovat jeho data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Název
                </Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Popis
                </Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template" className="text-right">
                  Šablona
                </Label>
                <div className="col-span-3">
                  <TemplateSelector
                    selectedId={newProject.templateId}
                    onSelect={(id) => setNewProject({ ...newProject, templateId: id })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateProject}>
                Vytvořit projekt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Vytvořeno: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Aktualizováno: {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="default"
                onClick={() => navigate(`/editor/${project.id}`)}
              >
                Otevřít
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 mb-4">Zatím nemáte žádné projekty.</p>
            <Button onClick={() => setOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Vytvořit první projekt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

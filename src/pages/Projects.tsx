
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects, createProject } from "@/services/projectService";
import { Project } from "@/types/project";
import { Plus, Search, Calendar, Edit, ArrowRightCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [searchTerm, setSearchTerm] = useState("");
  const [newProject, setNewProject] = useState({ name: "", description: "", sheetId: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Chyba",
        description: "Název projektu je povinný.",
        variant: "destructive",
      });
      return;
    }

    const createdProject = createProject({
      name: newProject.name,
      description: newProject.description,
      sheetId: `sheet-${Date.now()}`
    });

    setProjects([...projects, createdProject]);
    setNewProject({ name: "", description: "", sheetId: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Úspěch",
      description: "Projekt byl úspěšně vytvořen.",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('cs-CZ');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projekty</h1>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text" 
              placeholder="Hledat projekty..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nový projekt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vytvořit nový projekt</DialogTitle>
                <DialogDescription>
                  Vyplňte informace o novém projektu.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Název projektu</Label>
                  <Input 
                    id="name" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea 
                    id="description" 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Zrušit</Button>
                <Button onClick={handleCreateProject}>Vytvořit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nebyly nalezeny žádné projekty.</p>
          {searchTerm && (
            <Button 
              variant="link" 
              onClick={() => setSearchTerm("")}
              className="mt-2"
            >
              Vymazat vyhledávání
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Aktualizováno: {formatDate(project.updatedAt)}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-3">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Upravit
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/editor/${project.id}`}>
                      Otevřít
                      <ArrowRightCircle className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;

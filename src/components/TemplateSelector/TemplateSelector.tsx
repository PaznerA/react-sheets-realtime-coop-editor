
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, FileText } from 'lucide-react';
import { templates } from '@/data/defaultTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  selectedTemplateId 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card 
          key={template.id} 
          className={`cursor-pointer transition-all ${
            selectedTemplateId === template.id 
              ? 'ring-2 ring-primary' 
              : 'hover:shadow-md'
          }`}
          onClick={() => onSelectTemplate(template.id)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
              {template.name}
              {selectedTemplateId === template.id && (
                <Check className="h-5 w-5 ml-auto text-primary" />
              )}
            </CardTitle>
            <CardDescription>
              {template.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              {template.data.columns.length} sloupců, {template.data.rows.length} předpřipravených řádků
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant={selectedTemplateId === template.id ? "default" : "outline"}
              className="w-full"
              onClick={() => onSelectTemplate(template.id)}
            >
              {selectedTemplateId === template.id ? "Vybráno" : "Vybrat"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;

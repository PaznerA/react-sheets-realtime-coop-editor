
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  History, 
  Check, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { useSheet } from '@/contexts/SheetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast';
import { useSpacetime } from '@/module_bindings/client';

interface Savepoint {
  id: string;
  sheetId: string;
  createdAt: number;
  message: string;
  createdByUserId: string;
  timestampAlias: string;
}

const RevisionPanel: React.FC = () => {
  const { sheetData, refreshSheet, saveRevision, loadRevision } = useSheet();
  const client = useSpacetime();
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [savepoints, setSavepoints] = useState<Savepoint[]>([]);
  const [currentSavepointId, setCurrentSavepointId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Initialize revisions if they don't exist
  useEffect(() => {
    if (sheetData && !sheetData.revisions) {
      saveRevision('Initial state');
    }
  }, [sheetData]);

  // Načíst savepoints při otevření
  useEffect(() => {
    if (open && sheetData?.id) {
      loadSavepoints();
    }
  }, [open, sheetData?.id]);

  const loadSavepoints = async () => {
    if (!sheetData?.id) return;
    
    try {
      setLoading(true);
      
      if (client) {
        const result = await client.getSavepoints(sheetData.id);
        
        // Ensure result and result.savepoints exist before setting state
        if (result && result.savepoints) {
          setSavepoints(result.savepoints);
          setCurrentSavepointId(result.currentSavepointId || '');
        } else {
          console.warn('No savepoints returned from SpacetimeDB');
          setSavepoints([]);
        }
      } else {
        // Fallback to local revisions if SpacetimeDB is not available
        const revisions = sheetData.revisions || [];
        const localSavepoints = revisions.map((rev, index) => ({
          id: rev.id,
          sheetId: sheetData.id,
          createdAt: rev.timestamp.getTime(),
          message: rev.description,
          createdByUserId: 'local-user',
          timestampAlias: `v${index + 1}`,
        }));
        
        setSavepoints(localSavepoints);
        setCurrentSavepointId(
          sheetData.currentRevision !== undefined && revisions[sheetData.currentRevision] 
            ? revisions[sheetData.currentRevision].id 
            : ''
        );
      }
    } catch (error) {
      console.error('Failed to load savepoints:', error);
      setSavepoints([]); // Ensure savepoints is an empty array on error
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst revize",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRevision = async () => {
    if (!sheetData?.id) return;
    
    if (description.trim()) {
      try {
        setLoading(true);
        
        if (client) {
          const savepointId = await client.createSavepoint(
            sheetData.id, 
            description
          );
          
          // Aktualizovat seznam savepointů
          await loadSavepoints();
        } else {
          // Lokální uložení revize
          saveRevision(description);
          await loadSavepoints();
        }
        
        setDescription('');
        toast({
          title: "Úspěch",
          description: "Revize byla uložena",
        });
      } catch (error) {
        console.error('Failed to save revision:', error);
        toast({
          title: "Chyba",
          description: "Nepodařilo se uložit revizi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Chyba",
        description: "Zadejte prosím popis revize",
        variant: "destructive",
      });
    }
  };

  const handleLoadRevision = async (savepointId: string) => {
    try {
      setLoading(true);
      
      if (client) {
        const success = await client.revertToSavepoint(savepointId);
        
        if (success) {
          // Sheet data byla aktualizována v databázi, potřebujeme je refreshnout
          await refreshSheet();
          setOpen(false);
          
          toast({
            title: "Úspěch",
            description: "Revize byla načtena",
          });
        } else {
          throw new Error('Failed to revert to savepoint');
        }
      } else {
        // Lokální načtení revize
        const revisionIndex = savepoints.findIndex(sp => sp.id === savepointId);
        if (revisionIndex !== -1) {
          loadRevision(revisionIndex);
          setOpen(false);
          
          toast({
            title: "Úspěch",
            description: "Revize byla načtena",
          });
        }
      }
    } catch (error) {
      console.error('Failed to load revision:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst revizi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'PPp', { locale: cs });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>Historie verzí</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historie verzí</SheetTitle>
          <SheetDescription>
            Spravujte historie změn a obnovte předchozí verze.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Uložit aktuální stav</h3>
              <div className="mt-2 flex space-x-2">
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Popis změn"
                  className="flex-1"
                  disabled={loading}
                />
                <Button 
                  onClick={handleSaveRevision} 
                  size="sm"
                  disabled={loading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Uložit
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Historie verzí</h3>
              
              {loading ? (
                <div className="py-4 text-center">Načítání...</div>
              ) : !savepoints || savepoints.length === 0 ? (
                <p className="text-sm text-gray-500">Zatím nebyly uloženy žádné revize.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {savepoints.map((savepoint) => (
                    <div 
                      key={savepoint.id}
                      className={`p-2 border rounded flex justify-between items-center ${
                        currentSavepointId === savepoint.id ? 'bg-secondary/50 border-primary' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{savepoint.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(savepoint.createdAt)}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLoadRevision(savepoint.id)}
                        disabled={loading || currentSavepointId === savepoint.id}
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="sr-only">Obnovit</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="secondary">
              Zavřít
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RevisionPanel;

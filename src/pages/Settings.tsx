
// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Database, Save, RefreshCw } from "lucide-react";
import { syncWithSpaceTimeDB, isUsingCloud, setUseCloud } from "@/services/projectService";

const Settings = () => {
  const [useCloud, setUseCloudState] = useState(isUsingCloud());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncWithSpaceTimeDB = async () => {
    try {
      setIsSyncing(true);
      toast({
        title: "Synchronizace zahájena",
        description: "Data se synchronizují se SpaceTimeDB...",
      });
      
      await syncWithSpaceTimeDB();
      
      toast({
        title: "Synchronizace dokončena",
        description: "Všechna data byla úspěšně synchronizována.",
      });
    } catch (error) {
      toast({
        title: "Chyba synchronizace",
        description: error instanceof Error ? error.message : "Neznámá chyba při synchronizaci.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleCloud = (checked: boolean) => {
    setUseCloudState(checked);
    setUseCloud(checked);
    
    toast({
      title: checked ? "Cloud aktivován" : "Cloud deaktivován",
      description: checked 
        ? "Data budou synchronizována se SpaceTimeDB." 
        : "Data budou ukládána pouze lokálně.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Nastavení</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Ukládání dat
            </CardTitle>
            <CardDescription>
              Konfigurace ukládání a synchronizace dat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="local-storage">Ukládat do Local Storage</Label>
                  <p className="text-sm text-muted-foreground">
                    Data budou uložena v prohlížeči a budou dostupná i offline
                  </p>
                </div>
                <Switch id="local-storage" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="use-cloud">Použít SpaceTimeDB</Label>
                  <p className="text-sm text-muted-foreground">
                    Data budou ukládána a synchronizována s cloudovým úložištěm
                  </p>
                </div>
                <Switch 
                  id="use-cloud" 
                  checked={useCloud}
                  onCheckedChange={handleToggleCloud}
                />
              </div>
              
              {useCloud && (
                <>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sync">Automatická synchronizace</Label>
                      <p className="text-sm text-muted-foreground">
                        Data budou automaticky synchronizována se SpaceTimeDB
                      </p>
                    </div>
                    <Switch id="auto-sync" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Manuální synchronizace</Label>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSyncWithSpaceTimeDB} 
                        className="w-full"
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Synchronizace probíhá...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Synchronizovat nyní
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Uložit vše
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Obecná nastavení</CardTitle>
            <CardDescription>
              Nastavení aplikace a uživatelského rozhraní
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Tmavý režim</Label>
                  <p className="text-sm text-muted-foreground">
                    Přepnout na tmavý režim uživatelského rozhraní
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirm-actions">Potvrzovat akce</Label>
                  <p className="text-sm text-muted-foreground">
                    Vyžadovat potvrzení před provedením důležitých akcí
                  </p>
                </div>
                <Switch id="confirm-actions" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

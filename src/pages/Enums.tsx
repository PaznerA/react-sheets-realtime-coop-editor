
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useEnums } from '@/contexts/EnumContext';
import { Enum, EnumValue } from '@/types/enum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Check, X, Circle, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

const Enums = () => {
  const { enums, addEnum, updateEnum, deleteEnum, addEnumValue, updateEnumValue, deleteEnumValue, reorderEnumValue } = useEnums();
  const [activeTab, setActiveTab] = useState<string>(enums[0]?.id || '');
  const [newEnumName, setNewEnumName] = useState('');
  const [newEnumDialogOpen, setNewEnumDialogOpen] = useState(false);
  const [editEnumName, setEditEnumName] = useState('');
  const [editEnumId, setEditEnumId] = useState('');
  const [editEnumDialogOpen, setEditEnumDialogOpen] = useState(false);
  const [newValueName, setNewValueName] = useState('');
  const [editValueName, setEditValueName] = useState('');
  const [editValueId, setEditValueId] = useState('');
  const [editingValue, setEditingValue] = useState<string | null>(null);

  const handleAddEnum = () => {
    if (!newEnumName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the enum",
        variant: "destructive"
      });
      return;
    }

    addEnum(newEnumName.trim());
    setNewEnumName('');
    setNewEnumDialogOpen(false);
    toast({
      title: "Enum created",
      description: `${newEnumName} has been created successfully.`
    });
  };

  const handleUpdateEnum = () => {
    if (!editEnumName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the enum",
        variant: "destructive"
      });
      return;
    }

    updateEnum(editEnumId, editEnumName.trim());
    setEditEnumName('');
    setEditEnumId('');
    setEditEnumDialogOpen(false);
    toast({
      title: "Enum updated",
      description: `Renamed to ${editEnumName} successfully.`
    });
  };

  const handleDeleteEnum = (id: string) => {
    if (id === 'nullable-bool') {
      toast({
        title: "Cannot delete",
        description: "NullableBool is a required enum and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    deleteEnum(id);
    // Set active tab to first remaining enum
    if (activeTab === id) {
      setActiveTab(enums.filter(e => e.id !== id)[0]?.id || '');
    }
    toast({
      title: "Enum deleted",
      description: "The enum has been deleted successfully."
    });
  };

  const handleAddValue = (enumId: string) => {
    if (!newValueName.trim()) {
      toast({
        title: "Value required",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }

    addEnumValue(enumId, newValueName.trim());
    setNewValueName('');
    toast({
      title: "Value added",
      description: `${newValueName} has been added successfully.`
    });
  };

  const handleUpdateValue = (enumId: string, valueId: string, value: string) => {
    if (!value.trim()) {
      toast({
        title: "Value required",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }

    updateEnumValue(enumId, valueId, value.trim());
    setEditingValue(null);
    toast({
      title: "Value updated",
      description: `Value updated to ${value} successfully.`
    });
  };

  const startEditValue = (valueId: string, currentValue: string) => {
    setEditValueId(valueId);
    setEditValueName(currentValue);
    setEditingValue(valueId);
  };

  const cancelEditValue = () => {
    setEditingValue(null);
    setEditValueId('');
    setEditValueName('');
  };

  const startEditEnum = (enumId: string, name: string) => {
    setEditEnumId(enumId);
    setEditEnumName(name);
    setEditEnumDialogOpen(true);
  };

  const handleMoveValue = (enumId: string, valueId: string, direction: 'up' | 'down', currentOrder: number) => {
    const activeEnum = enums.find(e => e.id === enumId);
    if (!activeEnum) return;
    
    const newOrder = direction === 'up' ? Math.max(0, currentOrder - 1) : Math.min(activeEnum.values.length - 1, currentOrder + 1);
    
    if (newOrder !== currentOrder) {
      reorderEnumValue(enumId, valueId, newOrder);
    }
  };

  const renderNullableBoolIcon = (value: string) => {
    switch (value) {
      case 'yes':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'no':
        return <X className="h-4 w-4 text-red-500" />;
      case 'not-set':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const activeEnum = enums.find(e => e.id === activeTab);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enums Management</h1>
        <Dialog open={newEnumDialogOpen} onOpenChange={setNewEnumDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Enum
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Enum</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                placeholder="Enum name" 
                value={newEnumName} 
                onChange={(e) => setNewEnumName(e.target.value)} 
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewEnumDialogOpen(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddEnum}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {enums.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {enums.map((enumItem) => (
              <TabsTrigger key={enumItem.id} value={enumItem.id} className="mr-2 mb-2">
                {enumItem.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {enums.map((enumItem) => (
            <TabsContent key={enumItem.id} value={enumItem.id} className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{enumItem.name}</CardTitle>
                    <CardDescription>
                      Created: {format(new Date(enumItem.createdAt), 'PPp')}
                      <br />
                      Last updated: {format(new Date(enumItem.updatedAt), 'PPp')}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditEnum(enumItem.id, enumItem.name)}
                      disabled={enumItem.id === 'nullable-bool'}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={enumItem.id === 'nullable-bool'}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the "{enumItem.name}" enum and all its values.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDeleteEnum(enumItem.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-gray-500">Values</div>
                    <ScrollArea className="h-[280px] rounded-md border p-4">
                      <div className="space-y-2">
                        {enumItem.values.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No values defined. Add your first value below.
                          </div>
                        ) : (
                          enumItem.values.map((value) => (
                            <div 
                              key={value.id} 
                              className="flex items-center justify-between p-2 rounded-md border bg-background"
                            >
                              <div className="flex items-center gap-2">
                                {enumItem.id === 'nullable-bool' && 
                                  renderNullableBoolIcon(value.value)
                                }
                                {editingValue === value.id ? (
                                  <Input 
                                    className="min-w-[200px]"
                                    value={editValueName} 
                                    onChange={(e) => setEditValueName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUpdateValue(enumItem.id, value.id, editValueName);
                                      } else if (e.key === 'Escape') {
                                        cancelEditValue();
                                      }
                                    }}
                                  />
                                ) : (
                                  <span>{value.value}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {editingValue === value.id ? (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleUpdateValue(enumItem.id, value.id, editValueName)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={cancelEditValue}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleMoveValue(enumItem.id, value.id, 'up', value.order)}
                                      disabled={value.order === 0 || enumItem.id === 'nullable-bool'}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleMoveValue(enumItem.id, value.id, 'down', value.order)}
                                      disabled={value.order === enumItem.values.length - 1 || enumItem.id === 'nullable-bool'}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => startEditValue(value.id, value.value)}
                                      disabled={enumItem.id === 'nullable-bool'}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          disabled={enumItem.id === 'nullable-bool'}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete the value "{value.value}".
                                            This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => deleteEnumValue(enumItem.id, value.id)}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-y-2">
                  <div className="flex w-full sm:w-auto">
                    <Input 
                      placeholder="New value" 
                      className="mr-2"
                      value={newValueName} 
                      onChange={(e) => setNewValueName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddValue(enumItem.id);
                        }
                      }}
                    />
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleAddValue(enumItem.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">No enums available. Create your first enum to get started.</p>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setNewEnumDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Enum
          </Button>
        </div>
      )}

      <Dialog open={editEnumDialogOpen} onOpenChange={setEditEnumDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Enum</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Enum name" 
              value={editEnumName} 
              onChange={(e) => setEditEnumName(e.target.value)} 
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEnumDialogOpen(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleUpdateEnum}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Enums;

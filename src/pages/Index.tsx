
import React from "react";
import { SheetProvider } from "@/contexts/SheetContext";
import SheetEditor from "@/components/SheetEditor/SheetEditor";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Sheet Editor</h1>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Správa dat</h2>
            <SheetProvider>
              <SheetEditor />
            </SheetProvider>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
        © 2023 Sheet Editor - Pokročilá správa tabulkových dat
      </footer>
    </div>
  );
};

export default Index;

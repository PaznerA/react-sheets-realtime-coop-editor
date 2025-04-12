# SpaceTimeSheets Backend Module

C# modul pro SpaceTimeDB, který implementuje backend pro SpaceTimeSheets aplikaci.

## Struktura

- `StdbModule.csproj` - SpaceTimeDB modul projekt
- `Lib.cs` - Hlavní kód modulu s entitami, reducery a query endpointy

## Datové entity

### Project
- `Id` - unikátní ID projektu
- `Name` - název projektu
- `Description` - popis projektu
- `CreatedAt` - timestamp vytvoření
- `UpdatedAt` - timestamp poslední aktualizace
- `SheetId` - ID přidruženého sheetu

### SheetData
- `Id` - unikátní ID sheetu
- `Name` - název sheetu
- `LastUpdated` - timestamp poslední aktualizace
- `ColumnsJson` - JSON string reprezentující strukturu sloupců
- `RowsJson` - JSON string reprezentující data řádků

## Reducery (Funkce pro změnu dat)

### Project
- `CreateProject(name, description, sheetId)` - vytvoření nového projektu
- `UpdateProject(id, name, description, sheetId)` - aktualizace projektu
- `DeleteProject(id)` - smazání projektu (a přidruženého sheetu)

### SheetData
- `SaveSheetData(id, name, columnsJson, rowsJson)` - uložení dat sheetu (vytvoří nový nebo aktualizuje existující)

## Query (Dotazy pro čtení dat)

- `GetAllProjects()` - získání všech projektů
- `GetProject(id)` - získání projektu podle ID
- `GetSheetData(id)` - získání dat sheetu podle ID

## Jak nasadit

```bash
# V adresáři server
spacetime publish
```

Po publikování získáš project ID, které budeš používat ve frontendové aplikaci.

## Použití v React frontend aplikaci

1. V `.env.local` nastav:
```
VITE_SPACETIME_API_KEY=tvůj_api_klíč
VITE_SPACETIME_PROJECT_ID=id_projektu_po_publikaci
```

2. Aktualizuj existující spaceTimeService.ts tak, aby používal nově vytvořené endpointy.

## Testování

Základní testování můžeš provést pomocí SpaceTimeDB CLI:

```bash
# Vytvoření projektu
spacetime call -m server CreateProject "Test projekt" "Testovací popisek" "sheet-123"

# Získání všech projektů
spacetime call -m server GetAllProjects

# Získání konkrétního projektu
spacetime call -m server GetProject project-id-123
```

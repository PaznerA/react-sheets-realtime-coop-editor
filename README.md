# SpaceTimeSheets

SpaceTimeSheets je moderní aplikace pro správu projektů a tabulkových dat s využitím SpaceTimeDB - databáze, která umožňuje real-time synchronizaci dat mezi klienty.

## Popis projektu

SpaceTimeSheets slouží jako nástroj pro organizace a týmy, které potřebují společně spravovat projekty a data ve formě tabulek. Hlavní funkce zahrnují:

- Správa organizačních jednotek (Units) a jejich členů
- Vytváření a správa projektů
- Tabulky s flexibilní strukturou sloupců
- Verzování dat (savepoints) pro možnost obnovení předchozích stavů
- Real-time spolupráce pomocí SpaceTimeDB

## Technologie

- **Server**: C# s SpaceTimeDB modulem
- **Klient**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Databáze**: SpaceTimeDB pro real-time synchronizaci

## Instalace a nastavení

### Předpoklady

- [Node.js & npm](https://nodejs.org/) (verze 18 nebo novější)
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SpaceTimeDB CLI](https://spacetimedb.com/docs/install)

### Instalace SpaceTimeDB

```sh
curl -fsSL https://spacetimedb.com/install.sh | bash
```

Ověřte instalaci:

```sh
spacetime --version
```

### Instalace .NET 8 workload pro SpaceTimeDB

```sh
dotnet workload install wasi-experimental
```

### Nastavení projektu

1. Naklonujte repozitář:

```sh
git clone <URL_REPOZITÁŘE>
cd spacetimeSheets
```

2. Instalace klientských závislostí:

```sh
npm install
```

3. Vygenerování module bindings pro TypeScript:

```sh
mkdir -p src/module_bindings
spacetime generate --lang typescript --out-dir src/module_bindings --project-path server
```

## Spuštění projektu

### Sestavení a spuštění server modulu

1. Sestavte SpaceTimeDB C# modul:

```sh
cd server
dotnet build
```

2. Vytvořte nový SpaceTimeDB projekt (pouze pokud ještě neexistuje):

```sh
spacetime project create spacetime-sheets
```

3. Nasaďte modul do SpaceTimeDB:

```sh
spacetime publish --project spacetime-sheets
```

### Spuštění klientské aplikace

```sh
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173` nebo jiném portu zobrazeném v terminálu.

## Vývoj

### Úprava server modulu

Po úpravě C# kódu v `server/Lib.cs` je potřeba:

1. Znovu sestavit modul:

```sh
cd server
dotnet build
```

2. Aktualizovat nasazení:

```sh
spacetime publish --project spacetime-sheets
```

3. Aktualizovat TypeScript bindings:

```sh
spacetime generate --lang typescript --out-dir src/module_bindings --project-path server
```

### Úprava klientské aplikace

Klientská aplikace se automaticky obnovuje při úpravách zdrojových souborů během vývoje.

## Struktura databáze

SpaceTimeDB modul definuje následující entity:

- **User** - uživatel systému
- **Unit** - organizační jednotka
- **UnitMember** - propojovací tabulka mezi uživateli a jednotkami
- **Project** - projekt patřící jednotce
- **Sheet** - tabulka patřící projektu
- **RowGroup** - skupina řádků v tabulce
- **Row** - řádek tabulky
- **Cell** - buňka tabulky
- **Enum** - definice výčtového typu
- **EnumItem** - položka výčtového typu
- **Savepoint** - uložený bod v historii tabulky

## Licence

Tento projekt je licencován pod [MIT licencí](LICENSE).

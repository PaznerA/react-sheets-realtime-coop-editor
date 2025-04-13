using SpacetimeDB;
using System.Collections.Generic;
using System.Text.Json;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

public static partial class Module
{
    // ************************
    // * ENTITY DEFINITIONS   *
    // ************************

    // User entity
    [Table(Name = "User", Public = true)]
    public partial class User
    {
        [PrimaryKey]
        public string Id = "";
        public string Email = "";
        public string Name = "";
        public long CreatedAt;
        public string PasswordHash = ""; // Hashed, never stored in plain text!
        public bool IsActive;
    }

    // Unit entity - organizational unit
    [Table(Name = "Unit", Public = true)]
    public partial class Unit
    {
        [PrimaryKey]
        public string Id = "";
        public string Name = "";
        public string Description = "";
        public long CreatedAt;
        public long UpdatedAt;
    }

    // UnitMember - join table for Users and Units (many-to-many)
    [Table(Name = "UnitMember", Public = true)]
    public partial class UnitMember
    {
        [PrimaryKey]
        public string Id = "";
        public string UnitId = "";
        public string UserId = "";
        public string Role = ""; // e.g. "admin", "member", "viewer"
        public long JoinedAt;
    }
    
    // Project entity
    [Table(Name = "Project", Public = true)]
    public partial class Project
    {
        [PrimaryKey]
        public string Id = "";
        public string UnitId = ""; // Projects belong to a unit
        public string Name = "";
        public string Description = "";
        public long CreatedAt;
        public long UpdatedAt;
    }

    // Sheet entity - represents a sheet/grid of data
    [Table(Name = "Sheet", Public = true)]
    public partial class Sheet
    {
        [PrimaryKey]
        public string Id = "";
        public string ProjectId = "";
        public string Name = "";
        public string Description = "";
        public string Type = ""; // e.g. "task", "resource", "timeline"
        public string ColumnsJson = ""; // Serialized JSON array of column definitions
        public long CreatedAt;
        public long UpdatedAt;
        public long LastModified;
    }
    
    // RowGroup entity - groups of rows in a sheet
    [Table(Name = "RowGroup", Public = true)]
    public partial class RowGroup
    {
        [PrimaryKey]
        public string Id = "";
        public string SheetId = "";
        public string Name = "";
        public int OrderIndex; // For displaying groups in specific order
        public bool IsExpanded; // UI state - is the group expanded or collapsed
    }
    
    // Row entity
    [Table(Name = "Row", Public = true)]
    public partial class Row
    {
        [PrimaryKey]
        public string Id = "";
        public string SheetId = "";
        public string GroupId = ""; // Optional - can be empty if not in any group
        public int OrderIndex; // For ordering rows
    }
    
    // Cell entity
    [Table(Name = "Cell", Public = true)]
    public partial class Cell
    {
        [PrimaryKey]
        public string Id = "";
        public string RowId = "";
        public string ColumnId = ""; // References a column definition (not a separate entity, defined in Sheet)
        public string Value = "";
        public string Format = ""; // Optional formatting hint
    }
    
    // Enum entity - definitions for dropdown/select fields
    [Table(Name = "Enum", Public = true)]
    public partial class Enum
    {
        [PrimaryKey]
        public string Id = "";
        public string UnitId = ""; // Enums belong to a unit (can be shared across projects)
        public string Name = "";
        public string Description = "";
    }
    
    // EnumItem entity - items within an enum
    [Table(Name = "EnumItem", Public = true)]
    public partial class EnumItem
    {
        [PrimaryKey]
        public string Id = "";
        public string EnumId = "";
        public string Value = "";
        public string Label = "";
        public string Color = ""; // Optional - for color coding items
        public int OrderIndex; // For ordering items in the enum
    }

    // Savepoint entity - reprezentuje uložený stav sheetu
    [Table(Name = "Savepoint", Public = true)]
    public partial class Savepoint
    {
        [PrimaryKey]
        public string Id = "";
        public string SheetId = "";
        public string Message = "";
        public string UserId = "";
        public long CreatedAt;
        public string RowsSnapshot = ""; // JSON serializace všech rows
        public string GroupsSnapshot = ""; // JSON serializace všech groups
    }
    
    // Column definition - used in columnsJson
    public class ColumnDefinition
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Type { get; set; } = ""; // e.g. "text", "number", "date", "enum", etc.
        public int Width { get; set; }
        public string EnumId { get; set; } = ""; // Optional - for enum columns
        public bool IsReadOnly { get; set; }
        public int OrderIndex { get; set; }
    }

    // Helper class for key-value pairs (replacing Dictionary)
    [Table(Name = "KeyValuePair", Public = true)]
    public partial class KeyValueEntry
    {
        [PrimaryKey]
        public string Id = "";
        public string Category = ""; // For grouping related key-value pairs
        public string Key = "";
        public string Value = "";
    }

    // Result container to store query results
    [Table(Name = "QueryResult", Public = true)]
    public partial class QueryResult
    {
        [PrimaryKey]
        public string Id = "";
        public string QueryId = "";  // ID to identify which query this belongs to
        public string ResultType = ""; // Type of the result (e.g., "enum", "sheet", "project")
        public string EntityId = "";  // ID of the related entity
        public string JsonData = "";  // JSON-serialized data
        public long CreatedAt;
        public int StatusCode;
        public string ErrorMessage;
    }

    // ************************
    // * HELPER METHODS      *
    // ************************

    // Helpers for date conversion
    private static long ToTimestamp(System.DateTime date)
    {
        return ((DateTimeOffset)date).ToUnixTimeMilliseconds();
    }
    
    private static System.DateTime FromTimestamp(long timestamp)
    {
        return DateTimeOffset.FromUnixTimeMilliseconds(timestamp).DateTime;
    }
    
    // Helper to generate IDs
    private static string GenerateId()
    {
        return System.Guid.NewGuid().ToString();
    }

    // Helper to hash passwords - simple SHA256 implementation for demo
    private static string HashPassword(string password)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }

    // ************************
    // * USER REDUCERS       *
    // ************************

    [Reducer]
    public static void CreateUser(ReducerContext ctx, string email, string name, string password)
    {
        // Check if user already exists
        foreach (var existingUser in ctx.Db.User.Iter())
        {
            if (existingUser.Email.ToLower() == email.ToLower())
            {
                Log.Error($"User with email {email} already exists");
                return;
            }
        }
        
        var id = GenerateId();
        var passwordHash = HashPassword(password);
        
        var newUser = new User
        {
            Id = id,
            Email = email,
            Name = name,
            CreatedAt = ToTimestamp(System.DateTime.UtcNow),
            PasswordHash = passwordHash,
            IsActive = true
        };
        
        ctx.Db.User.Insert(newUser);
        Log.Info($"Created user {name} with ID {id}");
    }

    // ************************
    // * UNIT REDUCERS       *
    // ************************

    [Reducer] 
    public static void CreateUnit(ReducerContext ctx, string name, string description, string userId)
    {
        var now = ToTimestamp(System.DateTime.UtcNow);
        var unitId = GenerateId();
        
        var unit = new Unit
        {
            Id = unitId,
            Name = name,
            Description = description,
            CreatedAt = now,
            UpdatedAt = now
        };
        
        ctx.Db.Unit.Insert(unit);
        
        // Add the creator as an admin of this unit
        var unitMember = new UnitMember
        {
            Id = GenerateId(),
            UnitId = unitId,
            UserId = userId,
            Role = "admin",
            JoinedAt = now
        };
        
        ctx.Db.UnitMember.Insert(unitMember);
        Log.Info($"Created unit {name} with ID {unitId} and added user {userId} as admin");
    }
    
    [Reducer]
    public static void AddUserToUnit(ReducerContext ctx, string unitId, string userId, string role)
    {
        // Check if the unit and user exist
        var unit = ctx.Db.Unit.Iter().FirstOrDefault(u => u.Id == unitId);
        if (unit == null)
        {
            Log.Error($"Unit not found with ID {unitId}");
            return;
        }
        
        var user = ctx.Db.User.Iter().FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            Log.Error($"User not found with ID {userId}");
            return;
        }
        
        // Check if the user is already a member of this unit
        foreach (var member in ctx.Db.UnitMember.Iter())
        {
            if (member.UnitId == unitId && member.UserId == userId)
            {
                Log.Error($"User {userId} is already a member of unit {unitId}");
                return;
            }
        }
        
        var unitMember = new UnitMember
        {
            Id = GenerateId(),
            UnitId = unitId,
            UserId = userId,
            Role = role,
            JoinedAt = ToTimestamp(System.DateTime.UtcNow)
        };
        
        ctx.Db.UnitMember.Insert(unitMember);
        Log.Info($"Added user {userId} to unit {unitId} with role {role}");
    }

    // ************************
    // * PROJECT REDUCERS    *
    // ************************

    [Reducer]
    public static void CreateProject(ReducerContext ctx, string unitId, string name, string description)
    {
        var now = ToTimestamp(System.DateTime.UtcNow);
        var id = GenerateId();
        
        var project = new Project
        {
            Id = id,
            UnitId = unitId,
            Name = name,
            Description = description,
            CreatedAt = now,
            UpdatedAt = now
        };
        
        ctx.Db.Project.Insert(project);
        Log.Info($"Created project {name} with ID {id} in unit {unitId}");
    }
    
    [Reducer]
    public static void UpdateProject(ReducerContext ctx, string id, string name, string description)
    {
        var project = ctx.Db.Project.Iter().FirstOrDefault(p => p.Id == id);
        if (project == null)
        {
            Log.Error($"Project not found with ID {id}");
            return;
        }
        
        // Remove the old project
        ctx.Db.Project.Delete(project);
        
        // Insert the updated project
        var updatedProject = new Project
        {
            Id = id,
            UnitId = project.UnitId,
            Name = name,
            Description = description,
            CreatedAt = project.CreatedAt,
            UpdatedAt = ToTimestamp(System.DateTime.UtcNow)
        };
        
        ctx.Db.Project.Insert(updatedProject);
        Log.Info($"Updated project {name} with ID {id}");
    }
    
    [Reducer]
    public static void DeleteProject(ReducerContext ctx, string id)
    {
        var project = ctx.Db.Project.Iter().FirstOrDefault(p => p.Id == id);
        if (project == null)
        {
            Log.Error($"Project not found with ID {id}");
            return;
        }
        
        // First delete all sheets that belong to this project
        var sheetsToDelete = new List<Sheet>();
        foreach (var sheet in ctx.Db.Sheet.Iter())
        {
            if (sheet.ProjectId == id)
            {
                sheetsToDelete.Add(sheet);
            }
        }
        
        // Now that we collected all sheets to delete, delete them
        foreach (var sheet in sheetsToDelete)
        {
            ctx.Db.Sheet.Delete(sheet);
        }
        
        // Now delete the project
        ctx.Db.Project.Delete(project);
        Log.Info($"Deleted project with ID {id} and all its sheets");
    }

    // ************************
    // * SHEET REDUCERS      *
    // ************************

    [Reducer]
    public static void CreateSheet(ReducerContext ctx, string projectId, string name, string description, string type, string columnsJson)
    {
        var now = ToTimestamp(System.DateTime.UtcNow);
        var id = GenerateId();
        
        var sheet = new Sheet
        {
            Id = id,
            ProjectId = projectId,
            Name = name,
            Description = description,
            Type = type,
            CreatedAt = now,
            UpdatedAt = now,
            LastModified = now,
            ColumnsJson = columnsJson
        };
        
        ctx.Db.Sheet.Insert(sheet);
        Log.Info($"Created sheet {name} with ID {id} in project {projectId}");
    }
    
    [Reducer]
    public static void UpdateSheet(ReducerContext ctx, string id, string name, string description, string type, string columnsJson)
    {
        var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == id);
        if (sheet == null)
        {
            Log.Error($"Sheet not found with ID {id}");
            return;
        }
        
        // Remove the old sheet
        ctx.Db.Sheet.Delete(sheet);
        
        // Create the updated sheet
        var updatedSheet = new Sheet
        {
            Id = id,
            ProjectId = sheet.ProjectId,
            Name = name,
            Description = description,
            Type = type,
            CreatedAt = sheet.CreatedAt,
            UpdatedAt = ToTimestamp(System.DateTime.UtcNow),
            LastModified = ToTimestamp(System.DateTime.UtcNow),
            ColumnsJson = columnsJson
        };
        
        ctx.Db.Sheet.Insert(updatedSheet);
        Log.Info($"Updated sheet {name} with ID {id}");
    }
    
    [Reducer]
    public static void DeleteSheet(ReducerContext ctx, string id)
    {
        var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == id);
        if (sheet == null)
        {
            Log.Error($"Sheet not found with ID {id}");
            return;
        }
        
        // First delete all rows, cells, and savepoints
        var rowsToDelete = new List<Row>();
        foreach (var row in ctx.Db.Row.Iter())
        {
            if (row.SheetId == id)
            {
                rowsToDelete.Add(row);
            }
        }
        
        // Delete all cells from these rows
        foreach (var row in rowsToDelete)
        {
            var cellsToDelete = new List<Cell>();
            foreach (var cell in ctx.Db.Cell.Iter())
            {
                if (cell.RowId == row.Id)
                {
                    cellsToDelete.Add(cell);
                }
            }
            
            foreach (var cell in cellsToDelete)
            {
                ctx.Db.Cell.Delete(cell);
            }
            
            // Delete the row
            ctx.Db.Row.Delete(row);
        }
        
        // Delete all row groups
        var rowGroupsToDelete = new List<RowGroup>();
        foreach (var rowGroup in ctx.Db.RowGroup.Iter())
        {
            if (rowGroup.SheetId == id)
            {
                rowGroupsToDelete.Add(rowGroup);
            }
        }
        
        foreach (var rowGroup in rowGroupsToDelete)
        {
            ctx.Db.RowGroup.Delete(rowGroup);
        }
        
        // Delete all savepoints
        var savepointsToDelete = new List<Savepoint>();
        foreach (var savepoint in ctx.Db.Savepoint.Iter())
        {
            if (savepoint.SheetId == id)
            {
                savepointsToDelete.Add(savepoint);
            }
        }
        
        foreach (var savepoint in savepointsToDelete)
        {
            ctx.Db.Savepoint.Delete(savepoint);
        }
        
        // Now delete the sheet
        ctx.Db.Sheet.Delete(sheet);
        Log.Info($"Deleted sheet with ID {id} and all related rows, cells, and savepoints");
    }
    
    [Reducer]
    public static void CreateRow(ReducerContext ctx, string sheetId, string groupId, int orderIndex)
    {
        var id = GenerateId();
        
        var row = new Row
        {
            Id = id,
            SheetId = sheetId,
            GroupId = groupId,
            OrderIndex = orderIndex
        };
        
        ctx.Db.Row.Insert(row);
        Log.Info($"Created row with ID {id} in sheet {sheetId}");
    }
    
    // ************************
    // * CELL REDUCERS       *
    // ************************

    [Reducer]
    public static void UpdateCell(ReducerContext ctx, string rowId, string columnId, string value, string format)
    {
        // Find existing cell or create new
        var existingCell = ctx.Db.Cell.Iter().FirstOrDefault(c => c.RowId == rowId && c.ColumnId == columnId);
        
        if (existingCell != null)
        {
            // Remove old cell
            ctx.Db.Cell.Delete(existingCell);
            
            // Insert updated cell
            var updatedCell = new Cell
            {
                Id = existingCell.Id,
                RowId = rowId,
                ColumnId = columnId,
                Value = value,
                Format = format
            };
            
            ctx.Db.Cell.Insert(updatedCell);
        }
        else
        {
            // Create new cell
            var newCell = new Cell
            {
                Id = GenerateId(),
                RowId = rowId,
                ColumnId = columnId,
                Value = value,
                Format = format
            };
            
            ctx.Db.Cell.Insert(newCell);
        }
        
        Log.Info($"Updated/created cell for row {rowId}, column {columnId}");
    }

    // ************************
    // * SAVEPOINT REDUCERS  *
    // ************************

    [Reducer]
    public static void CreateSavepoint(ReducerContext ctx, string sheetId, string message, string userId, string queryId)
    {
        // Validace vstupních dat
        if (string.IsNullOrEmpty(sheetId))
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "CreateSavepoint",
                StatusCode = 400,
                ErrorMessage = "SheetId is required",
                JsonData = JsonSerializer.Serialize(new { SavepointId = "" })
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        // Ověření, že sheet existuje
        var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == sheetId);
        if (sheet == null)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "CreateSavepoint",
                StatusCode = 404,
                ErrorMessage = $"Sheet not found with ID {sheetId}",
                JsonData = JsonSerializer.Serialize(new { SavepointId = "" })
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        try
        {
            // Získání všech řádků a skupin pro tento sheet
            var rows = new List<Row>();
            foreach (var row in ctx.Db.Row.Iter())
            {
                if (row.SheetId == sheetId)
                {
                    rows.Add(row);
                }
            }
            
            var groups = new List<RowGroup>();
            foreach (var group in ctx.Db.RowGroup.Iter())
            {
                if (group.SheetId == sheetId)
                {
                    groups.Add(group);
                }
            }
            
            // Vytvoření JSON serializace dat
            var rowsJson = JsonSerializer.Serialize(rows);
            var groupsJson = JsonSerializer.Serialize(groups);
            
            // Vytvoření nového savepoint
            var savepointId = GenerateId();
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            
            var savepoint = new Savepoint
            {
                Id = savepointId,
                SheetId = sheetId,
                Message = message,
                UserId = userId,
                CreatedAt = timestamp,
                RowsSnapshot = rowsJson,
                GroupsSnapshot = groupsJson
            };
            
            ctx.Db.Savepoint.Insert(savepoint);
            
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "CreateSavepoint",
                StatusCode = 200,
                JsonData = JsonSerializer.Serialize(new { SavepointId = savepointId })
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
        catch (Exception ex)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "CreateSavepoint",
                StatusCode = 500,
                ErrorMessage = $"Failed to create savepoint: {ex.Message}",
                JsonData = JsonSerializer.Serialize(new { SavepointId = "" })
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
    }
    
    [Reducer]
    public static void GetSavepoints(ReducerContext ctx, string sheetId, string queryId)
    {
        // Validace vstupních dat
        if (string.IsNullOrEmpty(sheetId))
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "GetSavepoints",
                StatusCode = 400,
                ErrorMessage = "SheetId is required",
                JsonData = JsonSerializer.Serialize(new { Savepoints = new List<object>() })
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        // Ověření, že sheet existuje
        var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == sheetId);
        if (sheet == null)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "GetSavepoints",
                StatusCode = 404,
                ErrorMessage = $"Sheet not found with ID {sheetId}",
                JsonData = JsonSerializer.Serialize(new { Savepoints = new List<object>() })
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        try
        {
            // Získání všech savepointů pro tento sheet
            var savepoints = new List<Savepoint>();
            foreach (var savepoint in ctx.Db.Savepoint.Iter())
            {
                if (savepoint.SheetId == sheetId)
                {
                    savepoints.Add(savepoint);
                }
            }
            
            // Seřazení savepointů podle data vytvoření (nejnovější první)
            savepoints = savepoints.OrderByDescending(s => s.CreatedAt).ToList();
            
            // Odstranění velkých JSON dat z odpovědi (šetří přenosovou kapacitu)
            var lightSavepoints = savepoints.Select(s => new
            {
                s.Id,
                s.SheetId,
                s.CreatedAt,
                s.Message,
                s.UserId
            }).ToList();
            
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "GetSavepoints",
                StatusCode = 200,
                JsonData = JsonSerializer.Serialize(new { Savepoints = lightSavepoints })
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
        catch (Exception ex)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "GetSavepoints",
                StatusCode = 500,
                ErrorMessage = $"Failed to get savepoints: {ex.Message}",
                JsonData = JsonSerializer.Serialize(new { Savepoints = new List<object>() })
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
    }
    
    [Reducer]
    public static void RevertToSavepoint(ReducerContext ctx, string savepointId, string queryId)
    {
        // Validace vstupních dat
        if (string.IsNullOrEmpty(savepointId))
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "RevertToSavepoint",
                StatusCode = 400,
                ErrorMessage = "SavepointId is required",
                JsonData = "{}"
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        // Ověření, že savepoint existuje
        var savepoint = ctx.Db.Savepoint.Iter().FirstOrDefault(s => s.Id == savepointId);
        if (savepoint == null)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "RevertToSavepoint",
                StatusCode = 404,
                ErrorMessage = $"Savepoint not found with ID {savepointId}",
                JsonData = "{}"
            };
            
            ctx.Db.QueryResult.Insert(result);
            return;
        }
        
        try
        {
            // Smazat všechny existující řádky v sheetu
            var rowsToDelete = new List<Row>();
            foreach (var row in ctx.Db.Row.Iter())
            {
                if (row.SheetId == savepoint.SheetId)
                {
                    rowsToDelete.Add(row);
                }
            }
            
            foreach (var row in rowsToDelete)
            {
                ctx.Db.Row.Delete(row);
            }
            
            // Smazat všechny existující skupiny v sheetu
            var groupsToDelete = new List<RowGroup>();
            foreach (var group in ctx.Db.RowGroup.Iter())
            {
                if (group.SheetId == savepoint.SheetId)
                {
                    groupsToDelete.Add(group);
                }
            }
            
            foreach (var group in groupsToDelete)
            {
                ctx.Db.RowGroup.Delete(group);
            }
            
            // Deserializovat uložená data
            var restoredRows = JsonSerializer.Deserialize<List<Row>>(savepoint.RowsSnapshot);
            var restoredGroups = JsonSerializer.Deserialize<List<RowGroup>>(savepoint.GroupsSnapshot);
            
            // Vložit řádky a skupiny zpět do databáze
            if (restoredRows != null)
            {
                foreach (var row in restoredRows)
                {
                    ctx.Db.Row.Insert(row);
                }
            }
            
            if (restoredGroups != null)
            {
                foreach (var group in restoredGroups)
                {
                    ctx.Db.RowGroup.Insert(group);
                }
            }
            
            // Aktualizovat sheet (last modified atd.)
            var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == savepoint.SheetId);
            if (sheet != null)
            {
                // Musíme vytvořit novou instanci sheetu a přiřadit všechny hodnoty
                // Plus aktualizovat čas úpravy
                var updatedSheet = new Sheet
                {
                    Id = sheet.Id,
                    ProjectId = sheet.ProjectId,
                    Name = sheet.Name,
                    Description = sheet.Description,
                    Type = sheet.Type,
                    ColumnsJson = sheet.ColumnsJson,
                    CreatedAt = sheet.CreatedAt,
                    UpdatedAt = sheet.UpdatedAt,
                    LastModified = ToTimestamp(System.DateTime.UtcNow)
                };
                
                // Smazat původní sheet
                ctx.Db.Sheet.Delete(sheet);
                
                // Vložit aktualizovaný sheet
                ctx.Db.Sheet.Insert(updatedSheet);
            }
            
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "RevertToSavepoint",
                StatusCode = 200,
                JsonData = JsonSerializer.Serialize(new { Success = true })
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
        catch (Exception ex)
        {
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "RevertToSavepoint",
                StatusCode = 500,
                ErrorMessage = $"Failed to revert to savepoint: {ex.Message}",
                JsonData = "{}"
            };
            
            ctx.Db.QueryResult.Insert(result);
        }
    }

    // ************************
    // * ENUM REDUCERS       *
    // ************************

    [Reducer]
    public static void CreateEnum(ReducerContext ctx, string unitId, string name, string description)
    {
        var id = GenerateId();
        
        var enumEntity = new Enum
        {
            Id = id,
            UnitId = unitId,
            Name = name,
            Description = description
        };
        
        ctx.Db.Enum.Insert(enumEntity);
        Log.Info($"Created enum {name} with ID {id} in unit {unitId}");
    }
    
    [Reducer]
    public static void AddEnumItem(ReducerContext ctx, string enumId, string value, string label, string color, int orderIndex)
    {
        var id = GenerateId();
        
        var enumItem = new EnumItem
        {
            Id = id,
            EnumId = enumId,
            Value = value,
            Label = label,
            Color = color,
            OrderIndex = orderIndex
        };
        
        ctx.Db.EnumItem.Insert(enumItem);
        Log.Info($"Added enum item {value} with ID {id} to enum {enumId}");
    }
    
    [Reducer]
    public static void DeleteEnum(ReducerContext ctx, string id)
    {
        var enumEntity = ctx.Db.Enum.Iter().FirstOrDefault(e => e.Id == id);
        if (enumEntity == null)
        {
            Log.Error($"Enum not found with ID {id}");
            return;
        }
        
        // First delete all items in this enum
        var itemsToDelete = new List<EnumItem>();
        foreach (var item in ctx.Db.EnumItem.Iter())
        {
            if (item.EnumId == id)
            {
                itemsToDelete.Add(item);
            }
        }
        
        foreach (var item in itemsToDelete)
        {
            ctx.Db.EnumItem.Delete(item);
        }
        
        // Now delete the enum
        ctx.Db.Enum.Delete(enumEntity);
        Log.Info($"Deleted enum with ID {id} and {itemsToDelete.Count} items");
    }

    // ************************
    // * OPTIMIZED REDUCERS  *
    // ************************

    // Optimized reducer to get all enum options without multiple round trips
    [Reducer]
    public static void GetEnumOptions(ReducerContext ctx, string enumId, string queryId)
    {
        // Find enum by ID
        var enumData = ctx.Db.Enum.Iter().FirstOrDefault(e => e.Id == enumId);
        if (enumData == null) return;
        
        // Delete any previous results for this query
        var oldResults = ctx.Db.QueryResult.Iter()
            .Where(r => r.QueryId == queryId)
            .ToList();
        
        foreach (var oldResult in oldResults)
        {
            ctx.Db.QueryResult.Delete(oldResult);
        }
        
        // Get all items for this enum and serialize to JSON
        var items = ctx.Db.EnumItem.Iter()
            .Where(item => item.EnumId == enumId)
            .OrderBy(item => item.OrderIndex)
            .Select(item => new 
            {
                id = item.Id,
                value = item.Value,
                label = item.Label,
                color = item.Color
            })
            .ToList();
        
        var jsonData = JsonSerializer.Serialize(items);
        
        // Store the result
        var result = new QueryResult
        {
            Id = GenerateId(),
            QueryId = queryId,
            ResultType = "enum_options",
            EntityId = enumId,
            JsonData = jsonData,
            CreatedAt = ToTimestamp(System.DateTime.UtcNow)
        };
        
        ctx.Db.QueryResult.Insert(result);
        Log.Info($"Generated enum options for enum {enumId} with query ID {queryId}");
    }

    // Get all enums for a unit in a single request to reduce traffic
    [Reducer]
    public static void GetAllEnumsForUnit(ReducerContext ctx, string unitId, string queryId)
    {
        // Delete any previous results for this query
        var oldResults = ctx.Db.QueryResult.Iter()
            .Where(r => r.QueryId == queryId)
            .ToList();
        
        foreach (var oldResult in oldResults)
        {
            ctx.Db.QueryResult.Delete(oldResult);
        }
        
        // Get all enums in the unit
        var enums = ctx.Db.Enum.Iter()
            .Where(e => e.UnitId == unitId)
            .Select(e => new
            {
                id = e.Id,
                name = e.Name,
                description = e.Description
            })
            .ToList();
        
        // Store the enums result
        var enumsResult = new QueryResult
        {
            Id = GenerateId(),
            QueryId = queryId,
            ResultType = "enums_list",
            EntityId = unitId,
            JsonData = JsonSerializer.Serialize(enums),
            CreatedAt = ToTimestamp(System.DateTime.UtcNow)
        };
        
        ctx.Db.QueryResult.Insert(enumsResult);
        
        // Get all enum items for all enums in this unit
        foreach (var enumEntity in ctx.Db.Enum.Iter().Where(e => e.UnitId == unitId))
        {
            var items = ctx.Db.EnumItem.Iter()
                .Where(item => item.EnumId == enumEntity.Id)
                .OrderBy(item => item.OrderIndex)
                .Select(item => new 
                {
                    id = item.Id,
                    value = item.Value,
                    label = item.Label,
                    color = item.Color
                })
                .ToList();
            
            // Store the enum items result
            var itemsResult = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "enum_items",
                EntityId = enumEntity.Id,
                JsonData = JsonSerializer.Serialize(items),
                CreatedAt = ToTimestamp(System.DateTime.UtcNow)
            };
            
            ctx.Db.QueryResult.Insert(itemsResult);
        }
        
        Log.Info($"Generated all enums data for unit {unitId} with query ID {queryId}");
    }

    // Bulk update cells to reduce network traffic
    [Reducer]
    public static void UpdateMultipleCells(ReducerContext ctx, string cellUpdatesJson)
    {
        int updatedCount = 0;
        
        try
        {
            // Parse the JSON data
            var updates = JsonSerializer.Deserialize<List<CellUpdate>>(cellUpdatesJson);
            
            if (updates == null)
            {
                Log.Error("Failed to parse cell updates JSON");
                return;
            }
            
            foreach (var update in updates)
            {
                if (string.IsNullOrEmpty(update.RowId) || 
                    string.IsNullOrEmpty(update.ColumnId) ||
                    update.Value == null)
                {
                    continue;
                }
                
                // Find existing cell or create new
                var existingCell = ctx.Db.Cell.Iter().FirstOrDefault(c => c.RowId == update.RowId && c.ColumnId == update.ColumnId);
                
                if (existingCell != null)
                {
                    // Remove old cell
                    ctx.Db.Cell.Delete(existingCell);
                    
                    // Insert updated cell
                    var updatedCell = new Cell
                    {
                        Id = existingCell.Id,
                        RowId = update.RowId,
                        ColumnId = update.ColumnId,
                        Value = update.Value,
                        Format = update.Format ?? ""
                    };
                    
                    ctx.Db.Cell.Insert(updatedCell);
                }
                else
                {
                    // Create new cell
                    var newCell = new Cell
                    {
                        Id = GenerateId(),
                        RowId = update.RowId,
                        ColumnId = update.ColumnId,
                        Value = update.Value,
                        Format = update.Format ?? ""
                    };
                    
                    ctx.Db.Cell.Insert(newCell);
                }
                
                updatedCount++;
            }
        }
        catch (Exception ex)
        {
            Log.Error($"Error updating cells: {ex.Message}");
            return;
        }
        
        Log.Info($"Bulk updated {updatedCount} cells");
    }
    
    // Helper class for cell updates
    public class CellUpdate
    {
        public string RowId { get; set; } = "";
        public string ColumnId { get; set; } = "";
        public string Value { get; set; } = "";
        public string? Format { get; set; }
    }

    // Generate project list with data from sheets
    [Reducer]
    public static void GetProjectList(ReducerContext ctx, string unitId, string sheetIdsJson, string columnMappingJson, string queryId)
    {
        // Delete any previous results for this query
        var oldResults = ctx.Db.QueryResult.Iter()
            .Where(r => r.QueryId == queryId)
            .ToList();
        
        foreach (var oldResult in oldResults)
        {
            ctx.Db.QueryResult.Delete(oldResult);
        }
        
        try
        {
            // Parse JSON inputs
            var sheetIds = JsonSerializer.Deserialize<List<string>>(sheetIdsJson) ?? new List<string>();
            var columnMappings = JsonSerializer.Deserialize<List<KeyValueMapping>>(columnMappingJson) ?? new List<KeyValueMapping>();
            
            // Get all projects in the unit
            var projects = ctx.Db.Project.Iter()
                .Where(p => p.UnitId == unitId)
                .OrderBy(p => p.Name)
                .ToList();
            
            var projectsData = new List<object>();
            
            foreach (var project in projects)
            {
                var projectData = new Dictionary<string, object>
                {
                    { "id", project.Id },
                    { "name", project.Name },
                    { "description", project.Description },
                    { "createdAt", project.CreatedAt },
                    { "updatedAt", project.UpdatedAt }
                };
                
                // For each sheet in the project that we want to include
                foreach (var sheetId in sheetIds)
                {
                    var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.ProjectId == project.Id && s.Id == sheetId);
                    if (sheet == null) continue;
                    
                    // Get rows and cells
                    var rows = ctx.Db.Row.Iter().Where(r => r.SheetId == sheet.Id).ToList();
                    
                    foreach (var mapping in columnMappings)
                    {
                        var columnId = mapping.Key;
                        var outputField = mapping.Value;
                        
                        // Find cells with the required columnId
                        foreach (var row in rows)
                        {
                            var cell = ctx.Db.Cell.Iter().FirstOrDefault(c => c.RowId == row.Id && c.ColumnId == columnId);
                            if (cell != null)
                            {
                                projectData[outputField] = cell.Value;
                                break; // Find first occurrence
                            }
                        }
                    }
                }
                
                projectsData.Add(projectData);
            }
            
            // Store the result
            var result = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "project_list",
                EntityId = unitId,
                JsonData = JsonSerializer.Serialize(projectsData),
                CreatedAt = ToTimestamp(System.DateTime.UtcNow)
            };
            
            ctx.Db.QueryResult.Insert(result);
            Log.Info($"Generated project list for unit {unitId} with query ID {queryId}");
        }
        catch (Exception ex)
        {
            Log.Error($"Error generating project list: {ex.Message}");
        }
    }
    
    // Helper class for key-value mappings
    public class KeyValueMapping
    {
        public string Key { get; set; } = "";
        public string Value { get; set; } = "";
    }

    // Get all data for a sheet in one go to reduce multiple requests
    [Reducer]
    public static void GetSheetData(ReducerContext ctx, string sheetId, string queryId)
    {
        // Delete any previous results for this query
        var oldResults = ctx.Db.QueryResult.Iter()
            .Where(r => r.QueryId == queryId)
            .ToList();
        
        foreach (var oldResult in oldResults)
        {
            ctx.Db.QueryResult.Delete(oldResult);
        }
        
        // Get the sheet
        var sheet = ctx.Db.Sheet.Iter().FirstOrDefault(s => s.Id == sheetId);
        if (sheet == null)
        {
            Log.Error($"Sheet not found with ID {sheetId}");
            return;
        }
        
        try
        {
            // Basic sheet info
            var sheetData = new Dictionary<string, object>
            {
                { "id", sheet.Id },
                { "name", sheet.Name },
                { "description", sheet.Description },
                { "type", sheet.Type }
            };
            
            // Parse columns from JSON
            try
            {
                var columns = JsonSerializer.Deserialize<List<ColumnDefinition>>(sheet.ColumnsJson);
                sheetData["columns"] = columns ?? new List<ColumnDefinition>();
            }
            catch
            {
                sheetData["columns"] = new List<ColumnDefinition>();
            }
            
            // Store the sheet data
            var sheetResult = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "sheet_data",
                EntityId = sheetId,
                JsonData = JsonSerializer.Serialize(sheetData),
                CreatedAt = ToTimestamp(System.DateTime.UtcNow)
            };
            
            ctx.Db.QueryResult.Insert(sheetResult);
            
            // Get row groups
            var groups = ctx.Db.RowGroup.Iter()
                .Where(g => g.SheetId == sheetId)
                .OrderBy(g => g.OrderIndex)
                .Select(g => new
                {
                    id = g.Id,
                    name = g.Name,
                    orderIndex = g.OrderIndex,
                    isExpanded = g.IsExpanded
                })
                .ToList();
            
            // Store the groups
            var groupsResult = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "sheet_groups",
                EntityId = sheetId,
                JsonData = JsonSerializer.Serialize(groups),
                CreatedAt = ToTimestamp(System.DateTime.UtcNow)
            };
            
            ctx.Db.QueryResult.Insert(groupsResult);
            
            // Get rows
            var rows = ctx.Db.Row.Iter()
                .Where(r => r.SheetId == sheetId)
                .OrderBy(r => r.OrderIndex)
                .Select(r => new
                {
                    id = r.Id,
                    groupId = r.GroupId,
                    orderIndex = r.OrderIndex
                })
                .ToList();
            
            // Store the rows
            var rowsResult = new QueryResult
            {
                Id = GenerateId(),
                QueryId = queryId,
                ResultType = "sheet_rows",
                EntityId = sheetId,
                JsonData = JsonSerializer.Serialize(rows),
                CreatedAt = ToTimestamp(System.DateTime.UtcNow)
            };
            
            ctx.Db.QueryResult.Insert(rowsResult);
            
            // Get all cells for this sheet
            foreach (var row in ctx.Db.Row.Iter().Where(r => r.SheetId == sheetId))
            {
                var cells = ctx.Db.Cell.Iter()
                    .Where(c => c.RowId == row.Id)
                    .Select(c => new
                    {
                        id = c.Id,
                        columnId = c.ColumnId,
                        value = c.Value,
                        format = c.Format
                    })
                    .ToList();
                
                if (cells.Count > 0)
                {
                    // Store the cells for this row
                    var cellsResult = new QueryResult
                    {
                        Id = GenerateId(),
                        QueryId = queryId,
                        ResultType = "row_cells",
                        EntityId = row.Id, // Use row ID as entity ID
                        JsonData = JsonSerializer.Serialize(cells),
                        CreatedAt = ToTimestamp(System.DateTime.UtcNow)
                    };
                    
                    ctx.Db.QueryResult.Insert(cellsResult);
                }
            }
            
            Log.Info($"Generated all sheet data for sheet {sheetId} with query ID {queryId}");
        }
        catch (Exception ex)
        {
            Log.Error($"Error getting sheet data: {ex.Message}");
        }
    }
}

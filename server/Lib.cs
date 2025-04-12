using SpacetimeDB;
using System.Collections.Generic;
using System.Text.Json;

public static partial class Module
{
    // ************************
    // * ENTITY DEFINITIONS   *
    // ************************

    // User entity
    [Table(Name = "user", Public = true)]
    public partial class User
    {
        [PrimaryKey]
        public string Id;
        public string Email;
        public string Name;
        public long CreatedAt;
        public string PasswordHash; // Hashed, never stored in plain text!
        public bool IsActive;
    }

    // Unit entity - organizational unit
    [Table(Name = "unit", Public = true)]
    public partial class Unit
    {
        [PrimaryKey]
        public string Id;
        public string Name;
        public string Description;
        public long CreatedAt;
        public long UpdatedAt;
    }

    // UnitMember - join table for Users and Units (many-to-many)
    [Table(Name = "unit_member", Public = true)]
    public partial class UnitMember
    {
        [PrimaryKey]
        public string Id;
        public string UnitId;
        public string UserId;
        public string Role; // e.g. "admin", "member", "viewer"
        public long JoinedAt;
    }
    
    // Project entity
    [Table(Name = "project", Public = true)]
    public partial class Project
    {
        [PrimaryKey]
        public string Id;
        public string UnitId; // Projects belong to a unit
        public string Name;
        public string Description;
        public long CreatedAt;
        public long UpdatedAt;
    }

    // Sheet entity
    [Table(Name = "sheet", Public = true)]
    public partial class Sheet
    {
        [PrimaryKey]
        public string Id;
        public string ProjectId; // Sheets belong to a project
        public string Name;
        public string Description;
        public string Type; // e.g. "schedule", "budget", "resources", etc.
        public long CreatedAt;
        public long UpdatedAt;
        public string ColumnsJson; // Store column definitions as JSON
    }
    
    // RowGroup entity - groups of rows in a sheet
    [Table(Name = "row_group", Public = true)]
    public partial class RowGroup
    {
        [PrimaryKey]
        public string Id;
        public string SheetId;
        public string Name;
        public int OrderIndex; // For displaying groups in specific order
        public bool IsExpanded; // UI state - is the group expanded or collapsed
    }
    
    // Row entity
    [Table(Name = "row", Public = true)]
    public partial class Row
    {
        [PrimaryKey]
        public string Id;
        public string SheetId;
        public string GroupId; // Optional - can be empty if not in any group
        public int OrderIndex; // For ordering rows
    }
    
    // Cell entity
    [Table(Name = "cell", Public = true)]
    public partial class Cell
    {
        [PrimaryKey]
        public string Id;
        public string RowId;
        public string ColumnId; // References a column definition (not a separate entity, defined in Sheet)
        public string Value;
        public string Format; // Optional formatting hint
    }
    
    // Enum entity - definitions for dropdown/select fields
    [Table(Name = "enum", Public = true)]
    public partial class Enum
    {
        [PrimaryKey]
        public string Id;
        public string UnitId; // Enums belong to a unit (can be shared across projects)
        public string Name;
        public string Description;
    }
    
    // EnumItem entity - items within an enum
    [Table(Name = "enum_item", Public = true)]
    public partial class EnumItem
    {
        [PrimaryKey]
        public string Id;
        public string EnumId;
        public string Value;
        public string Label;
        public string Color; // Optional - for color coding items
        public int OrderIndex; // For ordering items in the enum
    }

    // Savepoint entity - for versioning/time-travel
    [Table(Name = "savepoint", Public = true)]
    public partial class Savepoint
    {
        [PrimaryKey]
        public string Id;
        public string SheetId;
        public long CreatedAt;
        public string Message;
        public string CreatedByUserId;
        public string TimestampAlias; // Optional user-friendly alias for the savepoint
    }
    
    // Column definition - used in columnsJson
    public class ColumnDefinition
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; } // e.g. "text", "number", "date", "enum", etc.
        public int Width { get; set; }
        public string EnumId { get; set; } // Optional - for enum columns
        public bool IsReadOnly { get; set; }
        public int OrderIndex { get; set; }
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

    // ************************
    // * USER REDUCERS       *
    // ************************

    [Reducer]
    public static void CreateUser(ReducerContext ctx, string email, string name, string password)
    {
        // Check if user already exists
        foreach (var user in ctx.Db.User.Iter())
        {
            if (user.Email.ToLower() == email.ToLower())
            {
                Log.Error($"User with email {email} already exists");
                return;
            }
        }
        
        var id = GenerateId();
        var passwordHash = BCryptNet.HashPassword(password);
        
        var user = new User
        {
            Id = id,
            Email = email,
            Name = name,
            CreatedAt = ToTimestamp(System.DateTime.UtcNow),
            PasswordHash = passwordHash,
            IsActive = true
        };
        
        ctx.Db.User.Insert(user);
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
        var unit = ctx.Db.Unit.FindById(unitId);
        if (unit == null)
        {
            Log.Error($"Unit not found with ID {unitId}");
            return;
        }
        
        var user = ctx.Db.User.FindById(userId);
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
        var project = ctx.Db.Project.FindById(id);
        if (project == null)
        {
            Log.Error($"Project not found with ID {id}");
            return;
        }
        
        var updatedProject = new Project
        {
            Id = id,
            UnitId = project.UnitId,
            Name = name,
            Description = description,
            CreatedAt = project.CreatedAt,
            UpdatedAt = ToTimestamp(System.DateTime.UtcNow)
        };
        
        ctx.Db.Project.Update(id, updatedProject);
        Log.Info($"Updated project {name} with ID {id}");
    }
    
    [Reducer]
    public static void DeleteProject(ReducerContext ctx, string id)
    {
        var project = ctx.Db.Project.FindById(id);
        if (project == null)
        {
            Log.Error($"Project not found with ID {id}");
            return;
        }
        
        // First delete all sheets that belong to this project
        var sheetsToDelete = new List<string>();
        foreach (var sheet in ctx.Db.Sheet.Iter())
        {
            if (sheet.ProjectId == id)
            {
                sheetsToDelete.Add(sheet.Id);
            }
        }
        
        foreach (var sheetId in sheetsToDelete)
        {
            DeleteSheet(ctx, sheetId);
        }
        
        ctx.Db.Project.DeleteById(id);
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
            ColumnsJson = columnsJson
        };
        
        ctx.Db.Sheet.Insert(sheet);
        Log.Info($"Created sheet {name} with ID {id} in project {projectId}");
    }
    
    [Reducer]
    public static void DeleteSheet(ReducerContext ctx, string id)
    {
        var sheet = ctx.Db.Sheet.FindById(id);
        if (sheet == null)
        {
            Log.Error($"Sheet not found with ID {id}");
            return;
        }
        
        // Delete all rows, row groups, and cells associated with this sheet
        var rowsToDelete = new List<string>();
        foreach (var row in ctx.Db.Row.Iter())
        {
            if (row.SheetId == id)
            {
                rowsToDelete.Add(row.Id);
            }
        }
        
        foreach (var rowId in rowsToDelete)
        {
            // Delete all cells in this row
            var cellsToDelete = new List<string>();
            foreach (var cell in ctx.Db.Cell.Iter())
            {
                if (cell.RowId == rowId)
                {
                    cellsToDelete.Add(cell.Id);
                }
            }
            
            foreach (var cellId in cellsToDelete)
            {
                ctx.Db.Cell.DeleteById(cellId);
            }
            
            ctx.Db.Row.DeleteById(rowId);
        }
        
        // Delete all row groups
        var groupsToDelete = new List<string>();
        foreach (var group in ctx.Db.RowGroup.Iter())
        {
            if (group.SheetId == id)
            {
                groupsToDelete.Add(group.Id);
            }
        }
        
        foreach (var groupId in groupsToDelete)
        {
            ctx.Db.RowGroup.DeleteById(groupId);
        }
        
        // Delete all savepoints
        var savepointsToDelete = new List<string>();
        foreach (var savepoint in ctx.Db.Savepoint.Iter())
        {
            if (savepoint.SheetId == id)
            {
                savepointsToDelete.Add(savepoint.Id);
            }
        }
        
        foreach (var savepointId in savepointsToDelete)
        {
            ctx.Db.Savepoint.DeleteById(savepointId);
        }
        
        ctx.Db.Sheet.DeleteById(id);
        Log.Info($"Deleted sheet with ID {id} and all its rows, groups, and cells");
    }
    
    // ************************
    // * ROW REDUCERS        *
    // ************************

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
        // Check if cell already exists
        var existingCellId = "";
        
        foreach (var cell in ctx.Db.Cell.Iter())
        {
            if (cell.RowId == rowId && cell.ColumnId == columnId)
            {
                existingCellId = cell.Id;
                break;
            }
        }
        
        if (!string.IsNullOrEmpty(existingCellId))
        {
            // Update existing cell
            var updatedCell = new Cell
            {
                Id = existingCellId,
                RowId = rowId,
                ColumnId = columnId,
                Value = value,
                Format = format
            };
            
            ctx.Db.Cell.Update(existingCellId, updatedCell);
            Log.Info($"Updated cell {existingCellId} in row {rowId}, column {columnId}");
        }
        else
        {
            // Create new cell
            var newCellId = GenerateId();
            var newCell = new Cell
            {
                Id = newCellId,
                RowId = rowId,
                ColumnId = columnId,
                Value = value,
                Format = format
            };
            
            ctx.Db.Cell.Insert(newCell);
            Log.Info($"Created cell {newCellId} in row {rowId}, column {columnId}");
        }
    }

    // ************************
    // * SAVEPOINT REDUCERS  *
    // ************************

    [Reducer]
    public static void CreateSavepoint(ReducerContext ctx, string sheetId, string message, string userId, string timestampAlias)
    {
        var id = GenerateId();
        var now = ToTimestamp(System.DateTime.UtcNow);
        
        var savepoint = new Savepoint
        {
            Id = id,
            SheetId = sheetId,
            CreatedAt = now,
            Message = message,
            CreatedByUserId = userId,
            TimestampAlias = timestampAlias
        };
        
        ctx.Db.Savepoint.Insert(savepoint);
        Log.Info($"Created savepoint '{message}' with ID {id} for sheet {sheetId}");
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
        Log.Info($"Added item {label} to enum {enumId}");
    }
}

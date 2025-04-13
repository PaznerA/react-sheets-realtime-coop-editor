using SpacetimeDB;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Reflection;
using System.Linq;

// Simple test framework for SpacetimeDB module
public static class TestFramework
{
    // Using a mock context that simulates SpacetimeDB ReducerContext
    public class MockReducerContext
    {
        // Simulated database tables with in-memory collections
        public MockDatabase Db { get; private set; }

        // Constructor initializes empty tables
        public MockReducerContext()
        {
            Db = new MockDatabase();
        }

        // Reset all tables
        public void Reset()
        {
            Db = new MockDatabase();
        }
    }

    // Mock database with all the tables
    public class MockDatabase
    {
        // In-memory collections for each table
        private Dictionary<string, List<object>> Tables = new Dictionary<string, List<object>>();

        // Generic method to get a table
        public MockTable<T> GetTable<T>()
        {
            string tableName = typeof(T).Name;
            if (!Tables.ContainsKey(tableName))
            {
                Tables[tableName] = new List<object>();
            }
            return new MockTable<T>(Tables[tableName]);
        }

        // Properties for each table defined in the module
        public MockTable<Module.User> User => GetTable<Module.User>();
        public MockTable<Module.Unit> Unit => GetTable<Module.Unit>();
        public MockTable<Module.UnitMember> UnitMember => GetTable<Module.UnitMember>();
        public MockTable<Module.Project> Project => GetTable<Module.Project>();
        public MockTable<Module.Sheet> Sheet => GetTable<Module.Sheet>();
        public MockTable<Module.RowGroup> RowGroup => GetTable<Module.RowGroup>();
        public MockTable<Module.Row> Row => GetTable<Module.Row>();
        public MockTable<Module.Cell> Cell => GetTable<Module.Cell>();
        public MockTable<Module.Enum> Enum => GetTable<Module.Enum>();
        public MockTable<Module.EnumItem> EnumItem => GetTable<Module.EnumItem>();
        public MockTable<Module.Savepoint> Savepoint => GetTable<Module.Savepoint>();
        public MockTable<Module.KeyValueEntry> KeyValuePair => GetTable<Module.KeyValueEntry>();
        public MockTable<Module.QueryResult> QueryResult => GetTable<Module.QueryResult>();
    }

    // Generic mock table implementation
    public class MockTable<T>
    {
        private List<object> _items;

        public MockTable(List<object> items)
        {
            _items = items;
        }

        // Insert an item
        public void Insert(T item)
        {
            _items.Add(item);
        }

        // Delete an item
        public void Delete(T item)
        {
            _items.Remove(item);
        }

        // Query the items
        public IEnumerable<T> Iter()
        {
            return _items.Cast<T>();
        }
    }

    // Test runner
    public static void RunTests()
    {
        Console.WriteLine("Running SpacetimeDB module tests...");
        int passed = 0;
        int failed = 0;

        // Create test context
        var ctx = new MockReducerContext();

        // Test user creation
        try
        {
            ctx.Reset();
            TestUserCreation(ctx);
            Console.WriteLine("✅ User creation test passed");
            passed++;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ User creation test failed: {ex.Message}");
            failed++;
        }

        // Test project operations
        try
        {
            ctx.Reset();
            TestProjectOperations(ctx);
            Console.WriteLine("✅ Project operations test passed");
            passed++;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Project operations test failed: {ex.Message}");
            failed++;
        }

        // Test sheet operations
        try
        {
            ctx.Reset();
            TestSheetOperations(ctx);
            Console.WriteLine("✅ Sheet operations test passed");
            passed++;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Sheet operations test failed: {ex.Message}");
            failed++;
        }

        // Print summary
        Console.WriteLine($"\nTest summary: {passed} passed, {failed} failed");
    }

    // Test methods

    private static void TestUserCreation(MockReducerContext ctx)
    {
        // Initial count should be 0
        if (ctx.Db.User.Iter().Count() != 0)
            throw new Exception("Initial user count should be 0");

        // Call the CreateUser reducer
        Module.CreateUser(ctx as ReducerContext, "test@example.com", "Test User", "password123");

        // Verify the user was created
        var users = ctx.Db.User.Iter().ToList();
        if (users.Count != 1)
            throw new Exception($"Expected 1 user, found {users.Count}");

        var user = users.First();
        if (user.Email != "test@example.com" || user.Name != "Test User")
            throw new Exception("User properties don't match expected values");

        // Test duplicate email prevention
        Module.CreateUser(ctx as ReducerContext, "test@example.com", "Another User", "password456");

        // Should still have only 1 user
        if (ctx.Db.User.Iter().Count() != 1)
            throw new Exception("Duplicate email check failed");
    }

    private static void TestProjectOperations(MockReducerContext ctx)
    {
        // Create a user and unit first
        Module.CreateUser(ctx as ReducerContext, "test@example.com", "Test User", "password123");
        var user = ctx.Db.User.Iter().First();

        Module.CreateUnit(ctx as ReducerContext, "Test Unit", "Test Description", user.Id);
        var unit = ctx.Db.Unit.Iter().First();

        // Initial count should be 0
        if (ctx.Db.Project.Iter().Count() != 0)
            throw new Exception("Initial project count should be 0");

        // Create a project
        Module.CreateProject(ctx as ReducerContext, unit.Id, "Test Project", "Project Description");

        // Verify the project was created
        var projects = ctx.Db.Project.Iter().ToList();
        if (projects.Count != 1)
            throw new Exception($"Expected 1 project, found {projects.Count}");

        var project = projects.First();
        if (project.Name != "Test Project" || project.UnitId != unit.Id)
            throw new Exception("Project properties don't match expected values");

        // Update the project
        Module.UpdateProject(ctx as ReducerContext, project.Id, "Updated Project", "New Description");

        // Verify the update
        project = ctx.Db.Project.Iter().First();
        if (project.Name != "Updated Project" || project.Description != "New Description")
            throw new Exception("Project update failed");

        // Delete the project
        Module.DeleteProject(ctx as ReducerContext, project.Id);

        // Verify deletion
        if (ctx.Db.Project.Iter().Any())
            throw new Exception("Project deletion failed");
    }

    private static void TestSheetOperations(MockReducerContext ctx)
    {
        // Create prerequisites
        Module.CreateUser(ctx as ReducerContext, "test@example.com", "Test User", "password123");
        var user = ctx.Db.User.Iter().First();

        Module.CreateUnit(ctx as ReducerContext, "Test Unit", "Test Description", user.Id);
        var unit = ctx.Db.Unit.Iter().First();

        Module.CreateProject(ctx as ReducerContext, unit.Id, "Test Project", "Project Description");
        var project = ctx.Db.Project.Iter().First();

        // Initial sheet count should be 0
        if (ctx.Db.Sheet.Iter().Count() != 0)
            throw new Exception("Initial sheet count should be 0");

        // Create columns for the sheet
        var columns = new List<Module.ColumnDefinition>
        {
            new Module.ColumnDefinition 
            { 
                Id = Guid.NewGuid().ToString(),
                Name = "Text Column",
                Type = "text",
                Width = 100,
                OrderIndex = 0
            },
            new Module.ColumnDefinition 
            { 
                Id = Guid.NewGuid().ToString(),
                Name = "Number Column",
                Type = "number",
                Width = 100,
                OrderIndex = 1
            }
        };

        string columnsJson = JsonSerializer.Serialize(columns);

        // Create a sheet
        Module.CreateSheet(ctx as ReducerContext, project.Id, "Test Sheet", "Sheet Description", "task", columnsJson);

        // Verify the sheet was created
        var sheets = ctx.Db.Sheet.Iter().ToList();
        if (sheets.Count != 1)
            throw new Exception($"Expected 1 sheet, found {sheets.Count}");

        var sheet = sheets.First();
        if (sheet.Name != "Test Sheet" || sheet.ProjectId != project.Id)
            throw new Exception("Sheet properties don't match expected values");

        // Create a row
        Module.CreateRow(ctx as ReducerContext, sheet.Id, "", 0);
        
        // Verify the row was created
        var rows = ctx.Db.Row.Iter().ToList();
        if (rows.Count != 1)
            throw new Exception($"Expected 1 row, found {rows.Count}");
            
        var row = rows.First();
        
        // Add a cell
        Module.UpdateCell(ctx as ReducerContext, row.Id, columns[0].Id, "Test Cell Value", "");
        
        // Verify the cell was created
        var cells = ctx.Db.Cell.Iter().ToList();
        if (cells.Count != 1)
            throw new Exception($"Expected 1 cell, found {cells.Count}");
            
        var cell = cells.First();
        if (cell.Value != "Test Cell Value")
            throw new Exception("Cell value doesn't match expected value");
    }
}

// Entry point class for running tests outside of SpacetimeDB
public class TestRunner
{
    public static void Main()
    {
        TestFramework.RunTests();
    }
}

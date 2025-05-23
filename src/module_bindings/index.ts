// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  CallReducerFlags,
  ConnectionId,
  DbConnectionBuilder,
  DbConnectionImpl,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  Identity,
  ProductType,
  ProductTypeElement,
  ReducerEventContextInterface,
  SubscriptionBuilderImpl,
  SubscriptionEventContextInterface,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";

// Import and reexport all reducer arg types
import { AddEnumItem } from "./add_enum_item_reducer.ts";
export { AddEnumItem };
import { AddUserToUnit } from "./add_user_to_unit_reducer.ts";
export { AddUserToUnit };
import { CreateEnum } from "./create_enum_reducer.ts";
export { CreateEnum };
import { CreateProject } from "./create_project_reducer.ts";
export { CreateProject };
import { CreateRow } from "./create_row_reducer.ts";
export { CreateRow };
import { CreateSavepoint } from "./create_savepoint_reducer.ts";
export { CreateSavepoint };
import { CreateSheet } from "./create_sheet_reducer.ts";
export { CreateSheet };
import { CreateUnit } from "./create_unit_reducer.ts";
export { CreateUnit };
import { CreateUser } from "./create_user_reducer.ts";
export { CreateUser };
import { DeleteEnum } from "./delete_enum_reducer.ts";
export { DeleteEnum };
import { DeleteProject } from "./delete_project_reducer.ts";
export { DeleteProject };
import { DeleteSheet } from "./delete_sheet_reducer.ts";
export { DeleteSheet };
import { UpdateCell } from "./update_cell_reducer.ts";
export { UpdateCell };
import { UpdateProject } from "./update_project_reducer.ts";
export { UpdateProject };
import { UpdateSheet } from "./update_sheet_reducer.ts";
export { UpdateSheet };

// Import and reexport all table handle types
import { CellTableHandle } from "./cell_table.ts";
export { CellTableHandle };
import { EnumTableHandle } from "./enum_table.ts";
export { EnumTableHandle };
import { EnumItemTableHandle } from "./enum_item_table.ts";
export { EnumItemTableHandle };
import { ProjectTableHandle } from "./project_table.ts";
export { ProjectTableHandle };
import { RowTableHandle } from "./row_table.ts";
export { RowTableHandle };
import { RowGroupTableHandle } from "./row_group_table.ts";
export { RowGroupTableHandle };
import { SavepointTableHandle } from "./savepoint_table.ts";
export { SavepointTableHandle };
import { SheetTableHandle } from "./sheet_table.ts";
export { SheetTableHandle };
import { UnitTableHandle } from "./unit_table.ts";
export { UnitTableHandle };
import { UnitMemberTableHandle } from "./unit_member_table.ts";
export { UnitMemberTableHandle };
import { UserTableHandle } from "./user_table.ts";
export { UserTableHandle };

// Import and reexport all types
import { Cell } from "./cell_type.ts";
export { Cell };
import { Enum } from "./enum_type.ts";
export { Enum };
import { EnumItem } from "./enum_item_type.ts";
export { EnumItem };
import { Project } from "./project_type.ts";
export { Project };
import { Row } from "./row_type.ts";
export { Row };
import { RowGroup } from "./row_group_type.ts";
export { RowGroup };
import { Savepoint } from "./savepoint_type.ts";
export { Savepoint };
import { Sheet } from "./sheet_type.ts";
export { Sheet };
import { Unit } from "./unit_type.ts";
export { Unit };
import { UnitMember } from "./unit_member_type.ts";
export { UnitMember };
import { User } from "./user_type.ts";
export { User };

const REMOTE_MODULE = {
  tables: {
    Cell: {
      tableName: "Cell",
      rowType: Cell.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Enum: {
      tableName: "Enum",
      rowType: Enum.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    EnumItem: {
      tableName: "EnumItem",
      rowType: EnumItem.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Project: {
      tableName: "Project",
      rowType: Project.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Row: {
      tableName: "Row",
      rowType: Row.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    RowGroup: {
      tableName: "RowGroup",
      rowType: RowGroup.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Savepoint: {
      tableName: "Savepoint",
      rowType: Savepoint.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Sheet: {
      tableName: "Sheet",
      rowType: Sheet.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    Unit: {
      tableName: "Unit",
      rowType: Unit.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    UnitMember: {
      tableName: "UnitMember",
      rowType: UnitMember.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    User: {
      tableName: "User",
      rowType: User.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
  },
  reducers: {
    AddEnumItem: {
      reducerName: "AddEnumItem",
      argsType: AddEnumItem.getTypeScriptAlgebraicType(),
    },
    AddUserToUnit: {
      reducerName: "AddUserToUnit",
      argsType: AddUserToUnit.getTypeScriptAlgebraicType(),
    },
    CreateEnum: {
      reducerName: "CreateEnum",
      argsType: CreateEnum.getTypeScriptAlgebraicType(),
    },
    CreateProject: {
      reducerName: "CreateProject",
      argsType: CreateProject.getTypeScriptAlgebraicType(),
    },
    CreateRow: {
      reducerName: "CreateRow",
      argsType: CreateRow.getTypeScriptAlgebraicType(),
    },
    CreateSavepoint: {
      reducerName: "CreateSavepoint",
      argsType: CreateSavepoint.getTypeScriptAlgebraicType(),
    },
    CreateSheet: {
      reducerName: "CreateSheet",
      argsType: CreateSheet.getTypeScriptAlgebraicType(),
    },
    CreateUnit: {
      reducerName: "CreateUnit",
      argsType: CreateUnit.getTypeScriptAlgebraicType(),
    },
    CreateUser: {
      reducerName: "CreateUser",
      argsType: CreateUser.getTypeScriptAlgebraicType(),
    },
    DeleteEnum: {
      reducerName: "DeleteEnum",
      argsType: DeleteEnum.getTypeScriptAlgebraicType(),
    },
    DeleteProject: {
      reducerName: "DeleteProject",
      argsType: DeleteProject.getTypeScriptAlgebraicType(),
    },
    DeleteSheet: {
      reducerName: "DeleteSheet",
      argsType: DeleteSheet.getTypeScriptAlgebraicType(),
    },
    UpdateCell: {
      reducerName: "UpdateCell",
      argsType: UpdateCell.getTypeScriptAlgebraicType(),
    },
    UpdateProject: {
      reducerName: "UpdateProject",
      argsType: UpdateProject.getTypeScriptAlgebraicType(),
    },
    UpdateSheet: {
      reducerName: "UpdateSheet",
      argsType: UpdateSheet.getTypeScriptAlgebraicType(),
    },
  },
  // Constructors which are used by the DbConnectionImpl to
  // extract type information from the generated RemoteModule.
  //
  // NOTE: This is not strictly necessary for `eventContextConstructor` because
  // all we do is build a TypeScript object which we could have done inside the
  // SDK, but if in the future we wanted to create a class this would be
  // necessary because classes have methods, so we'll keep it.
  eventContextConstructor: (imp: DbConnectionImpl, event: Event<Reducer>) => {
    return {
      ...(imp as DbConnection),
      event
    }
  },
  dbViewConstructor: (imp: DbConnectionImpl) => {
    return new RemoteTables(imp);
  },
  reducersConstructor: (imp: DbConnectionImpl, setReducerFlags: SetReducerFlags) => {
    return new RemoteReducers(imp, setReducerFlags);
  },
  setReducerFlagsConstructor: () => {
    return new SetReducerFlags();
  }
}

// A type representing all the possible variants of a reducer.
export type Reducer = never
| { name: "AddEnumItem", args: AddEnumItem }
| { name: "AddUserToUnit", args: AddUserToUnit }
| { name: "CreateEnum", args: CreateEnum }
| { name: "CreateProject", args: CreateProject }
| { name: "CreateRow", args: CreateRow }
| { name: "CreateSavepoint", args: CreateSavepoint }
| { name: "CreateSheet", args: CreateSheet }
| { name: "CreateUnit", args: CreateUnit }
| { name: "CreateUser", args: CreateUser }
| { name: "DeleteEnum", args: DeleteEnum }
| { name: "DeleteProject", args: DeleteProject }
| { name: "DeleteSheet", args: DeleteSheet }
| { name: "UpdateCell", args: UpdateCell }
| { name: "UpdateProject", args: UpdateProject }
| { name: "UpdateSheet", args: UpdateSheet }
;

export class RemoteReducers {
  constructor(private connection: DbConnectionImpl, private setCallReducerFlags: SetReducerFlags) {}

  addEnumItem(enumId: string, value: string, label: string, color: string, orderIndex: number) {
    const __args = { enumId, value, label, color, orderIndex };
    let __writer = new BinaryWriter(1024);
    AddEnumItem.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("AddEnumItem", __argsBuffer, this.setCallReducerFlags.addEnumItemFlags);
  }

  onAddEnumItem(callback: (ctx: ReducerEventContext, enumId: string, value: string, label: string, color: string, orderIndex: number) => void) {
    this.connection.onReducer("AddEnumItem", callback);
  }

  removeOnAddEnumItem(callback: (ctx: ReducerEventContext, enumId: string, value: string, label: string, color: string, orderIndex: number) => void) {
    this.connection.offReducer("AddEnumItem", callback);
  }

  addUserToUnit(unitId: string, userId: string, role: string) {
    const __args = { unitId, userId, role };
    let __writer = new BinaryWriter(1024);
    AddUserToUnit.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("AddUserToUnit", __argsBuffer, this.setCallReducerFlags.addUserToUnitFlags);
  }

  onAddUserToUnit(callback: (ctx: ReducerEventContext, unitId: string, userId: string, role: string) => void) {
    this.connection.onReducer("AddUserToUnit", callback);
  }

  removeOnAddUserToUnit(callback: (ctx: ReducerEventContext, unitId: string, userId: string, role: string) => void) {
    this.connection.offReducer("AddUserToUnit", callback);
  }

  createEnum(unitId: string, name: string, description: string) {
    const __args = { unitId, name, description };
    let __writer = new BinaryWriter(1024);
    CreateEnum.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateEnum", __argsBuffer, this.setCallReducerFlags.createEnumFlags);
  }

  onCreateEnum(callback: (ctx: ReducerEventContext, unitId: string, name: string, description: string) => void) {
    this.connection.onReducer("CreateEnum", callback);
  }

  removeOnCreateEnum(callback: (ctx: ReducerEventContext, unitId: string, name: string, description: string) => void) {
    this.connection.offReducer("CreateEnum", callback);
  }

  createProject(unitId: string, name: string, description: string) {
    const __args = { unitId, name, description };
    let __writer = new BinaryWriter(1024);
    CreateProject.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateProject", __argsBuffer, this.setCallReducerFlags.createProjectFlags);
  }

  onCreateProject(callback: (ctx: ReducerEventContext, unitId: string, name: string, description: string) => void) {
    this.connection.onReducer("CreateProject", callback);
  }

  removeOnCreateProject(callback: (ctx: ReducerEventContext, unitId: string, name: string, description: string) => void) {
    this.connection.offReducer("CreateProject", callback);
  }

  createRow(sheetId: string, groupId: string, orderIndex: number) {
    const __args = { sheetId, groupId, orderIndex };
    let __writer = new BinaryWriter(1024);
    CreateRow.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateRow", __argsBuffer, this.setCallReducerFlags.createRowFlags);
  }

  onCreateRow(callback: (ctx: ReducerEventContext, sheetId: string, groupId: string, orderIndex: number) => void) {
    this.connection.onReducer("CreateRow", callback);
  }

  removeOnCreateRow(callback: (ctx: ReducerEventContext, sheetId: string, groupId: string, orderIndex: number) => void) {
    this.connection.offReducer("CreateRow", callback);
  }

  createSavepoint(sheetId: string, message: string, userId: string, timestampAlias: string) {
    const __args = { sheetId, message, userId, timestampAlias };
    let __writer = new BinaryWriter(1024);
    CreateSavepoint.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateSavepoint", __argsBuffer, this.setCallReducerFlags.createSavepointFlags);
  }

  onCreateSavepoint(callback: (ctx: ReducerEventContext, sheetId: string, message: string, userId: string, timestampAlias: string) => void) {
    this.connection.onReducer("CreateSavepoint", callback);
  }

  removeOnCreateSavepoint(callback: (ctx: ReducerEventContext, sheetId: string, message: string, userId: string, timestampAlias: string) => void) {
    this.connection.offReducer("CreateSavepoint", callback);
  }

  createSheet(projectId: string, name: string, description: string, type: string, columnsJson: string) {
    const __args = { projectId, name, description, type, columnsJson };
    let __writer = new BinaryWriter(1024);
    CreateSheet.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateSheet", __argsBuffer, this.setCallReducerFlags.createSheetFlags);
  }

  onCreateSheet(callback: (ctx: ReducerEventContext, projectId: string, name: string, description: string, type: string, columnsJson: string) => void) {
    this.connection.onReducer("CreateSheet", callback);
  }

  removeOnCreateSheet(callback: (ctx: ReducerEventContext, projectId: string, name: string, description: string, type: string, columnsJson: string) => void) {
    this.connection.offReducer("CreateSheet", callback);
  }

  createUnit(name: string, description: string, userId: string) {
    const __args = { name, description, userId };
    let __writer = new BinaryWriter(1024);
    CreateUnit.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateUnit", __argsBuffer, this.setCallReducerFlags.createUnitFlags);
  }

  onCreateUnit(callback: (ctx: ReducerEventContext, name: string, description: string, userId: string) => void) {
    this.connection.onReducer("CreateUnit", callback);
  }

  removeOnCreateUnit(callback: (ctx: ReducerEventContext, name: string, description: string, userId: string) => void) {
    this.connection.offReducer("CreateUnit", callback);
  }

  createUser(email: string, name: string, password: string) {
    const __args = { email, name, password };
    let __writer = new BinaryWriter(1024);
    CreateUser.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("CreateUser", __argsBuffer, this.setCallReducerFlags.createUserFlags);
  }

  onCreateUser(callback: (ctx: ReducerEventContext, email: string, name: string, password: string) => void) {
    this.connection.onReducer("CreateUser", callback);
  }

  removeOnCreateUser(callback: (ctx: ReducerEventContext, email: string, name: string, password: string) => void) {
    this.connection.offReducer("CreateUser", callback);
  }

  deleteEnum(id: string) {
    const __args = { id };
    let __writer = new BinaryWriter(1024);
    DeleteEnum.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("DeleteEnum", __argsBuffer, this.setCallReducerFlags.deleteEnumFlags);
  }

  onDeleteEnum(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.onReducer("DeleteEnum", callback);
  }

  removeOnDeleteEnum(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.offReducer("DeleteEnum", callback);
  }

  deleteProject(id: string) {
    const __args = { id };
    let __writer = new BinaryWriter(1024);
    DeleteProject.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("DeleteProject", __argsBuffer, this.setCallReducerFlags.deleteProjectFlags);
  }

  onDeleteProject(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.onReducer("DeleteProject", callback);
  }

  removeOnDeleteProject(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.offReducer("DeleteProject", callback);
  }

  deleteSheet(id: string) {
    const __args = { id };
    let __writer = new BinaryWriter(1024);
    DeleteSheet.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("DeleteSheet", __argsBuffer, this.setCallReducerFlags.deleteSheetFlags);
  }

  onDeleteSheet(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.onReducer("DeleteSheet", callback);
  }

  removeOnDeleteSheet(callback: (ctx: ReducerEventContext, id: string) => void) {
    this.connection.offReducer("DeleteSheet", callback);
  }

  updateCell(rowId: string, columnId: string, value: string, format: string) {
    const __args = { rowId, columnId, value, format };
    let __writer = new BinaryWriter(1024);
    UpdateCell.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("UpdateCell", __argsBuffer, this.setCallReducerFlags.updateCellFlags);
  }

  onUpdateCell(callback: (ctx: ReducerEventContext, rowId: string, columnId: string, value: string, format: string) => void) {
    this.connection.onReducer("UpdateCell", callback);
  }

  removeOnUpdateCell(callback: (ctx: ReducerEventContext, rowId: string, columnId: string, value: string, format: string) => void) {
    this.connection.offReducer("UpdateCell", callback);
  }

  updateProject(id: string, name: string, description: string) {
    const __args = { id, name, description };
    let __writer = new BinaryWriter(1024);
    UpdateProject.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("UpdateProject", __argsBuffer, this.setCallReducerFlags.updateProjectFlags);
  }

  onUpdateProject(callback: (ctx: ReducerEventContext, id: string, name: string, description: string) => void) {
    this.connection.onReducer("UpdateProject", callback);
  }

  removeOnUpdateProject(callback: (ctx: ReducerEventContext, id: string, name: string, description: string) => void) {
    this.connection.offReducer("UpdateProject", callback);
  }

  updateSheet(id: string, name: string, description: string, type: string, columnsJson: string) {
    const __args = { id, name, description, type, columnsJson };
    let __writer = new BinaryWriter(1024);
    UpdateSheet.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("UpdateSheet", __argsBuffer, this.setCallReducerFlags.updateSheetFlags);
  }

  onUpdateSheet(callback: (ctx: ReducerEventContext, id: string, name: string, description: string, type: string, columnsJson: string) => void) {
    this.connection.onReducer("UpdateSheet", callback);
  }

  removeOnUpdateSheet(callback: (ctx: ReducerEventContext, id: string, name: string, description: string, type: string, columnsJson: string) => void) {
    this.connection.offReducer("UpdateSheet", callback);
  }

}

export class SetReducerFlags {
  addEnumItemFlags: CallReducerFlags = 'FullUpdate';
  addEnumItem(flags: CallReducerFlags) {
    this.addEnumItemFlags = flags;
  }

  addUserToUnitFlags: CallReducerFlags = 'FullUpdate';
  addUserToUnit(flags: CallReducerFlags) {
    this.addUserToUnitFlags = flags;
  }

  createEnumFlags: CallReducerFlags = 'FullUpdate';
  createEnum(flags: CallReducerFlags) {
    this.createEnumFlags = flags;
  }

  createProjectFlags: CallReducerFlags = 'FullUpdate';
  createProject(flags: CallReducerFlags) {
    this.createProjectFlags = flags;
  }

  createRowFlags: CallReducerFlags = 'FullUpdate';
  createRow(flags: CallReducerFlags) {
    this.createRowFlags = flags;
  }

  createSavepointFlags: CallReducerFlags = 'FullUpdate';
  createSavepoint(flags: CallReducerFlags) {
    this.createSavepointFlags = flags;
  }

  createSheetFlags: CallReducerFlags = 'FullUpdate';
  createSheet(flags: CallReducerFlags) {
    this.createSheetFlags = flags;
  }

  createUnitFlags: CallReducerFlags = 'FullUpdate';
  createUnit(flags: CallReducerFlags) {
    this.createUnitFlags = flags;
  }

  createUserFlags: CallReducerFlags = 'FullUpdate';
  createUser(flags: CallReducerFlags) {
    this.createUserFlags = flags;
  }

  deleteEnumFlags: CallReducerFlags = 'FullUpdate';
  deleteEnum(flags: CallReducerFlags) {
    this.deleteEnumFlags = flags;
  }

  deleteProjectFlags: CallReducerFlags = 'FullUpdate';
  deleteProject(flags: CallReducerFlags) {
    this.deleteProjectFlags = flags;
  }

  deleteSheetFlags: CallReducerFlags = 'FullUpdate';
  deleteSheet(flags: CallReducerFlags) {
    this.deleteSheetFlags = flags;
  }

  updateCellFlags: CallReducerFlags = 'FullUpdate';
  updateCell(flags: CallReducerFlags) {
    this.updateCellFlags = flags;
  }

  updateProjectFlags: CallReducerFlags = 'FullUpdate';
  updateProject(flags: CallReducerFlags) {
    this.updateProjectFlags = flags;
  }

  updateSheetFlags: CallReducerFlags = 'FullUpdate';
  updateSheet(flags: CallReducerFlags) {
    this.updateSheetFlags = flags;
  }

}

export class RemoteTables {
  constructor(private connection: DbConnectionImpl) {}

  get cell(): CellTableHandle {
    return new CellTableHandle(this.connection.clientCache.getOrCreateTable<Cell>(REMOTE_MODULE.tables.Cell));
  }

  get enum(): EnumTableHandle {
    return new EnumTableHandle(this.connection.clientCache.getOrCreateTable<Enum>(REMOTE_MODULE.tables.Enum));
  }

  get enumItem(): EnumItemTableHandle {
    return new EnumItemTableHandle(this.connection.clientCache.getOrCreateTable<EnumItem>(REMOTE_MODULE.tables.EnumItem));
  }

  get project(): ProjectTableHandle {
    return new ProjectTableHandle(this.connection.clientCache.getOrCreateTable<Project>(REMOTE_MODULE.tables.Project));
  }

  get row(): RowTableHandle {
    return new RowTableHandle(this.connection.clientCache.getOrCreateTable<Row>(REMOTE_MODULE.tables.Row));
  }

  get rowGroup(): RowGroupTableHandle {
    return new RowGroupTableHandle(this.connection.clientCache.getOrCreateTable<RowGroup>(REMOTE_MODULE.tables.RowGroup));
  }

  get savepoint(): SavepointTableHandle {
    return new SavepointTableHandle(this.connection.clientCache.getOrCreateTable<Savepoint>(REMOTE_MODULE.tables.Savepoint));
  }

  get sheet(): SheetTableHandle {
    return new SheetTableHandle(this.connection.clientCache.getOrCreateTable<Sheet>(REMOTE_MODULE.tables.Sheet));
  }

  get unit(): UnitTableHandle {
    return new UnitTableHandle(this.connection.clientCache.getOrCreateTable<Unit>(REMOTE_MODULE.tables.Unit));
  }

  get unitMember(): UnitMemberTableHandle {
    return new UnitMemberTableHandle(this.connection.clientCache.getOrCreateTable<UnitMember>(REMOTE_MODULE.tables.UnitMember));
  }

  get user(): UserTableHandle {
    return new UserTableHandle(this.connection.clientCache.getOrCreateTable<User>(REMOTE_MODULE.tables.User));
  }
}

export class SubscriptionBuilder extends SubscriptionBuilderImpl<RemoteTables, RemoteReducers, SetReducerFlags> { }

export class DbConnection extends DbConnectionImpl<RemoteTables, RemoteReducers, SetReducerFlags> {
  static builder = (): DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext> => {
    return new DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext>(REMOTE_MODULE, (imp: DbConnectionImpl) => imp as DbConnection);
  }
  subscriptionBuilder = (): SubscriptionBuilder => {
    return new SubscriptionBuilder(this);
  }
}

export type EventContext = EventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type ReducerEventContext = ReducerEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type SubscriptionEventContext = SubscriptionEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
export type ErrorContext = ErrorContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;

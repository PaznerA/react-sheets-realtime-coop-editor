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
import { QueryResult } from "./query_result_type";
import { EventContext, Reducer, RemoteReducers, RemoteTables } from ".";

/**
 * Table handle for the table `QueryResult`.
 *
 * Obtain a handle from the [`queryResult`] property on [`RemoteTables`],
 * like `ctx.db.queryResult`.
 *
 * Users are encouraged not to explicitly reference this type,
 * but to directly chain method calls,
 * like `ctx.db.queryResult.on_insert(...)`.
 */
export class QueryResultTableHandle {
  tableCache: TableCache<QueryResult>;

  constructor(tableCache: TableCache<QueryResult>) {
    this.tableCache = tableCache;
  }

  count(): number {
    return this.tableCache.count();
  }

  iter(): Iterable<QueryResult> {
    return this.tableCache.iter();
  }
  /**
   * Access to the `id` unique index on the table `QueryResult`,
   * which allows point queries on the field of the same name
   * via the [`QueryResultIdUnique.find`] method.
   *
   * Users are encouraged not to explicitly reference this type,
   * but to directly chain method calls,
   * like `ctx.db.queryResult.id().find(...)`.
   *
   * Get a handle on the `id` unique index on the table `QueryResult`.
   */
  id = {
    // Find the subscribed row whose `id` column value is equal to `col_val`,
    // if such a row is present in the client cache.
    find: (col_val: string): QueryResult | undefined => {
      for (let row of this.tableCache.iter()) {
        if (deepEqual(row.id, col_val)) {
          return row;
        }
      }
    },
  };

  onInsert = (cb: (ctx: EventContext, row: QueryResult) => void) => {
    return this.tableCache.onInsert(cb);
  }

  removeOnInsert = (cb: (ctx: EventContext, row: QueryResult) => void) => {
    return this.tableCache.removeOnInsert(cb);
  }

  onDelete = (cb: (ctx: EventContext, row: QueryResult) => void) => {
    return this.tableCache.onDelete(cb);
  }

  removeOnDelete = (cb: (ctx: EventContext, row: QueryResult) => void) => {
    return this.tableCache.removeOnDelete(cb);
  }

  // Updates are only defined for tables with primary keys.
  onUpdate = (cb: (ctx: EventContext, oldRow: QueryResult, newRow: QueryResult) => void) => {
    return this.tableCache.onUpdate(cb);
  }

  removeOnUpdate = (cb: (ctx: EventContext, onRow: QueryResult, newRow: QueryResult) => void) => {
    return this.tableCache.removeOnUpdate(cb);
  }}

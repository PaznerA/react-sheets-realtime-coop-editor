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

export type AddEnumItem = {
  enumId: string,
  value: string,
  label: string,
  color: string,
  orderIndex: number,
};

/**
 * A namespace for generated helper functions.
 */
export namespace AddEnumItem {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("enumId", AlgebraicType.createStringType()),
      new ProductTypeElement("value", AlgebraicType.createStringType()),
      new ProductTypeElement("label", AlgebraicType.createStringType()),
      new ProductTypeElement("color", AlgebraicType.createStringType()),
      new ProductTypeElement("orderIndex", AlgebraicType.createI32Type()),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: AddEnumItem): void {
    AddEnumItem.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): AddEnumItem {
    return AddEnumItem.getTypeScriptAlgebraicType().deserialize(reader);
  }

}


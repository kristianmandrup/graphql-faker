import * as maps from "./maps";
import { Base } from "../../Base";
import {
  createKeyMatcher,
  resolveFromFieldMap,
  funsFor,
  mapsFor
} from "./common";

export class MapResolver extends Base {
  fieldMap: any;
  context: any;
  typeFieldMap: any;
  resolveFromFieldMap: Function;
  functions: any;

  constructor(confName, ctx: any = {}, config: any = {}) {
    super(config);
    const { type, field } = ctx;
    const error = config.error;
    const log = config.log || console.log;
    const typeName = typeof type === "string" ? type : type.name;
    const fieldName = field.name;
    const fieldType = field.type;

    const confMap = mapsFor(confName, maps, config);
    const funs = funsFor(confName, config);

    const typeMap = confMap.typeMap || {};
    this.fieldMap = confMap.fieldMap || {};

    const typeExamples = typeMap[typeName] || {};
    this.typeFieldMap = typeExamples[fieldName];

    const createKeyMatcher = funs.createKeyMatcher || this.createKeyMatcher;
    this.resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;

    this.functions = {
      createKeyMatcher
    };

    this.context = {
      functions: this.functions,
      type,
      field,
      typeName,
      fieldName,
      fieldType,
      config,
      error,
      log
    };
  }

  protected get createKeyMatcher() {
    return createKeyMatcher;
  }

  protected resolveMap(map) {
    if (!map) return;
    return this.resolveFromFieldMap({
      fieldMap: map,
      ...this.context
    });
  }

  resolve() {
    return this.resolveMap(this.typeFieldMap) || this.resolveMap(this.fieldMap);
  }
}

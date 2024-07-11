import z, {
  AnyZodObject,
  ZodArray,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodTuple,
  ZodTypeAny,
  ZodUnion,
} from 'zod'

export const parseFieldsAsArrays = <T extends Record<string, unknown>>(
  obj: T,
  schema: z.ZodTypeAny
): T => {
  // convert all fields to arrays and parse them
  const parsed = schema.parse(
    // eslint-disable-next-line custom-rules/prefer-map-to-object-from-entries
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // Handle adding values to an array using { $each: [value], ...otherModifiers }
        if (typeof value === 'object' && value !== null && '$each' in value)
          return [key, value.$each]
        return [key, [value]]
      })
    )
  )
  // returns only fields parsed in their initial flattened shape
  // eslint-disable-next-line custom-rules/prefer-map-to-object-from-entries
  return Object.fromEntries(
    Object.keys(parsed).map((key: keyof T) => [key, obj[key]])
  ) as T
}

/**
 * We cannot use the instanceof operator because it will always return
 * false when the library is called in a WebPack bundle (but not on tests).
 * https://stackoverflow.com/questions/59265098/instanceof-not-work-correctly-in-typescript-library-project
 * @param obj
 * @param schema
 */
export const isInstanceOfSchema = <T extends ZodTypeAny>(
  obj: ZodTypeAny,
  schema: { new (...args: any): T }
): obj is T => {
  return obj._def.typeName === schema.name
}

// Copied from github.com/colinhacks/zod/blob/6dad90785398885f7b058f5c0760d5ae5476b833/src/types.ts#L2189-L2217
// and extended to support unions and discriminated unions
export const zodDeepPartial = (schema: ZodTypeAny): ZodTypeAny => {
  if (isInstanceOfSchema(schema, ZodObject)) {
    const newShape: any = {}

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key]
      newShape[key] = ZodOptional.create(zodDeepPartial(fieldSchema))
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any
  } else if (isInstanceOfSchema(schema, ZodIntersection)) {
    return ZodIntersection.create(
      zodDeepPartial(schema._def.left),
      zodDeepPartial(schema._def.right)
    )
  } else if (isInstanceOfSchema(schema, ZodUnion)) {
    type Options = [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]
    const options = schema._def.options as Options
    return ZodUnion.create(
      options.map((option) => zodDeepPartial(option)) as Options
    ) as any
  } else if (isInstanceOfSchema(schema, ZodDiscriminatedUnion)) {
    const types = Object.values(schema.options) as (AnyZodObject &
      ZodRawShape)[]
    const discriminator = schema.discriminator
    const newTypeEntries = types.map((type) => {
      const newShape: any = {}

      for (const key in type.shape) {
        const fieldSchema = type.shape[key]
        if (key === discriminator) {
          newShape[key] = fieldSchema
        } else {
          newShape[key] = ZodOptional.create(zodDeepPartial(fieldSchema))
        }
      }
      const newType = new ZodObject({
        ...type._def,
        shape: () => newShape,
      } as any)
      return [type, newType] as const
    })
    const typeMap = new Map<any, any>(newTypeEntries)
    // ZodDiscriminatedUnion uses instanceof indirectly, so we avoid it
    return new ZodDiscriminatedUnion({
      ...schema._def,
      options: Array.from(typeMap.values()),
      // Keep the same map values, but swap the objects
      optionsMap: new Map(
        Array.from(schema.optionsMap.entries(), ([key, oldVal]) => [
          key,
          typeMap.get(oldVal),
        ])
      ),
    })
  } else if (isInstanceOfSchema(schema, ZodArray)) {
    return new ZodArray({
      ...schema._def,
      type: zodDeepPartial(schema.element),
    })
  } else if (isInstanceOfSchema(schema, ZodOptional)) {
    return ZodOptional.create(zodDeepPartial(schema.unwrap()))
  } else if (isInstanceOfSchema(schema, ZodNullable)) {
    return ZodNullable.create(zodDeepPartial(schema.unwrap()))
  } else if (isInstanceOfSchema(schema, ZodTuple<any>)) {
    return ZodTuple.create(
      schema.items.map((item: any) => zodDeepPartial(item))
    )
  } else {
    return schema
  }
}

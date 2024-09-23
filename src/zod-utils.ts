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
 * Merge all objects into a single one. If a property appears on multiple schemas, it
 * will create a ZodUnion with all possible values for that property.
 *
 * This is important because, when dealing with a union of multiple objects where all
 * fields are optional, zod won't be able to differentiate between them in a union, and
 * will end up always choosing the first union item, even if it means stripping some fields.
 * @param schemas
 */
export const mergeObjectSchemas = (schemas: z.ZodTypeAny[]): z.ZodTypeAny => {
  const objects = schemas.filter(
    (schema): schema is z.ZodObject<any> => schema instanceof z.ZodObject
  )
  // It could be a union of a ZodObject and a ZodNumber for example
  const otherTypes = schemas.filter(
    (schema) => !(schema instanceof z.ZodObject)
  )

  // Get all possible ZodTypes for each property
  const mergedTypes = objects
    .flatMap((obj) => Object.entries(obj.shape) as [string, ZodTypeAny][])
    .reduce((acc, [key, value]): Record<string, ZodTypeAny[]> => {
      if (key in acc) return { ...acc, [key]: [...acc[key], value] }
      return { ...acc, [key]: [value] }
    }, {} as Record<string, ZodTypeAny[]>)

  const mergedShape = Object.fromEntries(
    Object.entries(mergedTypes).map(([key, values]) => {
      // This is not 100% because it will only dedupe by reference
      const uniqueValues = Array.from(new Set(values))
      const valueOrUnion =
        uniqueValues.length === 1
          ? uniqueValues[0]
          : ZodUnion.create(
              uniqueValues as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]
            )
      // If the value doesn't appear in all objects, make sure it's optional
      const optionalValue =
        values.length < objects.length
          ? ZodOptional.create(valueOrUnion)
          : valueOrUnion
      return [key, optionalValue]
    })
  )

  const allOptions = [...otherTypes, ZodObject.create(mergedShape)]
  return allOptions.length === 1
    ? allOptions[0]
    : ZodUnion.create(allOptions as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])
}

// Copied from github.com/colinhacks/zod/blob/6dad90785398885f7b058f5c0760d5ae5476b833/src/types.ts#L2189-L2217
// and extended to support unions and discriminated unions
export const zodDeepPartial = (schema: ZodTypeAny): ZodTypeAny => {
  if (schema instanceof ZodObject) {
    const newShape: any = {}

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key]
      newShape[key] = ZodOptional.create(zodDeepPartial(fieldSchema))
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any
  } else if (schema instanceof ZodIntersection) {
    return ZodIntersection.create(
      zodDeepPartial(schema._def.left),
      zodDeepPartial(schema._def.right)
    )
  } else if (schema instanceof ZodUnion) {
    type Options = [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]
    const options = schema._def.options as Options
    const partialOptions = options.map(zodDeepPartial)
    return mergeObjectSchemas(partialOptions)
  } else if (schema instanceof ZodDiscriminatedUnion) {
    const types = Object.values(schema.options) as (AnyZodObject &
      ZodRawShape)[]
    const discriminator = schema.discriminator
    const newTypes = types.map((type) => {
      const newShape: any = {}

      for (const key in type.shape) {
        const fieldSchema = type.shape[key]
        if (key === discriminator) {
          newShape[key] = fieldSchema
        } else {
          newShape[key] = ZodOptional.create(zodDeepPartial(fieldSchema))
        }
      }
      return new ZodObject({
        ...type._def,
        shape: () => newShape,
      } as any)
    }) as any
    return ZodDiscriminatedUnion.create(discriminator, newTypes) as any
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: zodDeepPartial(schema.element),
    })
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(zodDeepPartial(schema.unwrap()))
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(zodDeepPartial(schema.unwrap()))
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(
      schema.items.map((item: any) => zodDeepPartial(item))
    )
  } else {
    return schema
  }
}

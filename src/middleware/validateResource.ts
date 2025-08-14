import type { Request, Response, NextFunction } from 'express';
import { z, type ZodType } from 'zod';

/**
 * Validation schema type for Zod
 * Each property is optional, allowing validation of body, query, and params separately
 */
interface ValidationSchema {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
}

/**
 * Express middleware for validating request data using Zod
 * @param schema - Zod schema with optional body, query, and params
 */
const validate = (schema: ValidationSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate each part asynchronously if the schema is provided
      if (schema.body) await schema.body.parseAsync(req.body);
      if (schema.query) await schema.query.parseAsync(req.query);
      if (schema.params) await schema.params.parseAsync(req.params);

      // Proceed to the next middleware if all validations pass
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
        return;
      }

      // Handle unexpected errors
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export default validate;

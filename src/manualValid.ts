import { ValidationError, validationResult } from 'express-validator'

type FieldError = {
  message: string
  field: string
}
export const customValidationResult = validationResult.withDefaults({
  formatter: (error: any): FieldError => {
    return {
      message: error.msg,
      field: error.param,
    };
  },
});

export const errorFormatter = ({
  msg,
  param,
}: ValidationError) => {
  return {
    message: msg,
    field: param
  }
};
function validateInterviewTest(data) {
  const errors = []

  if (data.field_1 !== undefined && data.field_1 !== null) {
    if (typeof data.field_1 === 'string') {
      try {
        JSON.parse(data.field_1)
      } catch {
        errors.push('field_1 must be valid JSON')
      }
    } else if (typeof data.field_1 !== 'object') {
      errors.push('field_1 must be valid JSON')
    }
  }

  if (data.field_2 !== undefined && data.field_2 !== null) {
    if (!Number.isInteger(Number(data.field_2))) {
      errors.push('field_2 must be a number')
    }
  }

  if (data.field_3 !== undefined && data.field_3 !== null) {
    if (typeof data.field_3 !== 'boolean') {
      errors.push('field_3 must be a boolean')
    }
  }

  return errors
}

module.exports = { validateInterviewTest }
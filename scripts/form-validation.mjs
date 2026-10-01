const requiredFields = {
  name: '이름을 입력해주세요.',
  phone: '연락처를 입력해주세요.',
  region: '희망 지역을 입력해주세요.',
};

export function validateInquiryField(field, value) {
  const message = requiredFields[field];
  if (!message) {
    return undefined;
  }

  return typeof value !== 'string' || value.trim() === '' ? message : undefined;
}

export function validateInquiry(values = {}) {
  const errors = {};

  for (const [field, message] of Object.entries(requiredFields)) {
    if (validateInquiryField(field, values[field])) {
      errors[field] = message;
    }
  }

  return errors;
}

const DATE_KEY_REGEX =
  /(^data|^dt_|_data$|_date$|ingresso|avaliacao|entrevista|desligamento|nascimento|admissao|visita)/i;

const DATE_VALUE_REGEX = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/;

export const normalizeDateForInput = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string") {
    return value;
  }

  if (!DATE_VALUE_REGEX.test(value)) {
    return value;
  }

  return value.slice(0, 10);
};

export const normalizeDatesInPayload = (payload, parentKey = "") => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeDatesInPayload(item, parentKey));
  }

  if (payload && typeof payload === "object") {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        normalizeDatesInPayload(value, key),
      ])
    );
  }

  if (DATE_KEY_REGEX.test(parentKey)) {
    return normalizeDateForInput(payload);
  }

  return payload;
};

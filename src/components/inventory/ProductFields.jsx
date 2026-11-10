import React, { useId } from "react";
import { CATEGORIES } from "../../constants/inventory.js";
import { FIELD_RULES } from "../../utils/productValidation.js";

// PAUTA S2 · Criterios 2 y 6: Tailwind distribuye los campos; las reglas se comparten con la persistencia.
export default function ProductFields({ product = {}, errors = {} }) {
  const prefix = useId();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {Object.entries(FIELD_RULES).map(([name, rule]) => {
        const id = `${prefix}-${name}`;
        const control = {
          id,
          name,
          required: true,
          className: "product-field-control",
          "aria-invalid": Boolean(errors[name]),
          "aria-describedby": errors[name] ? `${id}-error` : undefined,
          defaultValue:
            product[name] ??
            (name === "category"
              ? CATEGORIES[0]
              : rule.numeric
                ? name === "minimum"
                  ? 10
                  : 0
                : ""),
        };
        return (
          <div
            key={name}
            className={`flex flex-col gap-2 text-sm ${["name", "category", "minimum"].includes(name) ? "sm:col-span-2" : ""}`}
          >
            <label htmlFor={id}>{rule.label}</label>
            {name === "category" ? (
              <select {...control}>
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            ) : (
              <input
                {...control}
                type={rule.numeric ? "number" : "text"}
                min={rule.numeric ? 0 : undefined}
                max={rule.numeric ? Number.MAX_SAFE_INTEGER : undefined}
                step={rule.numeric ? 1 : undefined}
                maxLength={rule.maxLength}
              />
            )}
            {errors[name] && (
              <span id={`${id}-error`} className="field-error" role="alert">
                {errors[name]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

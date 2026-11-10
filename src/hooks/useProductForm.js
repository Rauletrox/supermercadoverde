import { useState } from "react";
import { useInventoryActions } from "../context/InventoryContext";
import { ProductValidationError, productFromForm } from "../utils/productForm.js";

// Comportamiento único para ingreso y edición: validar, enfocar el primer error y guardar.
export function useProductForm(product, onSaved) {
  const { addProduct, updateProduct } = useInventoryActions();
  const [errors, setErrors] = useState({});
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const next = productFromForm(new FormData(form), product);
      if (product?.id !== undefined) updateProduct(next);
      else addProduct(next);
      setErrors({});
      onSaved?.();
    } catch (error) {
      if (!(error instanceof ProductValidationError)) throw error;
      setErrors(error.errors);
      form.elements.namedItem(Object.keys(error.errors)[0])?.focus();
    }
  }
  function handleChange(event) {
    const { name } = event.target;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }
  return { errors, handleSubmit, handleChange };
}

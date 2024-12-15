import { computed } from "vue";
import { addPrefixToTailwindClasses } from "../adapters/tailwind";

export function useAdapterClass() {
  const adapterClass = (className: string) => {
    const exportClass = addPrefixToTailwindClasses(className)
    return computed(() => {
      return (exportClass);
    });
  };
  return adapterClass;
}

export const coreProps = {
    modelValue: { type: String },
    items: { type: Array as () => string[], default: ["item1", "item2", "item3"] },
    icons: { type: Array as () => string[], required: false },
    herizontal: { type: Boolean, default: false },
    tooltip: { type: Boolean, default: false }
}
export const uiProps = {
    modelValue: { type: String, required: false },
    activeClass: { type: String, default: "" },
    OnActiveClass: { type: String, default: "" },
    tooltip: { type: Boolean, required: false },
    rtl: { type: Boolean, default: true }
}
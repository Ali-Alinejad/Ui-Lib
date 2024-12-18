# progress
<script setup lang="ts">
import { ref } from 'vue';
const tabs = [
  { label: 'UI', value: 1, content: '' },
  { label: 'Slots', value: 2, content: ''},
  { label: 'Props', value: 3, content: ''},
];
const progressValue = ref(10);
const progressValue2 = ref(60);
</script>


## Default Progress

**Props:**
- `v-model`: Binds the progress value.

**Usage:**
- This is the basic progress bar that adjusts its value dynamically when v-model is updated.
<Tab 
   class="gap-3 border-[1px] rounded-md w-full mx-auto "
    :tabs="tabs" 
    size="sm"
    activeColor="text-blue-500 shadow-blue-500"
  >
<template #content1>
<button :disabled="progressValue === 0"  @click="progressValue >= 10 ? progressValue = progressValue - 10 : progressValue = 0" class="mb-10 size-10 bg-black text-white rounded-lg p-2 mt-1 mr-40" cleaner>-</button>
<button :disabled="progressValue === 100" @click="progressValue <= 90 ? progressValue = progressValue + 10 : progressValue = 100" class="mb-10 size-10 bg-black text-white rounded-lg p-2 mt-1 ml-[390px]" cleaner>+</button>
<Progress v-model="progressValue"/>

</template>

<template #content2>

```vue
<slot name="progress"></slot>
<slot name="progressFill"></slot>
```

</template>
<template #content3>

```vue
<Progress v-model="progressValue"/>
```

</template>
</Tab>


## Progress With Custom Class

**Props:**
- `progressClass`: Customizes the outer progress bar container.
- `progressFillClass`: Customizes the filled portion of the progress bar.

**Usage:**
- This example demonstrates how to customize the progress bar's container and filled section using Tailwind classes.
<Tab 
   class="gap-3 border-[1px] rounded-md w-full mx-auto "
    :tabs="tabs"
    size="sm"
    activeColor="text-blue-500 shadow-blue-500"
  >
<template  #content1>
<Progress v-model="progressValue2" progressClass="ml-40 w-80 bg-emerald-100" progressFillClass="bg-emerald-600"/>

</template>

<template #content2>

```vue
<slot name="progress"></slot>
<slot name="progressFill"></slot>
```

</template>
<template #content3>

```vue
<Progress v-model="progressValue"
progressClass="ml-40 w-80 bg-emerald-100" 
progressFillClass="bg-emerald-600"/>
```

</template>
</Tab>
<script setup>
import { computed } from 'vue';
import { SwitchProps } from './props';
import Core from './Core.vue';
import { switchClasses, toggleClasses,getTranslateValue } from '../../styles/SwitchClasses';
import { useAdapterClass } from '../../composables/UseClass';

const props = defineProps(SwitchProps);
const emit = defineEmits(['update:modelValue']);
const adapter=useAdapterClass();

const switchClass = computed(() => [
  switchClasses.base,
  props.isDisabled ? switchClasses.disabled : switchClasses.pointer,
  switchClasses.flex,
  props.size === 'sm' ? switchClasses.sm : '',
  props.size === 'md' ? switchClasses.md : '',
  props.size === 'lg' ? switchClasses.lg : '',
  props.size === 'xl' ? switchClasses.xl : '',
  props.modelValue ? adapter(props.activeColor).value : adapter(props.inactiveColor).value,
]);

const toggleClass = computed(() => {
  const sizeClass = toggleClasses[props.size] || toggleClasses.sm;
  return [
    toggleClasses.base,
    props.isDisabled ? props.isDisabled : adapter(props.activeColor).value,
    sizeClass,
  ];
});

const getTranslateValueComputed = computed(() => getTranslateValue[props.size] || getTranslateValue.default);

const toggleSwitch = () => {
  if (!props.isDisabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <Core :modelValue="props.modelValue" :isDisabled="props.isDisabled" :defaultChecked="props.defaultChecked" @update:modelValue="emit('update:modelValue', $event)">
    <template #default="{ isActive, toggleSwitch }">
      <div :class="switchClass" @click="toggleSwitch">
        <span :class="[switchClasses.spanSizeLabel1]" v-if="!isActive">{{ props.label1 }}</span>
        <span :class=switchClasses.spanSizeLabel2 v-if="props.label2 && isActive">{{ props.label2 }}</span>
        <span :class="toggleClass" :style="{ transform: isActive ? getTranslateValueComputed :switchClasses.translateX}"></span>
      </div>
    </template>
  </Core>
</template>

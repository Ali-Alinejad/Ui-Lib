<template>
  <div v-if="modelValue" :dir="persianMode ? 'rtl' : 'ltr'">
    <slot name="selectMonth"></slot>
    <slot name="selectYear"></slot>
    <div
      :class="[
        persianMode ? 'iran-font' : '',
        adapterClass(dateRangeClasses.buttonClasses).value,
      ]"
    >
      <Button
        v-if="showSelectYear"
        @click="[(selectYear = !selectYear), (selectMonth = false)]"
        :buttonClass="
          adapterClass(dateRangeClasses.buttonSelect + ' ' + buttonSelectClass)
            .value
        "
        >{{ persianMode ? persianYear : gYear }}</Button
      >
      <Button
        v-if="showSelectMonth"
        @click="[(selectMonth = !selectMonth), (selectYear = false)]"
        :buttonClass="
          adapterClass(dateRangeClasses.buttonSelect + ' ' + buttonSelectClass)
            .value
        "
        >{{
          persianMode
            ? persianMonths[persianMonth - 1]
            : gregorianMonths[gMonth - 1]
        }}</Button
      >
    </div>
    <div
      v-if="selectYear && !selectMonth && showSelectYear"
      :class="
        adapterClass(dateRangeClasses.selectYear + ' ' + selectYearClass).value
      "
      ref="yearContainer"
    >
      <div
        v-for="year in persianMode ? persianYears : gregorainYears"
        :key="year"
        :class="[
          year == persianYear || year == gYear
            ? adapterClass(dateRangeClasses.activeYear + ' ' + activeYearClass)
                .value
            : adapterClass(
                dateRangeClasses.onActiveYear + ' ' + onActiveYearClass
              ).value,
          persianMode == true ? 'iran-font' : '',
        ]"
        @click="changeYear(year)"
      >
        {{ year }}
      </div>
    </div>
    <div
      v-if="selectMonth && !selectYear && showSelectMonth"
      :class="
        adapterClass(dateRangeClasses.selectMonth + ' ' + selectMonthClass)
          .value
      "
    >
      <div
        v-for="(month, index) in persianMode ? persianMonths : gregorianMonths"
        :key="month"
        :class="[
          persianMode ? 'iran-font' : '',
          persianMode == true && index + 1 == persianMonth
            ? adapterClass(
                dateRangeClasses.activeMonth + ' ' + activeMonthClass
              ).value
            : adapterClass(
                dateRangeClasses.onActiveMonth + ' ' + onActiveMonthClass
              ).value,
          persianMode == false && index + 1 == gMonth
            ? adapterClass(
                dateRangeClasses.activeMonth + ' ' + activeMonthClass
              ).value
            : adapterClass(
                dateRangeClasses.onActiveMonth + ' ' + onActiveMonthClass
              ).value,
        ]"
        @click="changeMonth(index)"
      >
        {{ month }}
      </div>
    </div>
    <slot name="calender"></slot>
    <div
      v-if="!selectMonth && !selectYear && showCalender"
      :class="
        adapterClass(dateRangeClasses.calender + ' ' + calenderClass).value
      "
    >
      <div
        :class="[
          adapterClass(dateRangeClasses.dayOfWeek + ' ' + dayOfWeekClass)
            .value,
          persianMode ? 'iran-font' : '',
        ]"
        v-for="day in persianMode ? persianDays : days"
        :key="day"
      >
        {{ day }}
      </div>
      <div
        :class="
          adapterClass(dateRangeClasses.separator + ' ' + separatorClass).value
        "
        v-for="n in persianMode
          ? firtsPersianDay(persianYear, persianMonth, 1)
          : firstGregorianDay(gYear, gMonth)"
        :key="'empty-' + n"
      ></div>

      <div
        v-for="day in persianMode
          ? daysPersianInMonth()
          : daysGregorianInMonth()"
        :key="'day-' + day"
      >
        <label
          @click="changeModelValue(day)"
          @mouseover="hoverHandle(day)"
          :class="[
            persianMode == true
              ? (persianYear == startPDate?.year &&
                  persianMonth == startPDate?.month &&
                  day == startPDate?.day) ||
                (persianYear >= (startPDate?.year ?? 0) &&
                  persianYear <= (endPDate?.year ?? 0) &&
                  dayInRange(day))
                ? adapterClass(
                    dateRangeClasses.activeDay + ' ' + activeDayClass
                  ).value
                : day == pNowDate?.day &&
                  persianMonth == pNowDate?.month &&
                  persianYear == pNowDate?.year &&
                  !dayInRange(day)
                ? adapterClass(adapterClass(dateRangeClasses.onActiveDay + ' ' + dateRangeClasses.nowDay).value + ' ' + nowDayClass)
                    .value
                : adapterClass(
                    dateRangeClasses.onActiveDay + ' ' + onActiveDayClass
                  ).value
              : (gYear == startGDate?.year &&
                  gMonth == startGDate?.month &&
                  day == startGDate?.day) ||
                (gYear >= (startGDate?.year ?? 0) &&
                  gYear <= (endGDate?.year ?? 0) &&
                  dayInRange(day))
              ? adapterClass(dateRangeClasses.activeDay + ' ' + activeDayClass)
                  .value
              : day == gNowDate?.day &&
                gMonth == gNowDate.month &&
                gYear == gNowDate.year &&
                !dayInRange(day)
              ? adapterClass(adapterClass(dateRangeClasses.onActiveDay + ' ' + dateRangeClasses.nowDay).value + ' ' + nowDayClass).value
              : adapterClass(
                  dateRangeClasses.onActiveDay + ' ' + onActiveDayClass
                ).value,
          ]"
          :style="{ fontFamily: persianMode ? 'iransans' : '' }"
        >
          {{ day }}
        </label>
      </div>
    </div>
  </div>
</template>

  
<script setup lang="ts">
import { computed, nextTick, ref, useSlots, watch } from "vue";
import { componentEmits } from "./Emits";
import { coreProps } from "./Props";
import { coreSlots } from "./Slots";
import { dateRangeClasses } from "../../styles/DateRangeClasses";
import { useAdapterClass } from "../../composables/UseClass";
const adapterClass = useAdapterClass();
const props = defineProps(coreProps);
const emit = defineEmits(componentEmits);
const uiSlots = defineSlots<coreSlots>();
const slots = useSlots();
const showSelectMonth = computed(() => !slots.selectMonth);
const showSelectYear = computed(() => !slots.selectYear);
const showCalender = computed(() => !slots.calender);
const persianMonth = ref();
const persianYear = ref();
const gMonth = ref(new Date().getMonth() + 1);
const gYear = ref(new Date().getFullYear());
const startMode = ref(true);
const enableSelect = ref(true);
type dateInterface = {
  year: number;
  month: number;
  day: number;
};
const gNowDate = ref<dateInterface>({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
});
const startGDate = ref<dateInterface | undefined>();
const endGDate = ref<dateInterface | undefined>();
const startPDate = ref<dateInterface | undefined>();
const endPDate = ref<dateInterface | undefined>();
const pNowDate = ref<dateInterface>();
gregorian_to_jalali(
  gNowDate.value.year,
  gNowDate.value.month,
  gNowDate.value.day
);
function gregorian_to_jalali(gy: number, gm: number, gd: number) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  pNowDate.value = { year: jy, month: jm, day: jd };
  persianMonth.value = jm;
  persianYear.value = jy;
}
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      startGDate.value = undefined;
      startPDate.value = undefined;
      endGDate.value = undefined;
      endPDate.value = undefined;
      enableSelect.value = true;
    } else {
      emit("update:startDate", "");
      emit("update:endDate", "");
    }
  }
);
const selectMonth = ref(false);
const selectYear = ref(false);
const days = ["S", "M", "T", "W", "T", "F", "S"];
const persianDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];
const persianYears = Array.from({ length: 100 }, (_, i) => 1340 + i);
const gregorainYears = Array.from({ length: 100 }, (_, i) => 1961 + i);
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const gregorianMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const changeMonth = (month: number) => {
  if (props.persianMode) {
    persianMonth.value = month + 1;
  } else {
    gMonth.value = month + 1;
  }
  selectMonth.value = false;
};
const changeYear = (year: number) => {
  if (props.persianMode) {
    persianYear.value = year;
  } else {
    gYear.value = year;
  }
  selectYear.value = false;
};
const firtsPersianDay = (jy: number, jm: number, jd: number) => {
  var sal_a, gy, gm, gd, days;
  jy += 1595;
  days =
    -355668 +
    365 * jy +
    ~~(jy / 33) * 8 +
    ~~(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * ~~(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  gd = days + 1;
  sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  const firstDay = new Date(gy, gm - 1, gd);
  let fd = firstDay.getDay();
  if (fd < 6) {
    fd += 1;
  } else if (fd == 6) {
    fd = 0;
  }
  return fd;
};
const hoverHandle = (day: number) => {
  if (props.persianMode) {
    if (!startMode.value && enableSelect.value) {
      endPDate.value = {
        year: persianYear.value,
        month: persianMonth.value,
        day: day,
      };
    }
  } else {
    if (!startMode.value && enableSelect.value) {
      endGDate.value = {
        year: gYear.value,
        month: gMonth.value,
        day: day,
      };
    }
  }
};
const changeModelValue = (day: number) => {
  if (props.persianMode) {
    if (startMode.value && enableSelect.value) {
      emit(
        "update:startDate",
        persianYear.value.toString() +
          "-" +
          persianMonth.value.toString() +
          "-" +
          day
      );
      startPDate.value = {
        year: persianYear.value,
        month: persianMonth.value,
        day: day,
      };
      startMode.value = false;
    } else if (!startMode.value && enableSelect.value) {
      emit(
        "update:endDate",
        persianYear.value.toString() +
          "-" +
          persianMonth.value.toString() +
          "-" +
          day
      );
      endPDate.value = {
        year: persianYear.value,
        month: persianMonth.value,
        day: day,
      };
      enableSelect.value = false;
      startMode.value = true;
    }
  } else {
    if (startMode.value && enableSelect.value) {
      emit(
        "update:startDate",
        gYear.value.toString() + "-" + gMonth.value.toString() + "-" + day
      );
      startGDate.value = {
        year: gYear.value,
        month: gMonth.value,
        day: day,
      };
      startMode.value = false;
    } else if (!startMode.value && enableSelect.value) {
      emit(
        "update:endDate",
        gYear.value.toString() + "-" + gMonth.value.toString() + "-" + day
      );
      endGDate.value = {
        year: gYear.value,
        month: gMonth.value,
        day: day,
      };
      enableSelect.value = false;
      startMode.value = true;
    }
  }
};
const dayInRange = (day: number) => {
  if (props.persianMode) {
    if (startPDate.value && endPDate.value) {
      if (startPDate.value.year === endPDate.value.year) {
        if (startPDate.value.month === endPDate.value.month) {
          return day >= startPDate.value.day && day <= endPDate.value.day;
        }
        if (persianMonth.value === startPDate.value.month) {
          return day >= startPDate.value.day;
        } else if (
          persianMonth.value! > startPDate.value.month &&
          persianMonth.value! < endPDate.value.month
        ) {
          return true;
        } else if (persianMonth.value === endPDate.value.month) {
          return day <= endPDate.value.day;
        }
      }
      if (persianYear.value === startPDate.value.year) {
        if (persianMonth.value === startPDate.value.month) {
          return day >= startPDate.value.day;
        }
        if (persianMonth.value! > startPDate.value.month) {
          return true;
        }
      } else if (persianYear.value! === endPDate.value.year) {
        if (persianMonth.value! < endPDate.value.month) {
          return true;
        }
        if (persianMonth.value === endPDate.value.month) {
          return day <= endPDate.value.day;
        }
      }
    }
  } else if (startGDate.value && endGDate.value) {
    if (startGDate.value.year === endGDate.value.year) {
      if (startGDate.value.month === endGDate.value.month) {
        return day >= startGDate.value.day && day <= endGDate.value.day;
      }
      if (gMonth.value === startGDate.value.month) {
        return day >= startGDate.value.day;
      } else if (
        gMonth.value! > startGDate.value.month &&
        gMonth.value! < endGDate.value.month
      ) {
        return true;
      } else if (gMonth.value === endGDate.value.month) {
        return day <= endGDate.value.day;
      }
    }
  }
  return false;
};
const firstGregorianDay = (gy: number, gm: number) => {
  const firstDay = new Date(gy, gm - 1, 1);
  return firstDay.getDay();
};
const daysGregorianInMonth = () => {
  const totalDays = new Date(gYear.value, gMonth.value, 0).getDate();
  return Array.from({ length: totalDays }, (_, i) => i + 1);
};
const daysPersianInMonth = () => {
  if (persianMonth.value < 7) {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  } else if (persianMonth.value < 12) {
    return Array.from({ length: 30 }, (_, i) => i + 1);
  } else if (persianMonth.value == 12) {
    if (persianYear.value % 4 == 3) {
      return Array.from({ length: 30 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 29 }, (_, i) => i + 1);
    }
  }
};
const yearContainer = ref<HTMLElement | null>(null);

watch(selectYear, async (newValue) => {
  if (newValue) {
    await nextTick();

    const container = yearContainer.value as HTMLElement;
    const years = props.persianMode ? persianYears : gregorainYears;
    const selectedYear = props.persianMode ? persianYear.value : gYear.value;

    const selectedYearIndex = years.indexOf(selectedYear);
    if (selectedYearIndex === -1) return;

    container.scrollTop = (1600 * selectedYearIndex) / 100;
  }
});
</script>
<style scoped>
@font-face {
  font-family: iransans;
  src: url("../../assets/IRAN(FaNum).ttf");
}
.iran-font {
  font-family: iransans, sans-serif;
}
</style>
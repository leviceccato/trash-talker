<script setup>
import { ref, computed, onMounted } from 'vue'

import IconRecycle from '@/components/icon-recycle.vue'
import IconGreen from '@/components/icon-green.vue'

const bins = {
    recycle: {
        label: 'Recycle',
        icon: IconRecycle,
    },
    green: {
        label: 'Green',
        icon: IconGreen,
    }
}

const weekNumber = ref(0)
const isReady = ref(false)
const hasTakenOut = ref(false)

const binArr = computed(() => Object.keys(bins))
const activeBin = computed(() => binArr.value[weekNumber.value % 2])
const message = computed(() => `${bins[activeBin.value].label} week`)

const setWeekNumber = () => {
    const currentDate = new Date()
    const startDate = new Date(currentDate.getFullYear(), 0, 1)
    const elapsedDays = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1_000))

    weekNumber.value = Math.ceil((currentDate.getDay() + 1 + elapsedDays) / 7)
}

const setIsReady = () => {
    const now = new Date()
    const isWednesday = now.getDay() === 3
    let readyTime = new Date()
    readyTime.setHours(17)

    isReady.value = isWednesday && (now.getTime() >= readyTime.getTime())
}

const reset = () => {
    if (!isReady.value) return

    isReady.value = false
    hasTakenOut.value = true
    setWeekNumber()
}

onMounted(() => {
    setWeekNumber()
    setIsReady()
    setInterval(() => {
        setWeekNumber()
        setIsReady()
    }, 60_000);
})
</script>

<template>
    <div
        :class="[$style.root, $style[activeBin], { [$style.ready]: isReady && !hasTakenOut }]"
        @click="reset"
    >
        <div :class="$style.container">
            <div :class="$style.indicators">
                <div
                    v-for="bin, name in bins"
                    :key="name"
                    :class="[$style.indicator, $style[name], { [$style.active]: name === activeBin }]"
                >
                    <Component :is="bin.icon" :class="$style.icon" />
                    <div :class="$style.label">
                        {{ bin.label }}
                    </div>
                </div>
            </div>
            <div :class="$style.message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<style>
@import 'modern-normalize';
</style>

<style module>
@keyframes blink {
    0% { opacity: 0; }
    50% { opacity: 0; }
    51% { opacity: 1; }
    100% { opacity: 1; }
}
.root {
    --col-recycle: #bbac41;
    --col-green: #5dc35d;
    --col-black: black;
    --col-white: #ababab;
    min-height: 100vh;
    background-color: var(--col-black);
    color: var(--col-white);
    font-family: 'Satoshi', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    &.ready {
        color: var(--col-black);
        &.recycle {
            background-color: var(--col-recycle);
        }
        &.green {
            background-color: var(--col-green);
        }
        & .indicator {
            color: inherit;
        }
        & .message {
            animation-name: blink;
        }
    }
}
.indicators {
    display: flex;
    gap: 30px;
}
.indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
    font-size: 60px;
    border-radius: 0.6em;
    padding: 0.7em;
    min-width: 210px;
    border: 4px solid currentColor;
    opacity: 0.3;
    &.active {
        opacity: 1;
    }
    &.recycle {
        color: var(--col-recycle);
    }
    &.green {
        color: var(--col-green);
    }
}
.icon {
    width: 1em;
    fill: currentColor;
}
.message {
    margin-top: 30px;
    font-size: 30px;
    text-align: center;
    animation-iteration-count: infinite;
    animation-duration: 1.5s;
}
</style>
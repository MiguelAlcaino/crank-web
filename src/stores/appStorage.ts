import { defineStore } from 'pinia'
import dayjs from 'dayjs'

export const appStore = defineStore({
  id: 'appStore',
  state: () => ({
    calendarStartDate:
      localStorage.getItem('calendarStartDate') !== null
        ? dayjs(localStorage.getItem('calendarStartDate')).toDate()
        : dayjs(Date()).startOf('week').toDate(),
    calendarEndDate:
      localStorage.getItem('calendarEndDate') !== null
        ? dayjs(localStorage.getItem('calendarEndDate')).toDate()
        : dayjs(Date()).endOf('week').toDate()
  }),
  actions: {
    setCalendarDates(calendarStartDate: Date, calendarEndDate: Date) {
      localStorage.setItem('calendarStartDate', dayjs(calendarStartDate).toISOString())
      this.calendarStartDate = calendarStartDate

      localStorage.setItem('calendarEndDate', dayjs(calendarEndDate).toISOString())
      this.calendarEndDate = calendarEndDate
    }
  }
})

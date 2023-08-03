import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { SiteEnum } from '@/gql/graphql'

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
        : dayjs(Date()).endOf('week').toDate(),
    site:
      localStorage.getItem('site') != null
        ? (localStorage.getItem('site') as SiteEnum)
        : SiteEnum.Dubai
  }),
  actions: {
    setCalendarDates(calendarStartDate: Date, calendarEndDate: Date) {
      localStorage.setItem('calendarStartDate', dayjs(calendarStartDate).toISOString())
      this.calendarStartDate = calendarStartDate

      localStorage.setItem('calendarEndDate', dayjs(calendarEndDate).toISOString())
      this.calendarEndDate = calendarEndDate
    },
    setSite(site: SiteEnum) {
      localStorage.setItem('site', site)
    }
  }
})

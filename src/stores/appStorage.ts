import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { SiteEnum } from '@/gql/graphql'
dayjs.Ls.en.weekStart = 1

export const appStore = defineStore({
  id: 'appStore',
  state: () => ({
    calendarStartDate:
      sessionStorage.getItem('calendarStartDate') !== null
        ? dayjs(sessionStorage.getItem('calendarStartDate')).toDate()
        : dayjs(Date()).startOf('week').toDate(),
    calendarEndDate:
      sessionStorage.getItem('calendarEndDate') !== null
        ? dayjs(sessionStorage.getItem('calendarEndDate')).toDate()
        : dayjs(Date()).endOf('week').toDate(),
    site:
      localStorage.getItem('site') != null
        ? (localStorage.getItem('site') as SiteEnum)
        : SiteEnum.Dubai
  }),
  actions: {
    setCalendarDates(calendarStartDate: Date, calendarEndDate: Date) {
      sessionStorage.setItem('calendarStartDate', dayjs(calendarStartDate).toISOString())
      this.calendarStartDate = calendarStartDate

      sessionStorage.setItem('calendarEndDate', dayjs(calendarEndDate).toISOString())
      this.calendarEndDate = calendarEndDate
    },
    setSite(site: SiteEnum) {
      localStorage.setItem('site', site)
      this.site = site
    }
  }
})

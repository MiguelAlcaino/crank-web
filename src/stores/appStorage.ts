import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { SiteEnum } from '@/gql/graphql'
dayjs.Ls.en.weekStart = 1

export const appStore = defineStore({
  id: 'appStore',
  state: () => ({
    calendarStartDate:
      sessionStorage.getItem('calendarStartDate') !== null
        ? sessionStorage.getItem('calendarStartDate')
        : null,
    calendarEndDate:
      sessionStorage.getItem('calendarEndDate') !== null
        ? sessionStorage.getItem('calendarEndDate')
        : null,
    site:
      localStorage.getItem('site') != null
        ? (localStorage.getItem('site') as SiteEnum)
        : SiteEnum.Dubai
  }),
  actions: {
    setCalendarDates(calendarStartDate: string, calendarEndDate: string) {
      sessionStorage.setItem('calendarStartDate', calendarStartDate)
      this.calendarStartDate = calendarStartDate

      sessionStorage.setItem('calendarEndDate', calendarEndDate)
      this.calendarEndDate = calendarEndDate
    },
    setSite(site: SiteEnum) {
      localStorage.setItem('site', site)
      this.site = site
    }
  }
})

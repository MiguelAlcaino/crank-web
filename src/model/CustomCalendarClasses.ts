import type { SiteSetting, Class, Enrollment } from '@/gql/graphql'

export class CustomCalendarClasses {
  siteSettings: SiteSetting
  calendarClasses: Class[]
  enrollmentsWaitlist: Enrollment[]
  enrollmentsUpcoming: Enrollment[]

  constructor(
    siteSettings: SiteSetting,
    calendarClasses: Class[],
    enrollmentsWaitlist: Enrollment[],
    enrollmentsUpcoming: Enrollment[]
  ) {
    this.siteSettings = siteSettings
    this.calendarClasses = calendarClasses
    this.enrollmentsWaitlist = enrollmentsWaitlist
    this.enrollmentsUpcoming = enrollmentsUpcoming
  }
}

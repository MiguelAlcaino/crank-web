import type {Class} from "@/gql/graphql";

export class DayOfTheWeek {
    selected: boolean;
    disabled: boolean;
    day: Date;
    classes: Class[];

    constructor(selected: boolean, disabled: boolean, day: Date, classes: Class[]) {
        this.selected = selected;
        this.disabled = disabled;
        this.day = day;
        this.classes = classes;
    }
}
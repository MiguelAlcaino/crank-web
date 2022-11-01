import type {SpotInfo} from "@/gql/graphql";

export class SpotPosition {
    positionType: string;
    positionIcon: string;
    spotInfo?: SpotInfo;

    constructor(positionType: string, positionIcon: string, spotInfo?: SpotInfo) {
        this.positionType = positionType;
        this.positionIcon = positionIcon;
        this.spotInfo = spotInfo;
    }
}
<script lang="ts">
interface ClassStat {
  adjustedChartPoints: Array<ChartPoint>
  averagePower?: number
  averageRpm?: number
  calories?: number
  chartPoints: Array<ChartPoint>
  classId: string
  className?: string
  distance?: number
  distanceUnit?: string
  duration?: number
  highPower?: number
  highRpm?: number
  instructorName?: string
  spotNumber?: number
  startDateTime: Date
  totalEnergy?: number
}

interface ChartPoint {
  power?: number
  rpm?: number
  time?: number
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { useRoute } from 'vue-router'

import { secondsToMMSS } from '@/utils/utility-functions'
import WorkoutSummaryChart from '@/components/WorkoutSummaryChart.vue'
import StatIconWidget from '@/components/StatIconWidget.vue'
import SpotIconWidget from '@/components/SpotIconWidget.vue'
import RankWidget from '@/components/RankWidget.vue'
import StatSlashWidget from '@/components/StatSlashWidget.vue'

const route = useRoute()

const apiService = inject<ApiService>('gqlApiService')!

const isLoading = ref<boolean>(false)
const classStat = ref<ClassStat | null>(null)
const id = ref<string | null>(null)

onMounted(() => {
  id.value = route.params.id as string
  getWorkoutSummary()
})

async function getWorkoutSummary() {
  isLoading.value = true

  classStat.value = JSON.parse(`{
        "classId": "1935149",
        "className": "Ride",
        "instructorName": "Jon Ashwood",
        "startDateTime": "2022-05-09T18:30:00+00:00",
        "spotNumber": 15,
        "averagePower": 244,
        "highPower": 450,
        "averageRpm": 83,
        "highRpm": 126,
        "totalEnergy": 623,
        "calories": 813.574,
        "distance": 21.8371,
        "distanceUnit": "km",
        "duration": 45,
        "chartPoints": [
          {
            "time": 0,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 5,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 10,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 15,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 20,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 25,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 30,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 35,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 40,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 45,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 50,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 55,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 60,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 65,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 70,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 75,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 80,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 85,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 90,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 95,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 100,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 105,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 110,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 115,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 120,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 125,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 130,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 135,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 140,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 145,
            "rpm": 65,
            "power": 35
          },
          {
            "time": 150,
            "rpm": 68,
            "power": 41
          },
          {
            "time": 155,
            "rpm": 49,
            "power": 45
          },
          {
            "time": 160,
            "rpm": 44,
            "power": 21
          },
          {
            "time": 165,
            "rpm": 59,
            "power": 36
          },
          {
            "time": 170,
            "rpm": 26,
            "power": 32
          },
          {
            "time": 175,
            "rpm": 22,
            "power": 6
          },
          {
            "time": 180,
            "rpm": 85,
            "power": 71
          },
          {
            "time": 185,
            "rpm": 64,
            "power": 221
          },
          {
            "time": 190,
            "rpm": 79,
            "power": 284
          },
          {
            "time": 195,
            "rpm": 77,
            "power": 215
          },
          {
            "time": 200,
            "rpm": 74,
            "power": 325
          },
          {
            "time": 205,
            "rpm": 74,
            "power": 305
          },
          {
            "time": 210,
            "rpm": 74,
            "power": 310
          },
          {
            "time": 215,
            "rpm": 73,
            "power": 309
          },
          {
            "time": 220,
            "rpm": 69,
            "power": 267
          },
          {
            "time": 225,
            "rpm": 69,
            "power": 274
          },
          {
            "time": 230,
            "rpm": 65,
            "power": 279
          },
          {
            "time": 235,
            "rpm": 75,
            "power": 281
          },
          {
            "time": 240,
            "rpm": 65,
            "power": 243
          },
          {
            "time": 245,
            "rpm": 65,
            "power": 245
          },
          {
            "time": 250,
            "rpm": 72,
            "power": 295
          },
          {
            "time": 255,
            "rpm": 66,
            "power": 252
          },
          {
            "time": 260,
            "rpm": 64,
            "power": 308
          },
          {
            "time": 265,
            "rpm": 63,
            "power": 299
          },
          {
            "time": 270,
            "rpm": 63,
            "power": 303
          },
          {
            "time": 275,
            "rpm": 72,
            "power": 235
          },
          {
            "time": 280,
            "rpm": 64,
            "power": 248
          },
          {
            "time": 285,
            "rpm": 64,
            "power": 238
          },
          {
            "time": 290,
            "rpm": 61,
            "power": 217
          },
          {
            "time": 295,
            "rpm": 64,
            "power": 225
          },
          {
            "time": 300,
            "rpm": 83,
            "power": 139
          },
          {
            "time": 305,
            "rpm": 85,
            "power": 171
          },
          {
            "time": 310,
            "rpm": 83,
            "power": 169
          },
          {
            "time": 315,
            "rpm": 104,
            "power": 188
          },
          {
            "time": 320,
            "rpm": 101,
            "power": 238
          },
          {
            "time": 325,
            "rpm": 78,
            "power": 218
          },
          {
            "time": 330,
            "rpm": 70,
            "power": 324
          },
          {
            "time": 335,
            "rpm": 74,
            "power": 301
          },
          {
            "time": 340,
            "rpm": 68,
            "power": 317
          },
          {
            "time": 345,
            "rpm": 93,
            "power": 218
          },
          {
            "time": 350,
            "rpm": 88,
            "power": 260
          },
          {
            "time": 355,
            "rpm": 90,
            "power": 271
          },
          {
            "time": 360,
            "rpm": 88,
            "power": 260
          },
          {
            "time": 365,
            "rpm": 94,
            "power": 245
          },
          {
            "time": 370,
            "rpm": 92,
            "power": 266
          },
          {
            "time": 375,
            "rpm": 102,
            "power": 347
          },
          {
            "time": 380,
            "rpm": 93,
            "power": 273
          },
          {
            "time": 385,
            "rpm": 89,
            "power": 266
          },
          {
            "time": 390,
            "rpm": 76,
            "power": 214
          },
          {
            "time": 395,
            "rpm": 83,
            "power": 233
          },
          {
            "time": 400,
            "rpm": 76,
            "power": 216
          },
          {
            "time": 405,
            "rpm": 90,
            "power": 262
          },
          {
            "time": 410,
            "rpm": 94,
            "power": 250
          },
          {
            "time": 415,
            "rpm": 73,
            "power": 240
          },
          {
            "time": 420,
            "rpm": 67,
            "power": 290
          },
          {
            "time": 425,
            "rpm": 68,
            "power": 286
          },
          {
            "time": 430,
            "rpm": 68,
            "power": 285
          },
          {
            "time": 435,
            "rpm": 63,
            "power": 272
          },
          {
            "time": 440,
            "rpm": 65,
            "power": 266
          },
          {
            "time": 445,
            "rpm": 64,
            "power": 254
          },
          {
            "time": 450,
            "rpm": 60,
            "power": 214
          },
          {
            "time": 455,
            "rpm": 64,
            "power": 249
          },
          {
            "time": 460,
            "rpm": 67,
            "power": 270
          },
          {
            "time": 465,
            "rpm": 67,
            "power": 288
          },
          {
            "time": 470,
            "rpm": 61,
            "power": 248
          },
          {
            "time": 475,
            "rpm": 75,
            "power": 352
          },
          {
            "time": 480,
            "rpm": 72,
            "power": 323
          },
          {
            "time": 485,
            "rpm": 70,
            "power": 322
          },
          {
            "time": 490,
            "rpm": 59,
            "power": 303
          },
          {
            "time": 495,
            "rpm": 62,
            "power": 239
          },
          {
            "time": 500,
            "rpm": 67,
            "power": 284
          },
          {
            "time": 505,
            "rpm": 68,
            "power": 287
          },
          {
            "time": 510,
            "rpm": 66,
            "power": 283
          },
          {
            "time": 515,
            "rpm": 62,
            "power": 244
          },
          {
            "time": 520,
            "rpm": 55,
            "power": 239
          },
          {
            "time": 525,
            "rpm": 58,
            "power": 214
          },
          {
            "time": 530,
            "rpm": 60,
            "power": 239
          },
          {
            "time": 535,
            "rpm": 63,
            "power": 246
          },
          {
            "time": 540,
            "rpm": 84,
            "power": 437
          },
          {
            "time": 545,
            "rpm": 81,
            "power": 409
          },
          {
            "time": 550,
            "rpm": 81,
            "power": 379
          },
          {
            "time": 555,
            "rpm": 79,
            "power": 390
          },
          {
            "time": 560,
            "rpm": 69,
            "power": 334
          },
          {
            "time": 565,
            "rpm": 59,
            "power": 224
          },
          {
            "time": 570,
            "rpm": 70,
            "power": 161
          },
          {
            "time": 575,
            "rpm": 93,
            "power": 235
          },
          {
            "time": 580,
            "rpm": 92,
            "power": 223
          },
          {
            "time": 585,
            "rpm": 91,
            "power": 228
          },
          {
            "time": 590,
            "rpm": 90,
            "power": 226
          },
          {
            "time": 595,
            "rpm": 89,
            "power": 225
          },
          {
            "time": 600,
            "rpm": 86,
            "power": 215
          },
          {
            "time": 605,
            "rpm": 84,
            "power": 199
          },
          {
            "time": 610,
            "rpm": 83,
            "power": 198
          },
          {
            "time": 615,
            "rpm": 97,
            "power": 222
          },
          {
            "time": 620,
            "rpm": 92,
            "power": 234
          },
          {
            "time": 625,
            "rpm": 97,
            "power": 256
          },
          {
            "time": 630,
            "rpm": 94,
            "power": 242
          },
          {
            "time": 635,
            "rpm": 110,
            "power": 312
          },
          {
            "time": 640,
            "rpm": 102,
            "power": 272
          },
          {
            "time": 645,
            "rpm": 101,
            "power": 268
          },
          {
            "time": 650,
            "rpm": 100,
            "power": 264
          },
          {
            "time": 655,
            "rpm": 99,
            "power": 262
          },
          {
            "time": 660,
            "rpm": 97,
            "power": 255
          },
          {
            "time": 665,
            "rpm": 97,
            "power": 255
          },
          {
            "time": 670,
            "rpm": 95,
            "power": 251
          },
          {
            "time": 675,
            "rpm": 91,
            "power": 211
          },
          {
            "time": 680,
            "rpm": 107,
            "power": 265
          },
          {
            "time": 685,
            "rpm": 102,
            "power": 260
          },
          {
            "time": 690,
            "rpm": 98,
            "power": 238
          },
          {
            "time": 695,
            "rpm": 83,
            "power": 152
          },
          {
            "time": 700,
            "rpm": 90,
            "power": 217
          },
          {
            "time": 705,
            "rpm": 89,
            "power": 210
          },
          {
            "time": 710,
            "rpm": 85,
            "power": 180
          },
          {
            "time": 715,
            "rpm": 82,
            "power": 180
          },
          {
            "time": 720,
            "rpm": 79,
            "power": 172
          },
          {
            "time": 725,
            "rpm": 77,
            "power": 158
          },
          {
            "time": 730,
            "rpm": 110,
            "power": 160
          },
          {
            "time": 735,
            "rpm": 111,
            "power": 272
          },
          {
            "time": 740,
            "rpm": 108,
            "power": 267
          },
          {
            "time": 745,
            "rpm": 103,
            "power": 263
          },
          {
            "time": 750,
            "rpm": 100,
            "power": 254
          },
          {
            "time": 755,
            "rpm": 115,
            "power": 248
          },
          {
            "time": 760,
            "rpm": 108,
            "power": 292
          },
          {
            "time": 765,
            "rpm": 82,
            "power": 213
          },
          {
            "time": 770,
            "rpm": 83,
            "power": 179
          },
          {
            "time": 775,
            "rpm": 67,
            "power": 126
          },
          {
            "time": 780,
            "rpm": 63,
            "power": 110
          },
          {
            "time": 785,
            "rpm": 62,
            "power": 111
          },
          {
            "time": 790,
            "rpm": 73,
            "power": 139
          },
          {
            "time": 795,
            "rpm": 75,
            "power": 145
          },
          {
            "time": 800,
            "rpm": 74,
            "power": 146
          },
          {
            "time": 805,
            "rpm": 73,
            "power": 143
          },
          {
            "time": 810,
            "rpm": 85,
            "power": 186
          },
          {
            "time": 815,
            "rpm": 92,
            "power": 222
          },
          {
            "time": 820,
            "rpm": 89,
            "power": 210
          },
          {
            "time": 825,
            "rpm": 108,
            "power": 277
          },
          {
            "time": 830,
            "rpm": 106,
            "power": 270
          },
          {
            "time": 835,
            "rpm": 76,
            "power": 355
          },
          {
            "time": 840,
            "rpm": 74,
            "power": 345
          },
          {
            "time": 845,
            "rpm": 71,
            "power": 318
          },
          {
            "time": 850,
            "rpm": 67,
            "power": 303
          },
          {
            "time": 855,
            "rpm": 66,
            "power": 281
          },
          {
            "time": 860,
            "rpm": 64,
            "power": 272
          },
          {
            "time": 865,
            "rpm": 74,
            "power": 343
          },
          {
            "time": 870,
            "rpm": 71,
            "power": 324
          },
          {
            "time": 875,
            "rpm": 67,
            "power": 294
          },
          {
            "time": 880,
            "rpm": 62,
            "power": 242
          },
          {
            "time": 885,
            "rpm": 64,
            "power": 249
          },
          {
            "time": 890,
            "rpm": 59,
            "power": 212
          },
          {
            "time": 895,
            "rpm": 70,
            "power": 233
          },
          {
            "time": 900,
            "rpm": 90,
            "power": 185
          },
          {
            "time": 905,
            "rpm": 90,
            "power": 229
          },
          {
            "time": 910,
            "rpm": 91,
            "power": 234
          },
          {
            "time": 915,
            "rpm": 89,
            "power": 232
          },
          {
            "time": 920,
            "rpm": 87,
            "power": 220
          },
          {
            "time": 925,
            "rpm": 84,
            "power": 212
          },
          {
            "time": 930,
            "rpm": 84,
            "power": 207
          },
          {
            "time": 935,
            "rpm": 99,
            "power": 244
          },
          {
            "time": 940,
            "rpm": 69,
            "power": 307
          },
          {
            "time": 945,
            "rpm": 68,
            "power": 316
          },
          {
            "time": 950,
            "rpm": 67,
            "power": 319
          },
          {
            "time": 955,
            "rpm": 64,
            "power": 313
          },
          {
            "time": 960,
            "rpm": 64,
            "power": 281
          },
          {
            "time": 965,
            "rpm": 98,
            "power": 166
          },
          {
            "time": 970,
            "rpm": 101,
            "power": 239
          },
          {
            "time": 975,
            "rpm": 119,
            "power": 279
          },
          {
            "time": 980,
            "rpm": 107,
            "power": 276
          },
          {
            "time": 985,
            "rpm": 107,
            "power": 273
          },
          {
            "time": 990,
            "rpm": 99,
            "power": 266
          },
          {
            "time": 995,
            "rpm": 95,
            "power": 234
          },
          {
            "time": 1000,
            "rpm": 91,
            "power": 214
          },
          {
            "time": 1005,
            "rpm": 63,
            "power": 395
          },
          {
            "time": 1010,
            "rpm": 65,
            "power": 196
          },
          {
            "time": 1015,
            "rpm": 78,
            "power": 174
          },
          {
            "time": 1020,
            "rpm": 84,
            "power": 226
          },
          {
            "time": 1025,
            "rpm": 79,
            "power": 207
          },
          {
            "time": 1030,
            "rpm": 78,
            "power": 198
          },
          {
            "time": 1035,
            "rpm": 78,
            "power": 194
          },
          {
            "time": 1040,
            "rpm": 75,
            "power": 185
          },
          {
            "time": 1045,
            "rpm": 70,
            "power": 169
          },
          {
            "time": 1050,
            "rpm": 73,
            "power": 272
          },
          {
            "time": 1055,
            "rpm": 70,
            "power": 364
          },
          {
            "time": 1060,
            "rpm": 69,
            "power": 342
          },
          {
            "time": 1065,
            "rpm": 67,
            "power": 324
          },
          {
            "time": 1070,
            "rpm": 64,
            "power": 296
          },
          {
            "time": 1075,
            "rpm": 69,
            "power": 346
          },
          {
            "time": 1080,
            "rpm": 68,
            "power": 321
          },
          {
            "time": 1085,
            "rpm": 62,
            "power": 270
          },
          {
            "time": 1090,
            "rpm": 63,
            "power": 280
          },
          {
            "time": 1095,
            "rpm": 64,
            "power": 286
          },
          {
            "time": 1100,
            "rpm": 61,
            "power": 276
          },
          {
            "time": 1105,
            "rpm": 61,
            "power": 270
          },
          {
            "time": 1110,
            "rpm": 58,
            "power": 253
          },
          {
            "time": 1115,
            "rpm": 60,
            "power": 246
          },
          {
            "time": 1120,
            "rpm": 65,
            "power": 352
          },
          {
            "time": 1125,
            "rpm": 63,
            "power": 315
          },
          {
            "time": 1130,
            "rpm": 61,
            "power": 95
          },
          {
            "time": 1135,
            "rpm": 99,
            "power": 195
          },
          {
            "time": 1140,
            "rpm": 98,
            "power": 190
          },
          {
            "time": 1145,
            "rpm": 99,
            "power": 233
          },
          {
            "time": 1150,
            "rpm": 96,
            "power": 211
          },
          {
            "time": 1155,
            "rpm": 95,
            "power": 215
          },
          {
            "time": 1160,
            "rpm": 65,
            "power": 291
          },
          {
            "time": 1165,
            "rpm": 63,
            "power": 269
          },
          {
            "time": 1170,
            "rpm": 67,
            "power": 284
          },
          {
            "time": 1175,
            "rpm": 68,
            "power": 310
          },
          {
            "time": 1180,
            "rpm": 63,
            "power": 282
          },
          {
            "time": 1185,
            "rpm": 63,
            "power": 260
          },
          {
            "time": 1190,
            "rpm": 61,
            "power": 259
          },
          {
            "time": 1195,
            "rpm": 60,
            "power": 245
          },
          {
            "time": 1200,
            "rpm": 60,
            "power": 243
          },
          {
            "time": 1205,
            "rpm": 79,
            "power": 251
          },
          {
            "time": 1210,
            "rpm": 78,
            "power": 322
          },
          {
            "time": 1215,
            "rpm": 76,
            "power": 413
          },
          {
            "time": 1220,
            "rpm": 76,
            "power": 406
          },
          {
            "time": 1225,
            "rpm": 72,
            "power": 388
          },
          {
            "time": 1230,
            "rpm": 65,
            "power": 309
          },
          {
            "time": 1235,
            "rpm": 81,
            "power": 151
          },
          {
            "time": 1240,
            "rpm": 99,
            "power": 173
          },
          {
            "time": 1245,
            "rpm": 87,
            "power": 201
          },
          {
            "time": 1250,
            "rpm": 90,
            "power": 196
          },
          {
            "time": 1255,
            "rpm": 88,
            "power": 194
          },
          {
            "time": 1260,
            "rpm": 88,
            "power": 190
          },
          {
            "time": 1265,
            "rpm": 91,
            "power": 165
          },
          {
            "time": 1270,
            "rpm": 99,
            "power": 237
          },
          {
            "time": 1275,
            "rpm": 109,
            "power": 223
          },
          {
            "time": 1280,
            "rpm": 105,
            "power": 261
          },
          {
            "time": 1285,
            "rpm": 118,
            "power": 281
          },
          {
            "time": 1290,
            "rpm": 112,
            "power": 290
          },
          {
            "time": 1295,
            "rpm": 109,
            "power": 272
          },
          {
            "time": 1300,
            "rpm": 110,
            "power": 266
          },
          {
            "time": 1305,
            "rpm": 97,
            "power": 227
          },
          {
            "time": 1310,
            "rpm": 93,
            "power": 208
          },
          {
            "time": 1315,
            "rpm": 113,
            "power": 295
          },
          {
            "time": 1320,
            "rpm": 110,
            "power": 278
          },
          {
            "time": 1325,
            "rpm": 110,
            "power": 267
          },
          {
            "time": 1330,
            "rpm": 111,
            "power": 266
          },
          {
            "time": 1335,
            "rpm": 110,
            "power": 267
          },
          {
            "time": 1340,
            "rpm": 109,
            "power": 267
          },
          {
            "time": 1345,
            "rpm": 102,
            "power": 258
          },
          {
            "time": 1350,
            "rpm": 97,
            "power": 225
          },
          {
            "time": 1355,
            "rpm": 96,
            "power": 209
          },
          {
            "time": 1360,
            "rpm": 93,
            "power": 211
          },
          {
            "time": 1365,
            "rpm": 88,
            "power": 183
          },
          {
            "time": 1370,
            "rpm": 95,
            "power": 208
          },
          {
            "time": 1375,
            "rpm": 92,
            "power": 220
          },
          {
            "time": 1380,
            "rpm": 90,
            "power": 206
          },
          {
            "time": 1385,
            "rpm": 89,
            "power": 197
          },
          {
            "time": 1390,
            "rpm": 88,
            "power": 183
          },
          {
            "time": 1395,
            "rpm": 83,
            "power": 178
          },
          {
            "time": 1400,
            "rpm": 78,
            "power": 160
          },
          {
            "time": 1405,
            "rpm": 122,
            "power": 202
          },
          {
            "time": 1410,
            "rpm": 118,
            "power": 310
          },
          {
            "time": 1415,
            "rpm": 113,
            "power": 292
          },
          {
            "time": 1420,
            "rpm": 110,
            "power": 278
          },
          {
            "time": 1425,
            "rpm": 109,
            "power": 267
          },
          {
            "time": 1430,
            "rpm": 98,
            "power": 231
          },
          {
            "time": 1435,
            "rpm": 125,
            "power": 332
          },
          {
            "time": 1440,
            "rpm": 123,
            "power": 321
          },
          {
            "time": 1445,
            "rpm": 117,
            "power": 301
          },
          {
            "time": 1450,
            "rpm": 117,
            "power": 301
          },
          {
            "time": 1455,
            "rpm": 115,
            "power": 297
          },
          {
            "time": 1460,
            "rpm": 115,
            "power": 287
          },
          {
            "time": 1465,
            "rpm": 91,
            "power": 205
          },
          {
            "time": 1470,
            "rpm": 79,
            "power": 164
          },
          {
            "time": 1475,
            "rpm": 84,
            "power": 121
          },
          {
            "time": 1480,
            "rpm": 83,
            "power": 175
          },
          {
            "time": 1485,
            "rpm": 80,
            "power": 165
          },
          {
            "time": 1490,
            "rpm": 74,
            "power": 143
          },
          {
            "time": 1495,
            "rpm": 81,
            "power": 164
          },
          {
            "time": 1500,
            "rpm": 95,
            "power": 219
          },
          {
            "time": 1505,
            "rpm": 94,
            "power": 214
          },
          {
            "time": 1510,
            "rpm": 107,
            "power": 231
          },
          {
            "time": 1515,
            "rpm": 71,
            "power": 399
          },
          {
            "time": 1520,
            "rpm": 67,
            "power": 315
          },
          {
            "time": 1525,
            "rpm": 66,
            "power": 277
          },
          {
            "time": 1530,
            "rpm": 72,
            "power": 318
          },
          {
            "time": 1535,
            "rpm": 71,
            "power": 322
          },
          {
            "time": 1540,
            "rpm": 68,
            "power": 309
          },
          {
            "time": 1545,
            "rpm": 71,
            "power": 308
          },
          {
            "time": 1550,
            "rpm": 71,
            "power": 326
          },
          {
            "time": 1555,
            "rpm": 71,
            "power": 332
          },
          {
            "time": 1560,
            "rpm": 105,
            "power": 229
          },
          {
            "time": 1565,
            "rpm": 105,
            "power": 277
          },
          {
            "time": 1570,
            "rpm": 100,
            "power": 261
          },
          {
            "time": 1575,
            "rpm": 100,
            "power": 254
          },
          {
            "time": 1580,
            "rpm": 101,
            "power": 254
          },
          {
            "time": 1585,
            "rpm": 100,
            "power": 252
          },
          {
            "time": 1590,
            "rpm": 98,
            "power": 249
          },
          {
            "time": 1595,
            "rpm": 91,
            "power": 228
          },
          {
            "time": 1600,
            "rpm": 90,
            "power": 232
          },
          {
            "time": 1605,
            "rpm": 92,
            "power": 204
          },
          {
            "time": 1610,
            "rpm": 100,
            "power": 215
          },
          {
            "time": 1615,
            "rpm": 97,
            "power": 229
          },
          {
            "time": 1620,
            "rpm": 91,
            "power": 241
          },
          {
            "time": 1625,
            "rpm": 92,
            "power": 229
          },
          {
            "time": 1630,
            "rpm": 89,
            "power": 241
          },
          {
            "time": 1635,
            "rpm": 89,
            "power": 241
          },
          {
            "time": 1640,
            "rpm": 63,
            "power": 307
          },
          {
            "time": 1645,
            "rpm": 66,
            "power": 285
          },
          {
            "time": 1650,
            "rpm": 66,
            "power": 316
          },
          {
            "time": 1655,
            "rpm": 72,
            "power": 289
          },
          {
            "time": 1660,
            "rpm": 70,
            "power": 331
          },
          {
            "time": 1665,
            "rpm": 81,
            "power": 162
          },
          {
            "time": 1670,
            "rpm": 82,
            "power": 220
          },
          {
            "time": 1675,
            "rpm": 91,
            "power": 204
          },
          {
            "time": 1680,
            "rpm": 91,
            "power": 210
          },
          {
            "time": 1685,
            "rpm": 94,
            "power": 248
          },
          {
            "time": 1690,
            "rpm": 91,
            "power": 238
          },
          {
            "time": 1695,
            "rpm": 97,
            "power": 258
          },
          {
            "time": 1700,
            "rpm": 114,
            "power": 339
          },
          {
            "time": 1705,
            "rpm": 84,
            "power": 187
          },
          {
            "time": 1710,
            "rpm": 71,
            "power": 127
          },
          {
            "time": 1715,
            "rpm": 83,
            "power": 129
          },
          {
            "time": 1720,
            "rpm": 83,
            "power": 149
          },
          {
            "time": 1725,
            "rpm": 85,
            "power": 191
          },
          {
            "time": 1730,
            "rpm": 94,
            "power": 226
          },
          {
            "time": 1735,
            "rpm": 91,
            "power": 214
          },
          {
            "time": 1740,
            "rpm": 90,
            "power": 206
          },
          {
            "time": 1745,
            "rpm": 98,
            "power": 241
          },
          {
            "time": 1750,
            "rpm": 105,
            "power": 274
          },
          {
            "time": 1755,
            "rpm": 92,
            "power": 240
          },
          {
            "time": 1760,
            "rpm": 98,
            "power": 235
          },
          {
            "time": 1765,
            "rpm": 96,
            "power": 231
          },
          {
            "time": 1770,
            "rpm": 94,
            "power": 224
          },
          {
            "time": 1775,
            "rpm": 88,
            "power": 207
          },
          {
            "time": 1780,
            "rpm": 80,
            "power": 174
          },
          {
            "time": 1785,
            "rpm": 75,
            "power": 156
          },
          {
            "time": 1790,
            "rpm": 69,
            "power": 131
          },
          {
            "time": 1795,
            "rpm": 75,
            "power": 150
          },
          {
            "time": 1800,
            "rpm": 106,
            "power": 274
          },
          {
            "time": 1805,
            "rpm": 98,
            "power": 237
          },
          {
            "time": 1810,
            "rpm": 97,
            "power": 236
          },
          {
            "time": 1815,
            "rpm": 96,
            "power": 233
          },
          {
            "time": 1820,
            "rpm": 95,
            "power": 228
          },
          {
            "time": 1825,
            "rpm": 92,
            "power": 220
          },
          {
            "time": 1830,
            "rpm": 109,
            "power": 249
          },
          {
            "time": 1835,
            "rpm": 104,
            "power": 261
          },
          {
            "time": 1840,
            "rpm": 101,
            "power": 253
          },
          {
            "time": 1845,
            "rpm": 95,
            "power": 227
          },
          {
            "time": 1850,
            "rpm": 94,
            "power": 219
          },
          {
            "time": 1855,
            "rpm": 95,
            "power": 220
          },
          {
            "time": 1860,
            "rpm": 91,
            "power": 213
          },
          {
            "time": 1865,
            "rpm": 47,
            "power": 145
          },
          {
            "time": 1870,
            "rpm": 77,
            "power": 148
          },
          {
            "time": 1875,
            "rpm": 92,
            "power": 225
          },
          {
            "time": 1880,
            "rpm": 88,
            "power": 202
          },
          {
            "time": 1885,
            "rpm": 91,
            "power": 260
          },
          {
            "time": 1890,
            "rpm": 87,
            "power": 239
          },
          {
            "time": 1895,
            "rpm": 87,
            "power": 243
          },
          {
            "time": 1900,
            "rpm": 84,
            "power": 228
          },
          {
            "time": 1905,
            "rpm": 82,
            "power": 218
          },
          {
            "time": 1910,
            "rpm": 80,
            "power": 212
          },
          {
            "time": 1915,
            "rpm": 77,
            "power": 198
          },
          {
            "time": 1920,
            "rpm": 79,
            "power": 203
          },
          {
            "time": 1925,
            "rpm": 82,
            "power": 213
          },
          {
            "time": 1930,
            "rpm": 67,
            "power": 369
          },
          {
            "time": 1935,
            "rpm": 69,
            "power": 348
          },
          {
            "time": 1940,
            "rpm": 67,
            "power": 338
          },
          {
            "time": 1945,
            "rpm": 64,
            "power": 324
          },
          {
            "time": 1950,
            "rpm": 59,
            "power": 310
          },
          {
            "time": 1955,
            "rpm": 71,
            "power": 343
          },
          {
            "time": 1960,
            "rpm": 66,
            "power": 302
          },
          {
            "time": 1965,
            "rpm": 64,
            "power": 290
          },
          {
            "time": 1970,
            "rpm": 75,
            "power": 230
          },
          {
            "time": 1975,
            "rpm": 76,
            "power": 188
          },
          {
            "time": 1980,
            "rpm": 69,
            "power": 292
          },
          {
            "time": 1985,
            "rpm": 64,
            "power": 263
          },
          {
            "time": 1990,
            "rpm": 66,
            "power": 274
          },
          {
            "time": 1995,
            "rpm": 76,
            "power": 148
          },
          {
            "time": 2000,
            "rpm": 81,
            "power": 188
          },
          {
            "time": 2005,
            "rpm": 82,
            "power": 180
          },
          {
            "time": 2010,
            "rpm": 84,
            "power": 186
          },
          {
            "time": 2015,
            "rpm": 90,
            "power": 216
          },
          {
            "time": 2020,
            "rpm": 87,
            "power": 218
          },
          {
            "time": 2025,
            "rpm": 91,
            "power": 216
          },
          {
            "time": 2030,
            "rpm": 91,
            "power": 237
          },
          {
            "time": 2035,
            "rpm": 85,
            "power": 206
          },
          {
            "time": 2040,
            "rpm": 66,
            "power": 252
          },
          {
            "time": 2045,
            "rpm": 67,
            "power": 278
          },
          {
            "time": 2050,
            "rpm": 69,
            "power": 293
          },
          {
            "time": 2055,
            "rpm": 70,
            "power": 310
          },
          {
            "time": 2060,
            "rpm": 67,
            "power": 295
          },
          {
            "time": 2065,
            "rpm": 98,
            "power": 158
          },
          {
            "time": 2070,
            "rpm": 109,
            "power": 246
          },
          {
            "time": 2075,
            "rpm": 107,
            "power": 287
          },
          {
            "time": 2080,
            "rpm": 99,
            "power": 265
          },
          {
            "time": 2085,
            "rpm": 106,
            "power": 250
          },
          {
            "time": 2090,
            "rpm": 102,
            "power": 266
          },
          {
            "time": 2095,
            "rpm": 93,
            "power": 239
          },
          {
            "time": 2100,
            "rpm": 90,
            "power": 218
          },
          {
            "time": 2105,
            "rpm": 79,
            "power": 171
          },
          {
            "time": 2110,
            "rpm": 81,
            "power": 175
          },
          {
            "time": 2115,
            "rpm": 84,
            "power": 176
          },
          {
            "time": 2120,
            "rpm": 80,
            "power": 180
          },
          {
            "time": 2125,
            "rpm": 80,
            "power": 166
          },
          {
            "time": 2130,
            "rpm": 104,
            "power": 271
          },
          {
            "time": 2135,
            "rpm": 105,
            "power": 286
          },
          {
            "time": 2140,
            "rpm": 104,
            "power": 259
          },
          {
            "time": 2145,
            "rpm": 82,
            "power": 270
          },
          {
            "time": 2150,
            "rpm": 75,
            "power": 354
          },
          {
            "time": 2155,
            "rpm": 73,
            "power": 359
          },
          {
            "time": 2160,
            "rpm": 73,
            "power": 334
          },
          {
            "time": 2165,
            "rpm": 71,
            "power": 308
          },
          {
            "time": 2170,
            "rpm": 78,
            "power": 388
          },
          {
            "time": 2175,
            "rpm": 72,
            "power": 346
          },
          {
            "time": 2180,
            "rpm": 71,
            "power": 332
          },
          {
            "time": 2185,
            "rpm": 72,
            "power": 332
          },
          {
            "time": 2190,
            "rpm": 70,
            "power": 325
          },
          {
            "time": 2195,
            "rpm": 72,
            "power": 308
          },
          {
            "time": 2200,
            "rpm": 69,
            "power": 321
          },
          {
            "time": 2205,
            "rpm": 68,
            "power": 307
          },
          {
            "time": 2210,
            "rpm": 65,
            "power": 279
          },
          {
            "time": 2215,
            "rpm": 70,
            "power": 295
          },
          {
            "time": 2220,
            "rpm": 69,
            "power": 317
          },
          {
            "time": 2225,
            "rpm": 66,
            "power": 291
          },
          {
            "time": 2230,
            "rpm": 85,
            "power": 196
          },
          {
            "time": 2235,
            "rpm": 98,
            "power": 209
          },
          {
            "time": 2240,
            "rpm": 103,
            "power": 239
          },
          {
            "time": 2245,
            "rpm": 95,
            "power": 251
          },
          {
            "time": 2250,
            "rpm": 95,
            "power": 240
          },
          {
            "time": 2255,
            "rpm": 91,
            "power": 230
          },
          {
            "time": 2260,
            "rpm": 88,
            "power": 217
          },
          {
            "time": 2265,
            "rpm": 92,
            "power": 210
          },
          {
            "time": 2270,
            "rpm": 66,
            "power": 259
          },
          {
            "time": 2275,
            "rpm": 66,
            "power": 305
          },
          {
            "time": 2280,
            "rpm": 64,
            "power": 294
          },
          {
            "time": 2285,
            "rpm": 64,
            "power": 286
          },
          {
            "time": 2290,
            "rpm": 58,
            "power": 232
          },
          {
            "time": 2295,
            "rpm": 59,
            "power": 240
          },
          {
            "time": 2300,
            "rpm": 59,
            "power": 250
          },
          {
            "time": 2305,
            "rpm": 58,
            "power": 154
          },
          {
            "time": 2310,
            "rpm": 74,
            "power": 298
          },
          {
            "time": 2315,
            "rpm": 71,
            "power": 355
          },
          {
            "time": 2320,
            "rpm": 71,
            "power": 349
          },
          {
            "time": 2325,
            "rpm": 72,
            "power": 349
          },
          {
            "time": 2330,
            "rpm": 74,
            "power": 356
          },
          {
            "time": 2335,
            "rpm": 71,
            "power": 346
          },
          {
            "time": 2340,
            "rpm": 65,
            "power": 331
          },
          {
            "time": 2345,
            "rpm": 65,
            "power": 291
          },
          {
            "time": 2350,
            "rpm": 89,
            "power": 145
          },
          {
            "time": 2355,
            "rpm": 83,
            "power": 198
          },
          {
            "time": 2360,
            "rpm": 75,
            "power": 172
          },
          {
            "time": 2365,
            "rpm": 72,
            "power": 160
          },
          {
            "time": 2370,
            "rpm": 85,
            "power": 179
          },
          {
            "time": 2375,
            "rpm": 79,
            "power": 194
          },
          {
            "time": 2380,
            "rpm": 75,
            "power": 171
          },
          {
            "time": 2385,
            "rpm": 83,
            "power": 203
          },
          {
            "time": 2390,
            "rpm": 94,
            "power": 207
          },
          {
            "time": 2395,
            "rpm": 91,
            "power": 235
          },
          {
            "time": 2400,
            "rpm": 83,
            "power": 202
          },
          {
            "time": 2405,
            "rpm": 81,
            "power": 193
          },
          {
            "time": 2410,
            "rpm": 79,
            "power": 186
          },
          {
            "time": 2415,
            "rpm": 110,
            "power": 177
          },
          {
            "time": 2420,
            "rpm": 109,
            "power": 303
          },
          {
            "time": 2425,
            "rpm": 105,
            "power": 286
          },
          {
            "time": 2430,
            "rpm": 113,
            "power": 285
          },
          {
            "time": 2435,
            "rpm": 104,
            "power": 289
          },
          {
            "time": 2440,
            "rpm": 98,
            "power": 269
          },
          {
            "time": 2445,
            "rpm": 96,
            "power": 255
          },
          {
            "time": 2450,
            "rpm": 80,
            "power": 183
          },
          {
            "time": 2455,
            "rpm": 106,
            "power": 199
          },
          {
            "time": 2460,
            "rpm": 107,
            "power": 292
          },
          {
            "time": 2465,
            "rpm": 105,
            "power": 269
          },
          {
            "time": 2470,
            "rpm": 116,
            "power": 291
          },
          {
            "time": 2475,
            "rpm": 107,
            "power": 286
          },
          {
            "time": 2480,
            "rpm": 103,
            "power": 274
          },
          {
            "time": 2485,
            "rpm": 102,
            "power": 270
          },
          {
            "time": 2490,
            "rpm": 101,
            "power": 267
          },
          {
            "time": 2495,
            "rpm": 99,
            "power": 257
          },
          {
            "time": 2500,
            "rpm": 95,
            "power": 236
          },
          {
            "time": 2505,
            "rpm": 104,
            "power": 230
          },
          {
            "time": 2510,
            "rpm": 90,
            "power": 271
          },
          {
            "time": 2515,
            "rpm": 87,
            "power": 223
          },
          {
            "time": 2520,
            "rpm": 81,
            "power": 221
          },
          {
            "time": 2525,
            "rpm": 90,
            "power": 214
          },
          {
            "time": 2530,
            "rpm": 71,
            "power": 302
          },
          {
            "time": 2535,
            "rpm": 61,
            "power": 293
          },
          {
            "time": 2540,
            "rpm": 96,
            "power": 178
          },
          {
            "time": 2545,
            "rpm": 101,
            "power": 274
          },
          {
            "time": 2550,
            "rpm": 99,
            "power": 287
          },
          {
            "time": 2555,
            "rpm": 99,
            "power": 254
          },
          {
            "time": 2560,
            "rpm": 92,
            "power": 229
          },
          {
            "time": 2565,
            "rpm": 95,
            "power": 237
          },
          {
            "time": 2570,
            "rpm": 106,
            "power": 309
          },
          {
            "time": 2575,
            "rpm": 110,
            "power": 278
          },
          {
            "time": 2580,
            "rpm": 110,
            "power": 295
          },
          {
            "time": 2585,
            "rpm": 107,
            "power": 286
          },
          {
            "time": 2590,
            "rpm": 106,
            "power": 277
          },
          {
            "time": 2595,
            "rpm": 113,
            "power": 299
          },
          {
            "time": 2600,
            "rpm": 112,
            "power": 305
          },
          {
            "time": 2605,
            "rpm": 111,
            "power": 300
          },
          {
            "time": 2610,
            "rpm": 110,
            "power": 296
          },
          {
            "time": 2615,
            "rpm": 105,
            "power": 273
          },
          {
            "time": 2620,
            "rpm": 110,
            "power": 293
          },
          {
            "time": 2625,
            "rpm": 107,
            "power": 277
          },
          {
            "time": 2630,
            "rpm": 85,
            "power": 177
          },
          {
            "time": 2635,
            "rpm": 79,
            "power": 162
          },
          {
            "time": 2640,
            "rpm": 91,
            "power": 192
          },
          {
            "time": 2645,
            "rpm": 92,
            "power": 199
          },
          {
            "time": 2650,
            "rpm": 86,
            "power": 128
          },
          {
            "time": 2655,
            "rpm": 72,
            "power": 137
          },
          {
            "time": 2660,
            "rpm": 70,
            "power": 116
          },
          {
            "time": 2665,
            "rpm": 68,
            "power": 105
          },
          {
            "time": 2670,
            "rpm": 63,
            "power": 96
          },
          {
            "time": 2675,
            "rpm": 58,
            "power": 56
          },
          {
            "time": 2680,
            "rpm": 75,
            "power": 99
          },
          {
            "time": 2685,
            "rpm": 64,
            "power": 102
          },
          {
            "time": 2690,
            "rpm": 28,
            "power": 33
          },
          {
            "time": 2695,
            "rpm": 33,
            "power": 29
          }
        ],
        "adjustedChartPoints": [
          {
            "time": 0,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 45,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 90,
            "rpm": 0,
            "power": 0
          },
          {
            "time": 135,
            "rpm": 37,
            "power": 24
          },
          {
            "time": 180,
            "rpm": 74,
            "power": 256
          },
          {
            "time": 225,
            "rpm": 67,
            "power": 275
          },
          {
            "time": 270,
            "rpm": 71,
            "power": 216
          },
          {
            "time": 315,
            "rpm": 85,
            "power": 259
          },
          {
            "time": 360,
            "rpm": 88,
            "power": 258
          },
          {
            "time": 405,
            "rpm": 72,
            "power": 267
          },
          {
            "time": 450,
            "rpm": 66,
            "power": 285
          },
          {
            "time": 495,
            "rpm": 62,
            "power": 253
          },
          {
            "time": 540,
            "rpm": 79,
            "power": 310
          },
          {
            "time": 585,
            "rpm": 90,
            "power": 223
          },
          {
            "time": 630,
            "rpm": 99,
            "power": 265
          },
          {
            "time": 675,
            "rpm": 92,
            "power": 213
          },
          {
            "time": 720,
            "rpm": 101,
            "power": 232
          },
          {
            "time": 765,
            "rpm": 72,
            "power": 146
          },
          {
            "time": 810,
            "rpm": 85,
            "power": 276
          },
          {
            "time": 855,
            "rpm": 66,
            "power": 272
          },
          {
            "time": 900,
            "rpm": 87,
            "power": 230
          },
          {
            "time": 945,
            "rpm": 88,
            "power": 274
          },
          {
            "time": 990,
            "rpm": 81,
            "power": 234
          },
          {
            "time": 1035,
            "rpm": 71,
            "power": 277
          },
          {
            "time": 1080,
            "rpm": 62,
            "power": 284
          },
          {
            "time": 1125,
            "rpm": 82,
            "power": 224
          },
          {
            "time": 1170,
            "rpm": 67,
            "power": 273
          },
          {
            "time": 1215,
            "rpm": 82,
            "power": 270
          },
          {
            "time": 1260,
            "rpm": 105,
            "power": 243
          },
          {
            "time": 1305,
            "rpm": 106,
            "power": 259
          },
          {
            "time": 1350,
            "rpm": 92,
            "power": 205
          },
          {
            "time": 1395,
            "rpm": 106,
            "power": 250
          },
          {
            "time": 1440,
            "rpm": 103,
            "power": 241
          },
          {
            "time": 1485,
            "rpm": 82,
            "power": 236
          },
          {
            "time": 1530,
            "rpm": 82,
            "power": 298
          },
          {
            "time": 1575,
            "rpm": 97,
            "power": 235
          },
          {
            "time": 1620,
            "rpm": 78,
            "power": 276
          },
          {
            "time": 1665,
            "rpm": 92,
            "power": 230
          },
          {
            "time": 1710,
            "rpm": 89,
            "power": 195
          },
          {
            "time": 1755,
            "rpm": 85,
            "power": 194
          },
          {
            "time": 1800,
            "rpm": 100,
            "power": 243
          },
          {
            "time": 1845,
            "rpm": 86,
            "power": 207
          },
          {
            "time": 1890,
            "rpm": 81,
            "power": 236
          },
          {
            "time": 1935,
            "rpm": 68,
            "power": 297
          },
          {
            "time": 1980,
            "rpm": 78,
            "power": 218
          },
          {
            "time": 2025,
            "rpm": 78,
            "power": 249
          },
          {
            "time": 2070,
            "rpm": 96,
            "power": 235
          },
          {
            "time": 2115,
            "rpm": 87,
            "power": 258
          },
          {
            "time": 2160,
            "rpm": 72,
            "power": 333
          },
          {
            "time": 2205,
            "rpm": 80,
            "power": 265
          },
          {
            "time": 2250,
            "rpm": 76,
            "power": 253
          },
          {
            "time": 2295,
            "rpm": 68,
            "power": 300
          },
          {
            "time": 2340,
            "rpm": 76,
            "power": 205
          },
          {
            "time": 2385,
            "rpm": 93,
            "power": 221
          },
          {
            "time": 2430,
            "rpm": 103,
            "power": 259
          },
          {
            "time": 2475,
            "rpm": 99,
            "power": 257
          },
          {
            "time": 2520,
            "rpm": 88,
            "power": 250
          },
          {
            "time": 2565,
            "rpm": 108,
            "power": 287
          },
          {
            "time": 2610,
            "rpm": 96,
            "power": 222
          },
          {
            "time": 2655,
            "rpm": 59,
            "power": 86
          }
        ]
      }`) as ClassStat

  isLoading.value = false
}
</script>

<template>
  <div class="row">
    <div class="col-12 text-center">
      <h1>WORKOUT SUMMARY</h1>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12">
      <div class="col-12 text-center">
        <h4>{{ classStat?.className }}</h4>
        <br />
        <p>
          <b>TIME: </b>
          <span>{{ dayjs(classStat?.startDateTime).format('h:mm a') }}</span> |
          <b>DURATION: </b>
          <span>{{ classStat?.duration }}</span> mins.
        </p>
        <p><b>INSTRUCTOR: </b> {{ classStat?.instructorName }}</p>
      </div>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12 text-center">
      <WorkoutSummaryChart :chart-points="classStat?.adjustedChartPoints"></WorkoutSummaryChart>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-sm-6">
      <StatIconWidget
        icon="duration"
        :value="secondsToMMSS(classStat?.duration)"
        title="DURATION"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="distance"
        :value="(classStat?.distance?.toFixed(1) ?? '0') + 'KM'"
        title="DISTANCE"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="calories"
        :value="(classStat?.calories!.toFixed(1) ?? '0')"
        title="CALORIES"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <StatIconWidget
        icon="total_energy"
        :value="(classStat?.totalEnergy!.toFixed(1) ?? '0')"
        title="TOTAL ENERGY"
      ></StatIconWidget>
    </div>
    <div class="col-sm-6">
      <SpotIconWidget
        :class-name="classStat?.className"
        :spot-number="classStat?.spotNumber"
      ></SpotIconWidget>
    </div>
    <div class="col-sm-6">
      <RankWidget :class-id="classStat?.classId"></RankWidget>
    </div>
    <div class="col-sm-6">
      <StatSlashWidget
        title="POWER"
        :avg-value="classStat?.averagePower ?? 0"
        :high-value="classStat?.highPower ?? 0"
      ></StatSlashWidget>
    </div>
    <div class="col-sm-6">
      <StatSlashWidget
        title="RPM"
        :avg-value="classStat?.averageRpm ?? 0"
        :high-value="classStat?.highRpm ?? 0"
      ></StatSlashWidget>
    </div>
  </div>
</template>

<style scoped lang="css">
p {
  font-family: 'BigJohn', sans-serif;
}
h4 {
  color: #737373;
}
</style>

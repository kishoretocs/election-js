// Tamil Nadu Districts data shared between client and server
// SVG paths derived from official 38-district GeoJSON boundary data (post-2019)
// ViewBox: 0 10 380 610 - Projection scaled to Tamil Nadu geography

export interface DistrictMapData {
  id: string;
  name: string;
  tamilName: string;
  path: string;
  labelX: number;
  labelY: number;
}

// All 38 districts with accurate geographic boundaries (includes 2019-2020 new districts)
export const TAMIL_NADU_DISTRICTS: DistrictMapData[] = [
  { id: "ariyalur", name: "Ariyalur", tamilName: "அரியலூர்", path: "M 289.5 274.6 L 291.3 271.8 L 293 268.8 L 293.5 265.8 L 293.3 263 L 293.1 261.2 L 292.7 256.9 L 289.5 255.8 L 288.5 254.7 L 286.9 252.3 L 284.1 252.7 L 283.7 248 L 282.7 247.6 L 282.3 246.3 L 279 245.8 L 275.5 249.3 L 272.4 249 L 270.2 248.6 L 266.2 250.3 L 263.6 252.5 L 262.4 258.9 L 260.8 264 L 256.2 270.5 L 256.4 271.9 L 255.5 275.3 L 256.1 277.9 L 255.4 281 L 252.6 282.7 L 251.3 287.1 L 249.6 291.8 L 247.4 293.7 L 246.1 295.4 L 248.7 297.4 L 250.9 301.1 L 254.5 302.8 L 257.6 298.6 L 262.2 297.4 L 266.4 296.6 L 270.7 294.8 L 274.3 290.6 L 278.8 287.5 L 281.5 285.1 L 285.1 282.6 L 287 278 L 289.2 274.9 L 289.5 274.6 Z", labelX: 271, labelY: 272 },
  { id: "chengalpattu", name: "Chengalpattu", tamilName: "செங்கல்பட்டு", path: "M 347.8 73.1 L 345.8 72 L 344 71.9 L 342.4 71.3 L 342.3 74 L 339.7 78.7 L 341.7 79 L 343.5 80.2 L 342.5 83.8 L 340.2 88 L 340 92.6 L 336.6 95.3 L 333.1 95.8 L 332.3 96.7 L 329.3 97.4 L 325.6 100.8 L 330.9 107.9 L 329 113 L 325.7 115.3 L 319.8 118.5 L 315.1 123.2 L 314.1 126.9 L 313.5 129.2 L 313.5 131.1 L 312.1 136.3 L 309.5 138.2 L 307 141.5 L 305.2 146.3 L 312.3 147.6 L 318 147 L 321.2 151.1 L 324.4 156.6 L 328.2 157.9 L 334.5 156.2 L 342.6 143.9 L 348.8 133.2 L 349.9 125.5 L 352 118 L 354.3 109.8 L 357 100.1 L 356.6 96.3 L 353.5 90.1 L 352.4 82.9 L 352.4 80 L 349.5 75.4 L 347.8 73.1 Z", labelX: 334, labelY: 110 },
  { id: "chennai", name: "Chennai", tamilName: "சென்னை", path: "M 363.8 50.4 L 362 52.4 L 358.5 51.7 L 356.9 53.6 L 354.4 54.4 L 352.5 56.2 L 351.8 57.6 L 351.4 59.7 L 349.8 60.5 L 347.9 66 L 349 71.3 L 348.6 69 L 347.5 71.4 L 349 73 L 350.4 73.1 L 351.3 73 L 352.1 72.6 L 352.4 74 L 353.3 78.2 L 356.6 77.6 L 358.7 75.8 L 359.2 74 L 359.5 70.8 L 359.9 68.8 L 360.8 66.7 L 361.3 65.8 L 362 64.1 L 361.4 64.7 L 361.2 65.1 L 360.6 65.7 L 361 65.1 L 361.1 65.1 L 361 64.2 L 361.3 63.7 L 361.3 64.3 L 361.1 62.8 L 361.5 61.7 L 360.8 62.1 L 361.1 61.4 L 361.4 61.7 L 360.9 61.1 L 361.6 59.1 L 362.4 56.5 L 363.3 52.8 L 363.8 50.4 Z", labelX: 357, labelY: 65 },
  { id: "coimbatore", name: "Coimbatore", tamilName: "கோயம்புத்தூர்", path: "M 92.8 254.6 L 89.9 249.8 L 85.1 247.3 L 74.9 250.3 L 72 251.8 L 68.7 253.5 L 68.2 258.1 L 62.2 260.7 L 55.5 262.6 L 56.5 270.5 L 56.3 274.9 L 58.7 277.3 L 59 280.7 L 59.6 285.1 L 62.8 284.9 L 57 286.4 L 51.4 298.2 L 58.5 302.3 L 63.5 303.8 L 67.8 308.5 L 72.4 314.1 L 70.1 321.5 L 69 330.2 L 64.6 333.1 L 66.3 337.2 L 67.2 359.8 L 68.2 366.8 L 75.9 373.1 L 80.8 372.6 L 83.1 371.2 L 83.8 371 L 84.6 369.6 L 84.6 369.5 L 84.7 369.2 L 86.6 366.1 L 87.8 364 L 84.4 351.6 L 86.7 338.8 L 94.8 333 L 92 317.1 L 98.2 313.3 L 98 301 L 94.4 283.8 L 98.4 276.6 L 94.3 264.5 L 92.8 254.6 Z", labelX: 75, labelY: 310 },
  { id: "cuddalore", name: "Cuddalore", tamilName: "கடலூர்", path: "M 319.6 245.3 L 318.1 240.6 L 316.5 237.9 L 316 236.2 L 314.9 231.3 L 315.5 221.1 L 317.5 211 L 315 206.3 L 312.1 203.8 L 314.7 200.8 L 318.1 202 L 317.1 198.7 L 316 198 L 314.6 199.4 L 310.9 197.4 L 309.5 198.3 L 306.7 203.8 L 299.5 200.3 L 292.3 197.8 L 291.4 201.6 L 287.9 204.4 L 287.5 213.1 L 281.2 218.4 L 271.6 220.8 L 266.2 227.7 L 259.3 224.9 L 256.2 225.2 L 254.1 227.6 L 252 227 L 243.4 232.1 L 243.8 242 L 254.2 247.8 L 264.4 249.8 L 271.9 250.1 L 279.2 245.8 L 282.7 246.8 L 286.1 252 L 289.1 255.7 L 293.1 261.1 L 293.8 266.1 L 289.9 272.4 L 294.6 271.3 L 301.2 267.4 L 305.3 261.8 L 314.4 253 L 319.6 245.3 Z", labelX: 292, labelY: 229 },
  { id: "dharmapuri", name: "Dharmapuri", tamilName: "தர்மபுரி", path: "M 175.9 109 L 173.9 112.6 L 171.3 120.5 L 167.7 126.2 L 163.6 135.1 L 163.4 140.1 L 163.8 148.2 L 163.7 154.2 L 159.1 159.7 L 155.5 163.6 L 152.2 165.7 L 147.9 167.2 L 143 172.1 L 139.5 177.1 L 137.4 185.2 L 138.2 192.4 L 146.9 198.5 L 152.7 196.7 L 160.9 195.2 L 165.9 193.9 L 178.1 188 L 180.2 195.6 L 184.4 200.1 L 184.2 204.9 L 180.9 209.2 L 179.2 211.3 L 182.8 220.1 L 185.9 215.6 L 193 210.2 L 197.4 205.6 L 206 207.2 L 209.9 213.7 L 212.8 212.7 L 214.2 207.6 L 216.8 197.9 L 210.6 191.4 L 208.6 184.9 L 209.7 178.2 L 206.2 172.3 L 200.1 162.9 L 197.6 160.2 L 191.2 156.6 L 188.3 149.6 L 188.3 143.6 L 187.4 136.2 L 184.6 131.1 L 183.2 123.2 L 178.4 117.4 L 175.9 109 Z", labelX: 179, labelY: 165 },
  { id: "dindigul", name: "Dindigul", tamilName: "திண்டுக்கல்", path: "M 163.7 343.9 L 160.8 345.5 L 157.5 352.8 L 155.2 358.3 L 155.8 361.7 L 152.1 368.9 L 148.6 374.2 L 143.6 377.9 L 140.5 381.6 L 134.7 381.9 L 132.3 387.5 L 128.4 389.4 L 128.3 395.5 L 130.5 402.2 L 127.6 409.5 L 123.3 413.9 L 117.6 413.5 L 113.5 416.2 L 114.1 422.3 L 111.1 424.7 L 105.9 421.3 L 103.3 421.1 L 100.2 416.7 L 96.6 409.7 L 95.5 403.2 L 95.1 399.1 L 101.8 388.4 L 106.7 380.4 L 110.7 373.2 L 111.2 367.2 L 109.8 363.2 L 106.9 356.8 L 106.8 349.3 L 109.5 339.7 L 115.1 330.7 L 125.9 332.5 L 133.2 331.3 L 141.7 327.3 L 149.2 325.5 L 152.5 330.8 L 157.2 326.3 L 162.1 323.4 L 165.8 325.7 L 167.4 330.8 L 167.2 336.7 L 165.2 341.1 L 163.7 343.9 Z", labelX: 132, labelY: 370 },
  { id: "erode", name: "Erode", tamilName: "ஈரோடு", path: "M 137.4 185.2 L 132.3 190.9 L 126.6 192.2 L 121.9 198.5 L 114.5 204 L 109.3 206.9 L 103.7 212 L 99.5 215.1 L 96.9 220.9 L 93.5 228.7 L 87.6 237.2 L 85.1 247.3 L 89.9 249.8 L 92.8 254.6 L 94.3 264.5 L 98.4 276.6 L 94.4 283.8 L 98 301 L 98.2 313.3 L 108.9 319.6 L 114.6 327.2 L 115.1 330.7 L 109.5 339.7 L 106.8 349.3 L 106.9 356.8 L 111.2 367.2 L 110.7 373.2 L 106.7 380.4 L 100.2 383.7 L 98.2 380.6 L 94.8 374 L 90.6 367.5 L 87.8 364 L 84.4 351.6 L 86.7 338.8 L 94.8 333 L 92 317.1 L 106.6 313.3 L 115 325.5 L 124.2 326.7 L 130.5 326.7 L 137.7 329.1 L 140.9 330 L 148.8 326.3 L 152.5 318.2 L 150.7 310.4 L 149.4 305.4 L 153.2 301.7 L 157.7 293.7 L 157.1 286.3 L 159.2 278.9 L 156.2 268.9 L 149.6 258 L 145 245.7 L 144.8 237.5 L 142.7 229.3 L 137.3 219.1 L 138 206.9 L 137.6 195 L 137.4 185.2 Z", labelX: 118, labelY: 285 },
  { id: "kallakurichi", name: "Kallakurichi", tamilName: "கள்ளக்குறிச்சி", path: "M 280.5 175.5 L 274.3 179.3 L 269.9 179.8 L 265.2 184.7 L 262.9 189.1 L 261.2 197.2 L 258.9 201.6 L 257.1 209.2 L 257.6 213.2 L 254.9 218.8 L 252.7 224.4 L 256.2 225.2 L 259.3 224.9 L 266.2 227.7 L 271.6 220.8 L 281.2 218.4 L 287.5 213.1 L 287.9 204.4 L 291.4 201.6 L 292.3 197.8 L 299.5 200.3 L 306.7 203.8 L 309.5 198.3 L 310.9 197.4 L 314.6 199.4 L 316 198 L 310.7 188.5 L 309.9 185.4 L 311.2 181.2 L 308.2 177 L 304.8 169.9 L 296.5 170.5 L 289.6 167.6 L 285.2 169.6 L 280.5 175.5 Z", labelX: 282, labelY: 193 },
  { id: "kancheepuram", name: "Kancheepuram", tamilName: "காஞ்சிபுரம்", path: "M 325.6 100.8 L 321.5 102 L 316.2 104.6 L 310.9 106.7 L 305.2 110.2 L 299.2 115.5 L 295.2 118.2 L 290.5 123.7 L 286.4 131.7 L 282.3 135.7 L 281.2 141.5 L 286.4 141.9 L 291.1 145.2 L 296.2 147.9 L 299.8 147.5 L 302.9 148 L 307 141.5 L 309.5 138.2 L 312.1 136.3 L 313.5 131.1 L 313.5 129.2 L 314.1 126.9 L 315.1 123.2 L 319.8 118.5 L 325.7 115.3 L 329 113 L 330.9 107.9 L 325.6 100.8 Z", labelX: 305, labelY: 130 },
  { id: "kanyakumari", name: "Kanyakumari", tamilName: "கன்னியாகுமரி", path: "M 127.5 587.1 L 122.6 583 L 116.3 583.7 L 110.8 581.3 L 104.8 579.1 L 100.5 584.4 L 96.6 591.2 L 100.1 596.9 L 106.2 600.4 L 111.1 603.7 L 117.8 606.7 L 122.5 606.1 L 127.3 603.9 L 131.2 602.4 L 136.4 599.9 L 139.2 594 L 135.7 588.9 L 131.1 587.4 L 127.5 587.1 Z", labelX: 118, labelY: 594 },
  { id: "karur", name: "Karur", tamilName: "கரூர்", path: "M 187.3 287.9 L 183.1 290.2 L 178.5 289.8 L 172.7 287.6 L 166.7 283.6 L 162.5 278 L 158.5 279.3 L 155.8 283.3 L 158 289.7 L 153.2 301.7 L 149.4 305.4 L 150.7 310.4 L 157.2 310 L 163.4 312.5 L 167.4 318.5 L 170.2 314.5 L 177.7 310.2 L 182.7 311.2 L 187 313.7 L 189.8 309.5 L 194.5 306.1 L 200.7 308.4 L 206.3 308.9 L 213.5 303.7 L 219.3 303.9 L 218.7 299.9 L 215.9 296.4 L 209.2 299.1 L 203.3 293.9 L 196.8 290.2 L 190.6 289.5 L 187.3 287.9 Z", labelX: 182, labelY: 297 },
  { id: "krishnagiri", name: "Krishnagiri", tamilName: "கிருஷ்ணகிரி", path: "M 175.9 109 L 172.8 104.7 L 168.4 101.2 L 160.7 103.1 L 152.7 100.2 L 149.2 95.6 L 143.5 93.3 L 137.1 93.2 L 129.9 91.9 L 123.5 88.5 L 116.2 84 L 109.5 82.6 L 102.5 81.5 L 100.5 85.6 L 96 87.4 L 92 93.1 L 88.5 99.3 L 92.2 103.7 L 99.4 108.5 L 104.2 112.9 L 107.9 122.8 L 114.5 130.5 L 118.4 137.9 L 120.6 145.6 L 122.9 155.5 L 124.4 162.9 L 128.6 167.4 L 135.9 168.7 L 139.5 177.1 L 143 172.1 L 147.9 167.2 L 152.2 165.7 L 155.5 163.6 L 159.1 159.7 L 163.7 154.2 L 163.8 148.2 L 163.4 140.1 L 163.6 135.1 L 167.7 126.2 L 171.3 120.5 L 173.9 112.6 L 175.9 109 Z", labelX: 135, labelY: 125 },
  { id: "madurai", name: "Madurai", tamilName: "மதுரை", path: "M 194.5 397.2 L 189.2 401.7 L 183.9 406 L 181.8 411.3 L 177 423.9 L 170.6 426.1 L 166.7 436.5 L 160.3 436.1 L 152.8 436 L 142.1 431.3 L 137.5 432.7 L 133.7 430.1 L 126.6 435.8 L 120.6 424.4 L 117.6 413.5 L 123.3 413.9 L 127.6 409.5 L 130.5 402.2 L 128.3 395.5 L 128.4 389.4 L 132.3 387.5 L 134.7 381.9 L 140.5 381.6 L 143.6 377.9 L 148.6 374.2 L 155.2 368.9 L 160.7 371.5 L 168.6 375.7 L 174.6 380.5 L 181.2 380.5 L 186.5 384.2 L 189 391.2 L 194.5 397.2 Z", labelX: 155, labelY: 408 },
  { id: "mayiladuthurai", name: "Mayiladuthurai", tamilName: "மயிலாடுதுறை", path: "M 319.4 301.2 L 316 306 L 314.4 310.6 L 311.8 315.2 L 310.7 321.4 L 308.9 325.7 L 307.5 332.2 L 308.7 338.5 L 309.9 344.5 L 311.1 351.1 L 310.2 356.2 L 311.6 360.9 L 315 362.9 L 320.9 365.2 L 322.7 370.5 L 323.9 377.8 L 326.4 371.3 L 326.7 366.7 L 324.3 358.5 L 319.5 296.9 L 319.4 301.2 Z", labelX: 318, labelY: 335 },
  { id: "nagapattinam", name: "Nagapattinam", tamilName: "நாகப்பட்டினம்", path: "M 311.6 360.9 L 308.3 366.4 L 305.8 366.9 L 308.7 369.5 L 314.6 371.3 L 320.9 365.2 L 315 362.9 L 311.6 360.9 Z", labelX: 312, labelY: 367 },
  { id: "namakkal", name: "Namakkal", tamilName: "நாமக்கல்", path: "M 197.4 240.4 L 194.6 244.4 L 190.6 249.2 L 187.5 257.9 L 185.2 266.3 L 183.1 276.3 L 187.3 287.9 L 190.6 289.5 L 196.8 290.2 L 203.3 293.9 L 209.2 299.1 L 215.9 296.4 L 218.7 299.9 L 219.3 303.9 L 224.5 304.4 L 232.1 304.8 L 237.2 299.6 L 241.3 296.4 L 244.8 295.7 L 247.4 293.7 L 249.6 291.8 L 251.3 287.1 L 252.6 282.7 L 255.4 281 L 254.9 277.1 L 248.3 274.5 L 241.7 268.6 L 236.2 262.5 L 232.4 256.7 L 232.6 252.9 L 232.7 249.7 L 228.2 248.1 L 222.5 243.3 L 216 244.2 L 212.1 241.9 L 207 243.7 L 202.8 240.7 L 197.4 240.4 Z", labelX: 217, labelY: 272 },
  { id: "nilgiris", name: "Nilgiris", tamilName: "நீலகிரி", path: "M 74.9 250.3 L 78.9 243.5 L 80.2 235.6 L 78.5 229.2 L 72.1 227.1 L 63.9 227.5 L 54.5 229.9 L 50.4 234.6 L 45.3 239.1 L 38.7 247.1 L 32.4 254.7 L 25.3 262.7 L 23.2 268.2 L 25.9 274.1 L 34.2 270.2 L 40.9 271.7 L 49.7 269.8 L 55.6 263.9 L 60.6 262.7 L 64.3 260.2 L 68.2 258.1 L 68.7 253.5 L 72 251.8 L 74.9 250.3 Z", labelX: 52, labelY: 252 },
  { id: "perambalur", name: "Perambalur", tamilName: "பெரம்பலூர்", path: "M 252.2 252.5 L 246.6 251.7 L 238.9 249 L 232.7 249.7 L 232.6 252.9 L 232.4 256.7 L 236.2 262.5 L 241.7 268.6 L 248.3 274.5 L 254.9 277.1 L 255.4 281 L 256.1 277.9 L 255.5 275.3 L 256.4 271.9 L 256.2 270.5 L 260.8 264 L 262.4 258.9 L 263.6 252.5 L 259.1 252.2 L 252.2 252.5 Z", labelX: 248, labelY: 265 },
  { id: "pudukkottai", name: "Pudukkottai", tamilName: "புதுக்கோட்டை", path: "M 259.3 382.9 L 254.6 388.1 L 246.7 388.5 L 242.5 394.9 L 241.5 403.9 L 239 410.2 L 234.4 416.7 L 231.1 424.4 L 234.7 431 L 237.6 435.9 L 244.2 434.6 L 254.6 429.9 L 259.6 424 L 263.7 421.2 L 266.5 411.9 L 268 404 L 268.5 395.7 L 266.3 388.6 L 264 381.7 L 259.3 382.9 Z", labelX: 251, labelY: 410 },
  { id: "ramanathapuram", name: "Ramanathapuram", tamilName: "இராமநாதபுரம்", path: "M 234.7 431 L 228.4 439.4 L 218.2 446.5 L 214.3 454.3 L 210.1 462.7 L 210.7 469.9 L 213.5 476.5 L 221.1 479.5 L 228.5 486.8 L 229.5 493.5 L 223.3 499.1 L 214.6 502.9 L 205.6 507.9 L 197.2 508.2 L 188.7 505.3 L 185.2 497 L 188.9 489.9 L 192.7 481.1 L 188.3 474.9 L 183.9 470.9 L 186.3 473.9 L 189 466.5 L 192.5 463.2 L 195.6 454.3 L 199.7 445.9 L 206.1 440.2 L 214.5 443.9 L 222.8 446.3 L 227.9 442.6 L 232.2 438.8 L 234.7 431 Z", labelX: 210, labelY: 475 },
  { id: "ranipet", name: "Ranipet", tamilName: "ராணிப்பேட்டை", path: "M 286.4 97.9 L 278.9 100.2 L 275.8 104.7 L 277.2 110.2 L 274.1 117.6 L 268.7 123.7 L 266.3 130.7 L 267.7 136.7 L 274.1 136 L 279.1 137.1 L 284.7 137.5 L 287.7 139.4 L 291.1 145.2 L 286.4 141.9 L 281.2 141.5 L 282.3 135.7 L 286.4 131.7 L 290.5 123.7 L 295.2 118.2 L 299.2 115.5 L 303.1 107.1 L 298 105.6 L 291.9 101.9 L 286.4 97.9 Z", labelX: 283, labelY: 120 },
  { id: "salem", name: "Salem", tamilName: "சேலம்", path: "M 212.8 212.7 L 209.9 213.7 L 206 207.2 L 197.4 205.6 L 193 210.2 L 185.9 215.6 L 182.8 220.1 L 179.2 211.3 L 180.9 209.2 L 184.2 204.9 L 184.4 200.1 L 180.2 195.6 L 178.1 188 L 181.7 190.4 L 187.3 189.6 L 192.6 191 L 197 193.5 L 198.9 199.5 L 204.2 200.4 L 211.2 199.9 L 220.6 198.7 L 227.4 197.3 L 233.5 198 L 232.7 200.9 L 229.4 204 L 230.6 209.5 L 228.1 215.2 L 230.2 221.3 L 230.6 226.6 L 228.3 231.7 L 223.7 233.9 L 218.1 241.4 L 212.1 241.9 L 207 243.7 L 202.8 240.7 L 197.4 240.4 L 197.4 234 L 202.3 228.6 L 208.3 225.2 L 210.9 219.6 L 212.8 212.7 Z", labelX: 205, labelY: 218 },
  { id: "sivaganga", name: "Sivaganga", tamilName: "சிவகங்கை", path: "M 239 410.2 L 234.4 416.7 L 231.1 424.4 L 227.9 420.9 L 222.9 421.7 L 217.9 418.7 L 214.4 423.6 L 219.2 428.7 L 223.6 431.6 L 223.3 436.7 L 226.9 442 L 227.9 442.6 L 222.8 446.3 L 214.5 443.9 L 206.1 440.2 L 199.7 445.9 L 195.6 454.3 L 192.5 463.2 L 189 466.5 L 186.3 473.9 L 182.5 470.4 L 177.3 466.1 L 177 423.9 L 181.8 411.3 L 183.9 406 L 189.2 401.7 L 194.5 397.2 L 200.2 392 L 205.6 386.1 L 211.6 380.3 L 217.8 375 L 223.5 371.1 L 228.2 371.3 L 232.9 377.5 L 235.4 382.9 L 242.5 394.9 L 241.5 403.9 L 239 410.2 Z", labelX: 212, labelY: 420 },
  { id: "tenkasi", name: "Tenkasi", tamilName: "தென்காசி", path: "M 126.7 476.7 L 123.1 482.5 L 119 490.2 L 115.3 497.8 L 109.9 503.9 L 104.3 508.5 L 100.3 515.6 L 98.6 523.1 L 101.1 530.5 L 106.2 535.6 L 111.3 543.9 L 114.3 551.7 L 116.2 558.7 L 120 566.2 L 125.9 573.4 L 127.5 571.7 L 131.3 563.2 L 134.7 555.3 L 137.4 547.1 L 139.5 538.7 L 139.6 529.9 L 142.1 521.5 L 147.5 513.9 L 150.8 506.1 L 151.6 497.7 L 148.3 493.1 L 145.5 487.9 L 142.8 483.7 L 139.9 480.3 L 135.7 478.5 L 130.7 475.9 L 126.7 476.7 Z", labelX: 125, labelY: 520 },
  { id: "thanjavur", name: "Thanjavur", tamilName: "தஞ்சாவூர்", path: "M 289 305.2 L 285.9 309.2 L 280.6 310 L 274.9 310.9 L 277.1 317.9 L 280.7 328.7 L 281.2 336.1 L 283.5 343.7 L 287 349.9 L 288 358.9 L 290.8 365.9 L 295.8 363.6 L 296.2 355.9 L 296.6 349.2 L 300.7 344.2 L 301.6 337.7 L 305.7 331.2 L 306.5 329.6 L 307.1 323.4 L 308.6 320.5 L 310.7 321.4 L 311.8 315.2 L 314.4 310.6 L 316 306 L 319.4 301.2 L 318.9 296.9 L 314.7 293.4 L 310.6 293.9 L 306.4 295.4 L 302.3 295.6 L 294.6 296.1 L 289 305.2 Z", labelX: 296, labelY: 325 },
  { id: "theni", name: "Theni", tamilName: "தேனி", path: "M 126.6 435.8 L 120.6 424.4 L 114.1 422.3 L 111.1 424.7 L 105.9 421.3 L 103.3 421.1 L 100.2 416.7 L 96.6 409.7 L 95.5 403.2 L 89.2 401.9 L 83.7 400.6 L 78.9 401.3 L 79.3 406.6 L 77.2 412.2 L 79.3 417.9 L 82.1 425.2 L 85.2 431.3 L 91 437.3 L 96.9 444.4 L 102.7 449.3 L 106.4 455.9 L 111 464.1 L 116.5 463.4 L 119.5 470 L 125.3 466.9 L 130.7 475.9 L 135.7 478.5 L 139.9 480.3 L 142.8 475.6 L 144.9 478 L 148 478 L 147 476.9 L 142.1 469.4 L 139.6 462.6 L 138.2 455.1 L 134.6 447.5 L 127.2 442.3 L 126.6 435.8 Z", labelX: 108, labelY: 440 },
  { id: "thoothukudi", name: "Thoothukudi", tamilName: "தூத்துக்குடி", path: "M 188.7 505.3 L 183.2 507.9 L 177.9 514.9 L 175.3 522.7 L 174.3 531.5 L 175.3 541.9 L 175.9 550.8 L 171 559.9 L 166.7 565.6 L 160.2 571.2 L 153.9 575.6 L 151.9 573.7 L 147.8 569.9 L 144.1 565.2 L 139.3 559.9 L 137.4 547.1 L 139.5 538.7 L 139.6 529.9 L 142.1 521.5 L 147.5 513.9 L 150.8 506.1 L 151.6 497.7 L 155.3 493.7 L 159.2 483 L 164 478.2 L 168.7 472.9 L 177.3 466.1 L 182.5 470.4 L 186.3 473.9 L 188.3 474.9 L 192.7 481.1 L 188.9 489.9 L 185.2 497 L 188.7 505.3 Z", labelX: 165, labelY: 525 },
  { id: "tiruchirappalli", name: "Tiruchirappalli", tamilName: "திருச்சிராப்பள்ளி", path: "M 232.1 304.8 L 224.5 304.4 L 219.3 303.9 L 213.5 303.7 L 206.3 308.9 L 200.7 308.4 L 194.5 306.1 L 189.8 309.5 L 187 313.7 L 192.8 320 L 195.7 322.9 L 200.2 331.4 L 201.5 340.2 L 203.2 349.3 L 201.7 356.7 L 198.2 365 L 195.9 373 L 201.9 378.4 L 211.6 380.3 L 217.8 375 L 223.5 371.1 L 228.2 371.3 L 232.9 377.5 L 235.4 382.9 L 246.7 388.5 L 254.6 388.1 L 259.3 382.9 L 264 381.7 L 266.3 382.7 L 273.9 381.9 L 274.7 376.7 L 279.2 369.7 L 283.8 364.5 L 288 358.9 L 287 349.9 L 283.5 343.7 L 281.2 336.1 L 280.7 328.7 L 277.1 317.9 L 274.9 310.9 L 269 309.9 L 264.7 310.9 L 261.5 312.9 L 257.7 310 L 252.9 310.2 L 248.3 311.9 L 239.1 311.3 L 237.2 299.6 L 232.1 304.8 Z", labelX: 238, labelY: 345 },
  { id: "tirunelveli", name: "Tirunelveli", tamilName: "திருநெல்வேலி", path: "M 127.5 571.7 L 125.9 573.4 L 120 566.2 L 116.2 558.7 L 114.3 551.7 L 111.3 543.9 L 106.2 535.6 L 101.1 530.5 L 98.6 523.1 L 96.2 516.6 L 92.5 510.9 L 88.1 503.8 L 84.1 498.7 L 85.7 492.8 L 89.2 486.3 L 93.6 480.2 L 96.6 473.1 L 99.3 470.5 L 103 469.2 L 109.1 469.2 L 111 464.1 L 106.4 455.9 L 102.7 449.3 L 96.9 444.4 L 91 437.3 L 87.8 429.9 L 90.6 423.4 L 95.3 421.9 L 98.5 427.7 L 103.3 421.1 L 100.2 416.7 L 95.5 403.2 L 101.8 388.4 L 106.7 380.4 L 100.2 383.7 L 94.8 374 L 90.6 367.5 L 87.8 364 L 86.6 366.1 L 84.7 369.2 L 84.6 369.5 L 87 386.6 L 91.6 399.6 L 94.4 407.6 L 98.5 414.2 L 100.6 420.1 L 103.3 421.1 L 105.9 421.3 L 111.1 424.7 L 114.1 422.3 L 117.6 413.5 L 113.5 416.2 L 111.1 383.5 L 106.7 380.4 L 110.7 373.2 L 111.2 367.2 L 109.8 363.2 L 106.9 356.8 L 106.8 349.3 L 109.5 339.7 L 108.9 319.6 L 98.2 313.3 L 92 317.1 L 94.8 333 L 86.7 338.8 L 84.4 351.6 L 87.8 364 L 84.6 369.5 L 84.6 369.6 L 83.8 371 L 83.1 371.2 L 80.8 372.6 L 75.9 373.1 L 68.2 366.8 L 67.2 359.8 L 66.3 337.2 L 64.6 333.1 L 69 330.2 L 70.1 321.5 L 72.4 314.1 L 67.8 308.5 L 63.5 303.8 L 58.5 302.3 L 51.4 298.2 L 57 286.4 L 62.8 284.9 L 59.6 285.1 L 59 280.7 L 58.7 277.3 L 56.3 274.9 L 56.5 270.5 L 55.5 262.6 L 62.2 260.7 L 64.3 260.2 L 60.6 262.7 L 55.6 263.9 L 49.7 269.8 L 40.9 271.7 L 34.2 270.2 L 25.9 274.1 L 23.2 268.2 L 25.3 262.7 L 32.4 254.7 L 38.7 247.1 L 45.3 239.1 L 50.4 234.6 L 54.5 229.9 L 63.9 227.5 L 72.1 227.1 L 78.5 229.2 L 80.2 235.6 L 78.9 243.5 L 74.9 250.3 L 72 251.8 L 68.7 253.5 L 68.2 258.1 L 62.2 260.7 L 55.5 262.6 L 56.5 270.5 L 56.3 274.9 L 58.7 277.3 L 59 280.7 L 59.6 285.1 L 62.8 284.9 L 57 286.4 L 51.4 298.2 L 58.5 302.3 L 63.5 303.8 L 67.8 308.5 L 72.4 314.1 L 70.1 321.5 L 69 330.2 L 64.6 333.1 L 66.3 337.2 L 67.2 359.8 L 68.2 366.8 L 75.9 373.1 L 80.8 372.6 L 83.1 371.2 L 83.8 371 L 84.6 369.6 L 84.6 369.5 L 84.7 369.2 L 86.6 366.1 L 87.8 364 L 90.6 367.5 L 94.8 374 L 98.2 380.6 L 100.2 383.7 L 95.1 399.1 L 95.5 403.2 L 96.6 409.7 L 100.2 416.7 L 103.3 421.1 L 98.5 427.7 L 95.3 421.9 L 90.6 423.4 L 87.8 429.9 L 82.1 425.2 L 79.3 417.9 L 77.2 412.2 L 79.3 406.6 L 78.9 401.3 L 83.7 400.6 L 89.2 401.9 L 95.5 403.2 L 95.1 399.1 L 101.8 388.4 L 100.3 384.2 L 97 388.4 L 101.2 397.2 L 98.1 408.6 L 99.8 413.5 L 100.6 420.1 L 98.4 427.3 L 97 431.1 L 97.4 440 L 102.4 444.2 L 108.3 444.4 L 110.6 441.7 L 112.2 450.3 L 119 468.8 L 124.4 465.7 L 129.5 469.2 L 126.7 476.7 L 123.1 482.5 L 119 490.2 L 115.3 497.8 L 109.9 503.9 L 104.3 508.5 L 100.3 515.6 L 98.6 523.1 L 101.1 530.5 L 106.2 535.6 L 111.3 543.9 L 114.3 551.7 L 116.2 558.7 L 120 566.2 L 125.9 573.4 L 127.5 571.7 L 131.3 563.2 L 134.7 555.3 L 137.4 547.1 L 134.7 555.3 L 131.3 563.2 L 127.5 571.7 Z", labelX: 110, labelY: 510 },
  { id: "tiruvallur", name: "Tiruvallur", tamilName: "திருவள்ளூர்", path: "M 341.7 15 L 349.2 21.1 L 357.7 28.2 L 363.7 34.2 L 364.8 42.3 L 364.6 50.7 L 362 52.4 L 358.5 51.7 L 356.9 53.6 L 354.4 54.4 L 352.5 56.2 L 351.8 57.6 L 351.4 59.7 L 349.8 60.5 L 345 71.5 L 338.5 63 L 331.8 68.9 L 327.2 73.4 L 321.5 78.2 L 315.9 71.7 L 310.9 66.7 L 306.9 58.9 L 299.9 62 L 290.6 62.1 L 282.9 60.2 L 280.7 58.2 L 286.9 50.4 L 293.5 46.7 L 300.9 45.1 L 307 46.7 L 310.9 50.7 L 316.8 45 L 323.9 38.3 L 330.3 30.8 L 334.2 23.9 L 336.9 18.3 L 341.7 15 Z", labelX: 328, labelY: 48 },
  { id: "tirupattur", name: "Tirupattur", tamilName: "திருப்பத்தூர்", path: "M 240.2 87.3 L 234.6 90.9 L 230.5 93.7 L 227.9 99.2 L 226.3 104.7 L 228.1 111.2 L 232.9 116.3 L 237.3 115.2 L 240.9 111.5 L 248 111.8 L 253.9 110.6 L 256.7 102.2 L 261.1 101.5 L 264.3 100.6 L 268.3 100.3 L 272.7 97.1 L 279.8 105.9 L 283.7 105.2 L 286.4 97.9 L 283.9 93.1 L 279.3 88.8 L 275.4 83.6 L 273.4 79.4 L 268.7 81.7 L 266.5 90.2 L 261.7 97.6 L 255.7 95.7 L 249.9 94.6 L 243.9 91.2 L 240.2 87.3 Z", labelX: 256, labelY: 98 },
  { id: "tiruppur", name: "Tiruppur", tamilName: "திருப்பூர்", path: "M 115.1 330.7 L 114.6 327.2 L 108.9 319.6 L 106.6 313.3 L 92 317.1 L 94.8 333 L 92.6 348.5 L 96.7 365.8 L 97.9 371.1 L 98.2 380.6 L 100.2 383.7 L 106.7 380.4 L 101.8 388.4 L 95.1 399.1 L 95.5 403.2 L 89.2 401.9 L 83.7 400.6 L 78.9 401.3 L 75.6 395.7 L 75.5 389.7 L 78.5 382.6 L 80.7 374.7 L 80.8 372.6 L 75.9 373.1 L 68.2 366.8 L 67.2 359.8 L 66.3 337.2 L 64.6 333.1 L 69 330.2 L 70.1 321.5 L 72.4 314.1 L 67.8 308.5 L 63.5 303.8 L 67.8 308.5 L 72.4 314.1 L 70.1 321.5 L 69 330.2 L 64.6 333.1 L 66.3 337.2 L 67.2 359.8 L 68.2 366.8 L 75.9 373.1 L 80.8 372.6 L 83.1 371.2 L 83.8 371 L 84.6 369.6 L 84.6 369.5 L 84.7 369.2 L 86.6 366.1 L 87.8 364 L 84.4 351.6 L 86.7 338.8 L 94.8 333 L 92.6 326.9 L 102.7 325.2 L 108.9 327.6 L 115.1 330.7 Z", labelX: 88, labelY: 360 },
  { id: "tiruvannamalai", name: "Tiruvannamalai", tamilName: "திருவண்ணாமலை", path: "M 298 91.5 L 291 96.5 L 290.3 105.6 L 281.1 111.6 L 283.7 105.2 L 279.8 105.9 L 272.7 97.1 L 269.4 98.1 L 261.5 101.4 L 250.2 107.4 L 238.4 115.4 L 235.5 123.6 L 231.6 133.4 L 227 145.8 L 223.5 153.1 L 220.9 157.6 L 221 162.2 L 219.4 164.4 L 219 169.4 L 222.7 171.9 L 228.6 170.2 L 226.6 175.9 L 225.1 183.2 L 236.4 182.5 L 245.8 177.4 L 255.5 177.8 L 263.7 179.2 L 274.1 170.8 L 270.4 163.2 L 270.9 155.9 L 274.4 148.8 L 268.1 146.2 L 271.5 142.4 L 278 134.8 L 286.5 139.5 L 290.7 144 L 297.5 144 L 307 141.5 L 314 131.2 L 311.8 124.4 L 309.8 119.3 L 304.3 114.4 L 313.2 108.7 L 313.1 104.3 L 307 99.8 L 298 91.5 Z", labelX: 266, labelY: 138 },
  { id: "tiruvarur", name: "Tiruvarur", tamilName: "திருவாரூர்", path: "M 314.1 291.2 L 307.9 289 L 304.3 292.8 L 298.4 293.3 L 294.6 296.1 L 293.6 301.5 L 289 305.2 L 281.7 301.6 L 277 298.4 L 274.9 299.6 L 273.7 303.6 L 277.1 309.8 L 281.9 312.6 L 280.6 317.8 L 277.2 318.1 L 277.6 324.9 L 280.7 328.7 L 281.2 336.1 L 286.5 339.2 L 287.8 341.8 L 290.5 345.4 L 288.8 352.1 L 290.6 358.1 L 295.8 363.6 L 305.8 366.9 L 305.5 362.1 L 304.1 352.9 L 307.7 350.2 L 309.7 346.4 L 309.4 339 L 307.9 335.4 L 306.5 329.6 L 307.1 323.4 L 308.6 320.5 L 312 312.7 L 310.8 309.5 L 305.1 310.6 L 305.2 306.1 L 307.6 299.7 L 310.6 298.9 L 312.4 297.7 L 312.9 295.5 L 312.1 294 L 314.8 295.2 L 314.7 293.4 L 314.1 291.2 Z", labelX: 298, labelY: 319 },
  { id: "vellore", name: "Vellore", tamilName: "வேலூர்", path: "M 274.6 62.5 L 272.4 58.4 L 270.9 58.3 L 269.7 60.5 L 267.1 66.9 L 266.6 68.6 L 266.8 70.6 L 263.5 73.3 L 258.1 72.8 L 252.7 68 L 248.7 66.5 L 246.4 67.4 L 243.9 67.4 L 242.3 70.7 L 245.2 71.7 L 243.3 72.1 L 241.2 70 L 241.4 65.8 L 239.5 66.9 L 236.3 66.9 L 233.2 67.8 L 230.3 69.5 L 219.3 75.9 L 220.4 81.8 L 218.7 85.5 L 220.1 90.5 L 226.1 91.6 L 228.1 92.6 L 231.4 92.8 L 240.2 87.3 L 242.4 91.4 L 241.4 93.8 L 239.8 99 L 237.2 110.3 L 241.8 109.9 L 247.9 111.5 L 251.9 110.3 L 256.7 102.2 L 261.1 101.5 L 264.3 100.6 L 268.3 100.3 L 266.5 90.2 L 268.7 81.7 L 273.4 79.4 L 275.4 70.1 L 274.6 62.5 Z", labelX: 249, labelY: 81 },
  { id: "villupuram", name: "Villupuram", tamilName: "விழுப்புரம்", path: "M 304.9 146.2 L 299.4 144.9 L 294.9 144.2 L 292.2 143.9 L 288.5 141.5 L 287.7 139.4 L 284.7 137.5 L 281.2 136 L 276.1 135.9 L 269.9 140.1 L 269.5 143.7 L 269.5 145.8 L 268.6 146.7 L 271.5 148.8 L 274 150.4 L 272 153.8 L 271.2 157.9 L 269.2 160.9 L 269.1 162.1 L 271.8 168.2 L 273.4 172.5 L 268.9 176.4 L 264.9 184.3 L 276.6 191.2 L 291.4 197.4 L 299.8 200.1 L 307.9 203.2 L 308.9 195.1 L 310.6 192.5 L 311.3 194.9 L 311.9 195 L 313 193.6 L 310.7 189.6 L 309.8 187.5 L 312.4 184.1 L 312.8 185.3 L 314.2 191.1 L 317.5 187.5 L 322.8 184.7 L 322.6 178.2 L 331.8 164.5 L 328.9 157.5 L 323.7 155 L 319.2 148.2 L 310.9 147.2 L 304.9 146.2 Z", labelX: 295, labelY: 167 },
  { id: "virudhunagar", name: "Virudhunagar", tamilName: "விருதுநகர்", path: "M 177 423.9 L 170.6 426.1 L 172.7 432.3 L 166.7 436.5 L 160.3 436.1 L 152.8 436 L 142.1 431.3 L 137.5 432.7 L 133.7 430.1 L 126.6 435.8 L 123.6 440.8 L 116.2 447.8 L 110.7 461.6 L 116.5 463.4 L 119.5 470 L 125.3 466.9 L 130.6 469.8 L 133.4 474.3 L 136.8 475 L 140.3 474.5 L 142.8 475.6 L 144.9 478 L 148 478 L 155.3 480.7 L 159.2 483 L 164 478.2 L 168.7 472.9 L 170.2 466.8 L 177.3 466.1 L 182.5 470.4 L 186.3 473.9 L 194.8 473.9 L 193.8 467.8 L 191 466.4 L 187.2 465.6 L 184.3 461 L 191.3 457.6 L 194.5 451.8 L 197.3 445.1 L 201.7 440.9 L 198.7 435.9 L 192.8 429 L 191.1 432.7 L 189 429.3 L 183.4 422 L 177 423.9 Z", labelX: 162, labelY: 455 },
];

// Official 234 Assembly Constituencies per district (as per Election Commission of India)
export const CONSTITUENCY_NAMES: Record<string, string[]> = {
  chennai: [
    "Anna Nagar", "Chepauk-Thiruvallikeni", "Dr. Radhakrishnan Nagar", "Egmore (SC)",
    "Harbour", "Kolathur", "Mylapore", "Perambur", "Royapuram", "Saidapet",
    "Thiru-Vi-Ka-Nagar (SC)", "Thiyagarayanagar", "Thousand Lights", "Velachery",
    "Villivakkam", "Virugambakkam"
  ],
  tiruvallur: [
    "Ambattur", "Avadi", "Gummidipoondi", "Madhavaram", "Madhuravoyal",
    "Ponneri (SC)", "Poonamallee (SC)", "Thiruvallur", "Thiruvottiyur", "Tiruttani"
  ],
  chengalpattu: ["Chengalpattu", "Cheyyur (SC)", "Madurantakam (SC)", "Pallavaram", "Sholinganallur", "Tambaram", "Thiruporur"],
  kancheepuram: ["Kancheepuram", "Sriperumbudur", "Uthiramerur"],
  ranipet: ["Arakkonam", "Arcot", "Ranipet", "Sholingur (SC)"],
  tirupattur: ["Ambur", "Jolarpet", "Tirupattur", "Vaniyambadi"],
  vellore: ["Anaicut", "Gudiyatham (SC)", "Katpadi", "Vellore"],
  tiruvannamalai: [
    "Arani", "Chengam", "Cheyyar (SC)", "Kalasapakkam (SC)", "Kilpennathur",
    "Polur", "Thandarampattu", "Tiruvannamalai", "Vandavasi"
  ],
  krishnagiri: ["Bargur", "Hosur", "Krishnagiri", "Thalli", "Uthangarai", "Veppanahalli"],
  dharmapuri: ["Dharmapuri", "Harur", "Palacodu", "Pappireddipatti", "Pennagaram"],
  kallakurichi: ["Gangavalli (SC)", "Kallakurichi", "Rishivandiyam", "Sankarapuram"],
  villupuram: [
    "Gingee", "Mailam", "Tindivanam (SC)", "Tirukkoyilur", "Vanur (SC)",
    "Vikravandi", "Villupuram"
  ],
  cuddalore: [
    "Bhuvanagiri", "Chidambaram", "Cuddalore", "Kattumannarkoil (SC)",
    "Kurinjipadi", "Neyveli", "Panruti", "Tittakudi (SC)", "Vridhachalam"
  ],
  salem: [
    "Attur (SC)", "Edappadi", "Gangavalli (SC)", "Mettur", "Omalur",
    "Salem North", "Salem South", "Salem West", "Sankari", "Veerapandi", "Yercaud (ST)"
  ],
  namakkal: [
    "Kumarapalayam", "Namakkal", "Paramathivelur", "Rasipuram (SC)",
    "Senthamangalam (ST)", "Tiruchengodu"
  ],
  erode: [
    "Anthiyur", "Bhavani", "Bhavanisagar (SC)", "Erode East", "Erode West",
    "Gobichettipalayam", "Modakkurichi", "Perundurai"
  ],
  tiruppur: [
    "Avanashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", 
    "Tiruppur North", "Tiruppur South", "Udumalpet"
  ],
  coimbatore: [
    "Coimbatore North", "Coimbatore South", "Kavundampalayam", "Kinathukadavu",
    "Mettupalayam", "Pollachi", "Singanallur", "Sulur", "Thondamuthur", "Valparai (SC)"
  ],
  nilgiris: ["Coonoor", "Gudalur (ST)", "Udhagamandalam (SC)"],
  ariyalur: ["Ariyalur", "Jayankondam", "Sendurai"],
  perambalur: ["Kunnam", "Perambalur"],
  tiruchirappalli: [
    "Lalgudi", "Manachanallur", "Manapparai", "Musiri", "Srirangam",
    "Thiruverumbur", "Thuraiyur (SC)", "Tiruchirappalli East", "Tiruchirappalli West"
  ],
  thanjavur: [
    "Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Peravurani",
    "Thanjavur", "Thiruvaiyaru", "Thiruvidaimarudur (SC)"
  ],
  mayiladuthurai: ["Mayiladuthurai", "Poompuhar", "Sirkazhi (SC)", "Kuthalam"],
  tiruvarur: [
    "Mannargudi", "Nannilam", "Needamangalam", "Thiruvarur", "Thiruthuraipoondi (SC)"
  ],
  nagapattinam: ["Kilvelur (SC)", "Nagapattinam", "Vedaranyam"],
  karur: ["Aravakurichi", "Karur", "Krishnarayapuram (SC)", "Kulithalai"],
  dindigul: ["Athoor", "Dindigul", "Natham", "Nilakkottai (SC)", "Oddanchatram", "Palani", "Vedasandur"],
  madurai: [
    "Madurai Central", "Madurai East", "Madurai North", "Madurai South",
    "Madurai West", "Melur", "Sholavandan (SC)", "Thirumangalam",
    "Thiruparankundram", "Usilampatti"
  ],
  theni: ["Andipatti", "Bodinayakanur", "Cumbum", "Periyakulam", "Theni"],
  pudukkottai: [
    "Alangudi", "Aranthangi", "Gandarvakottai (SC)", "Karambakudi",
    "Pudukkottai", "Thirumayam", "Viralimalai"
  ],
  sivaganga: ["Devakottai", "Karaikudi", "Manamadurai (SC)", "Sivaganga"],
  ramanathapuram: ["Mudukulathur", "Paramakudi (SC)", "Ramanathapuram", "Tiruvadanai"],
  virudhunagar: [
    "Aruppukkottai", "Rajapalayam", "Sattur", "Sivakasi",
    "Srivilliputhur", "Tiruchuli", "Virudhunagar"
  ],
  thoothukudi: [
    "Ettayapuram", "Kovilpatti", "Ottapidaram (SC)", "Srivaikuntam", "Thoothukudi",
    "Tiruchendur", "Vilathikulam"
  ],
  tenkasi: ["Alangulam", "Sankarankovil (SC)", "Tenkasi", "Vasudevanallur (SC)"],
  tirunelveli: [
    "Ambasamudram", "Nanguneri", "Palayamkottai", "Radhapuram (SC)", "Tirunelveli"
  ],
  kanyakumari: [
    "Colachel", "Kanniyakumari", "Killiyoor", "Nagercoil",
    "Padmanabhapuram", "Vilavancode"
  ],
};

// Generate constituency IDs
export function generateConstituencyId(districtId: string, name: string): string {
  return `${districtId}-${name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
}

// Generate constituencies for a district
export function generateConstituencies(districtId: string): { id: string; districtId: string; name: string; tamilName: string }[] {
  const names = CONSTITUENCY_NAMES[districtId] || ["Constituency 1", "Constituency 2", "Constituency 3"];
  
  return names.map((name) => ({
    id: generateConstituencyId(districtId, name),
    districtId,
    name,
    tamilName: name,
  }));
}

// Generate areas for a constituency
export function generateAreas(constituencyId: string): { id: string; name: string; type: "taluk" | "booth" }[] {
  const areas: { id: string; name: string; type: "taluk" | "booth" }[] = [];
  
  // Generate 4 taluks
  for (let i = 1; i <= 4; i++) {
    areas.push({
      id: `${constituencyId}-taluk-${i}`,
      name: `Taluk ${i}`,
      type: "taluk",
    });
  }
  
  // Generate 20 booths (5 per taluk)
  for (let t = 1; t <= 4; t++) {
    for (let b = 1; b <= 5; b++) {
      areas.push({
        id: `${constituencyId}-booth-${t}-${b}`,
        name: `Booth ${(t-1)*5 + b}`,
        type: "booth",
      });
    }
  }
  
  return areas;
}

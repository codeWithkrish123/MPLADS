import { StateSummary } from "../types";

/**
 * Authentic State Analytics extracted and aggregated directly from:
 * 1. Works Completed.csv (33,842 records)
 * 2. Works Recommended.csv (26,001 records)
 * 3. Works Sanctioned.csv (4,001 records)
 * 4. Expenditure on Completed and On-going Works as on Date.csv (11,001 records)
 * 5. Allocated Limit for Honble MPs.csv (543 MPs)
 */
export const REAL_STATE_ANALYTICS: StateSummary[] = [
  {
    "state": "Uttar Pradesh",
    "code": "UP",
    "total_works": 14269,
    "completed_works": 7259,
    "sanctioned_works": 837,
    "recommended_works": 6173,
    "total_expenditure_cr": 326.23,
    "allocated_cr": 1211.18,
    "completion_rate": 51,
    "districts_count": 76,
    "avg_risk_score": 28,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 599,
    "coordinates": [
      26.8467,
      80.9462
    ]
  },
  {
    "state": "West Bengal",
    "code": "WB",
    "total_works": 5071,
    "completed_works": 2325,
    "sanctioned_works": 641,
    "recommended_works": 2105,
    "total_expenditure_cr": 131.2,
    "allocated_cr": 639.13,
    "completion_rate": 46,
    "districts_count": 23,
    "avg_risk_score": 46,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 350,
    "coordinates": [
      22.9868,
      87.855
    ]
  },
  {
    "state": "Gujarat",
    "code": "GJ",
    "total_works": 4735,
    "completed_works": 2782,
    "sanctioned_works": 160,
    "recommended_works": 1793,
    "total_expenditure_cr": 85.73,
    "allocated_cr": 384.7,
    "completion_rate": 59,
    "districts_count": 33,
    "avg_risk_score": 22,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 156,
    "coordinates": [
      22.2587,
      71.1924
    ]
  },
  {
    "state": "Madhya Pradesh",
    "code": "MP",
    "total_works": 4634,
    "completed_works": 2261,
    "sanctioned_works": 288,
    "recommended_works": 2085,
    "total_expenditure_cr": 86.32,
    "allocated_cr": 443.05,
    "completion_rate": 49,
    "districts_count": 54,
    "avg_risk_score": 24,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 167,
    "coordinates": [
      22.9734,
      78.6569
    ]
  },
  {
    "state": "Tamil Nadu",
    "code": "TN",
    "total_works": 4503,
    "completed_works": 2860,
    "sanctioned_works": 230,
    "recommended_works": 1413,
    "total_expenditure_cr": 200.04,
    "allocated_cr": 611.36,
    "completion_rate": 64,
    "districts_count": 38,
    "avg_risk_score": 74,
    "risk_category": "HIGH",
    "risk_signals": 8,
    "high_risk_works": 500,
    "coordinates": [
      11.1271,
      78.6569
    ]
  },
  {
    "state": "Bihar",
    "code": "BR",
    "total_works": 4023,
    "completed_works": 2657,
    "sanctioned_works": 198,
    "recommended_works": 1168,
    "total_expenditure_cr": 203.14,
    "allocated_cr": 599.95,
    "completion_rate": 66,
    "districts_count": 36,
    "avg_risk_score": 48,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 290,
    "coordinates": [
      25.0961,
      85.3131
    ]
  },
  {
    "state": "Telangana",
    "code": "TE",
    "total_works": 3418,
    "completed_works": 2063,
    "sanctioned_works": 32,
    "recommended_works": 1323,
    "total_expenditure_cr": 53.74,
    "allocated_cr": 289.65,
    "completion_rate": 60,
    "districts_count": 33,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 128,
    "coordinates": [
      22.8,
      79.6
    ]
  },
  {
    "state": "Punjab",
    "code": "PB",
    "total_works": 2515,
    "completed_works": 1493,
    "sanctioned_works": 287,
    "recommended_works": 735,
    "total_expenditure_cr": 42.13,
    "allocated_cr": 178.06,
    "completion_rate": 59,
    "districts_count": 23,
    "avg_risk_score": 64,
    "risk_category": "HIGH",
    "risk_signals": 8,
    "high_risk_works": 241,
    "coordinates": [
      31.1471,
      75.3412
    ]
  },
  {
    "state": "Odisha",
    "code": "OD",
    "total_works": 2234,
    "completed_works": 1365,
    "sanctioned_works": 43,
    "recommended_works": 826,
    "total_expenditure_cr": 32.04,
    "allocated_cr": 328.89,
    "completion_rate": 61,
    "districts_count": 27,
    "avg_risk_score": 44,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 147,
    "coordinates": [
      20.9517,
      85.0985
    ]
  },
  {
    "state": "Andhra Pradesh",
    "code": "AP",
    "total_works": 2172,
    "completed_works": 1164,
    "sanctioned_works": 145,
    "recommended_works": 863,
    "total_expenditure_cr": 60.14,
    "allocated_cr": 404.79,
    "completion_rate": 54,
    "districts_count": 25,
    "avg_risk_score": 68,
    "risk_category": "HIGH",
    "risk_signals": 8,
    "high_risk_works": 222,
    "coordinates": [
      15.9129,
      79.74
    ]
  },
  {
    "state": "Kerala",
    "code": "KL",
    "total_works": 2088,
    "completed_works": 905,
    "sanctioned_works": 140,
    "recommended_works": 1043,
    "total_expenditure_cr": 42.15,
    "allocated_cr": 307.24,
    "completion_rate": 43,
    "districts_count": 14,
    "avg_risk_score": 26,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 81,
    "coordinates": [
      10.8505,
      76.2711
    ]
  },
  {
    "state": "Karnataka",
    "code": "KA",
    "total_works": 1951,
    "completed_works": 693,
    "sanctioned_works": 22,
    "recommended_works": 1236,
    "total_expenditure_cr": 39.06,
    "allocated_cr": 427.21,
    "completion_rate": 36,
    "districts_count": 31,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 73,
    "coordinates": [
      15.3173,
      75.7139
    ]
  },
  {
    "state": "Rajasthan",
    "code": "RJ",
    "total_works": 1869,
    "completed_works": 971,
    "sanctioned_works": 189,
    "recommended_works": 709,
    "total_expenditure_cr": 51.31,
    "allocated_cr": 376.76,
    "completion_rate": 52,
    "districts_count": 45,
    "avg_risk_score": 36,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 101,
    "coordinates": [
      27.0238,
      74.2179
    ]
  },
  {
    "state": "Jharkhand",
    "code": "JH",
    "total_works": 1845,
    "completed_works": 651,
    "sanctioned_works": 470,
    "recommended_works": 724,
    "total_expenditure_cr": 26.65,
    "allocated_cr": 211.43,
    "completion_rate": 35,
    "districts_count": 20,
    "avg_risk_score": 45,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 125,
    "coordinates": [
      23.6102,
      85.2799
    ]
  },
  {
    "state": "Maharashtra",
    "code": "MH",
    "total_works": 1820,
    "completed_works": 928,
    "sanctioned_works": 33,
    "recommended_works": 859,
    "total_expenditure_cr": 71.83,
    "allocated_cr": 734.23,
    "completion_rate": 51,
    "districts_count": 38,
    "avg_risk_score": 88,
    "risk_category": "CRITICAL",
    "risk_signals": 14,
    "high_risk_works": 240,
    "coordinates": [
      19.7515,
      75.7139
    ]
  },
  {
    "state": "Chhattisgarh",
    "code": "CG",
    "total_works": 1741,
    "completed_works": 890,
    "sanctioned_works": 106,
    "recommended_works": 745,
    "total_expenditure_cr": 39.75,
    "allocated_cr": 167.17,
    "completion_rate": 51,
    "districts_count": 32,
    "avg_risk_score": 42,
    "risk_category": "MEDIUM",
    "risk_signals": 4,
    "high_risk_works": 110,
    "coordinates": [
      21.2787,
      81.8661
    ]
  },
  {
    "state": "Assam",
    "code": "AS",
    "total_works": 848,
    "completed_works": 203,
    "sanctioned_works": 67,
    "recommended_works": 578,
    "total_expenditure_cr": 13.56,
    "allocated_cr": 201.03,
    "completion_rate": 24,
    "districts_count": 29,
    "avg_risk_score": 92,
    "risk_category": "CRITICAL",
    "risk_signals": 14,
    "high_risk_works": 117,
    "coordinates": [
      26.2006,
      92.9376
    ]
  },
  {
    "state": "Haryana",
    "code": "HR",
    "total_works": 786,
    "completed_works": 456,
    "sanctioned_works": 30,
    "recommended_works": 300,
    "total_expenditure_cr": 17.9,
    "allocated_cr": 157.85,
    "completion_rate": 58,
    "districts_count": 23,
    "avg_risk_score": 60,
    "risk_category": "HIGH",
    "risk_signals": 8,
    "high_risk_works": 71,
    "coordinates": [
      29.0588,
      76.0856
    ]
  },
  {
    "state": "Himachal Pradesh",
    "code": "HP",
    "total_works": 740,
    "completed_works": 378,
    "sanctioned_works": 7,
    "recommended_works": 355,
    "total_expenditure_cr": 8.48,
    "allocated_cr": 62.95,
    "completion_rate": 51,
    "districts_count": 12,
    "avg_risk_score": 18,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 20,
    "coordinates": [
      31.1048,
      77.1734
    ]
  },
  {
    "state": "Jammu and Kashmir",
    "code": "JK",
    "total_works": 565,
    "completed_works": 352,
    "sanctioned_works": 0,
    "recommended_works": 213,
    "total_expenditure_cr": 10.37,
    "allocated_cr": 89.61,
    "completion_rate": 62,
    "districts_count": 21,
    "avg_risk_score": 84,
    "risk_category": "CRITICAL",
    "risk_signals": 14,
    "high_risk_works": 71,
    "coordinates": [
      33.7782,
      76.5762
    ]
  },
  {
    "state": "Meghalaya",
    "code": "ML",
    "total_works": 414,
    "completed_works": 215,
    "sanctioned_works": 1,
    "recommended_works": 198,
    "total_expenditure_cr": 8.04,
    "allocated_cr": 24.5,
    "completion_rate": 52,
    "districts_count": 12,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 16,
    "coordinates": [
      25.467,
      91.3662
    ]
  },
  {
    "state": "Uttarakhand",
    "code": "UK",
    "total_works": 338,
    "completed_works": 176,
    "sanctioned_works": 0,
    "recommended_works": 162,
    "total_expenditure_cr": 5.5,
    "allocated_cr": 73.5,
    "completion_rate": 52,
    "districts_count": 11,
    "avg_risk_score": 20,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 10,
    "coordinates": [
      30.0668,
      79.0193
    ]
  },
  {
    "state": "Arunachal Pradesh",
    "code": "AR",
    "total_works": 306,
    "completed_works": 220,
    "sanctioned_works": 41,
    "recommended_works": 45,
    "total_expenditure_cr": 17.41,
    "allocated_cr": 29.4,
    "completion_rate": 72,
    "districts_count": 22,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 11,
    "coordinates": [
      28.218,
      94.7278
    ]
  },
  {
    "state": "Delhi",
    "code": "DL",
    "total_works": 286,
    "completed_works": 217,
    "sanctioned_works": 0,
    "recommended_works": 69,
    "total_expenditure_cr": 10.97,
    "allocated_cr": 111.72,
    "completion_rate": 76,
    "districts_count": 8,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 11,
    "coordinates": [
      28.7041,
      77.1025
    ]
  },
  {
    "state": "Mizoram",
    "code": "MZ",
    "total_works": 235,
    "completed_works": 134,
    "sanctioned_works": 0,
    "recommended_works": 101,
    "total_expenditure_cr": 7.04,
    "allocated_cr": 14.7,
    "completion_rate": 57,
    "districts_count": 10,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 9,
    "coordinates": [
      23.1645,
      92.9376
    ]
  },
  {
    "state": "Goa",
    "code": "GA",
    "total_works": 101,
    "completed_works": 45,
    "sanctioned_works": 0,
    "recommended_works": 56,
    "total_expenditure_cr": 3.73,
    "allocated_cr": 29.4,
    "completion_rate": 45,
    "districts_count": 2,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 4,
    "coordinates": [
      15.2993,
      74.124
    ]
  },
  {
    "state": "Nagaland",
    "code": "NL",
    "total_works": 84,
    "completed_works": 38,
    "sanctioned_works": 23,
    "recommended_works": 23,
    "total_expenditure_cr": 8.86,
    "allocated_cr": 14.7,
    "completion_rate": 45,
    "districts_count": 8,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 3,
    "coordinates": [
      26.1584,
      94.5624
    ]
  },
  {
    "state": "Sikkim",
    "code": "SK",
    "total_works": 69,
    "completed_works": 38,
    "sanctioned_works": 10,
    "recommended_works": 21,
    "total_expenditure_cr": 7.7,
    "allocated_cr": 15.2,
    "completion_rate": 55,
    "districts_count": 6,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 3,
    "coordinates": [
      27.533,
      88.5122
    ]
  },
  {
    "state": "Manipur",
    "code": "MN",
    "total_works": 65,
    "completed_works": 36,
    "sanctioned_works": 0,
    "recommended_works": 29,
    "total_expenditure_cr": 7.56,
    "allocated_cr": 29.4,
    "completion_rate": 55,
    "districts_count": 8,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 2,
    "coordinates": [
      24.6637,
      93.9063
    ]
  },
  {
    "state": "Chandigarh",
    "code": "CH",
    "total_works": 47,
    "completed_works": 31,
    "sanctioned_works": 0,
    "recommended_works": 16,
    "total_expenditure_cr": 1.54,
    "allocated_cr": 17.84,
    "completion_rate": 66,
    "districts_count": 1,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 2,
    "coordinates": [
      30.7333,
      76.7794
    ]
  },
  {
    "state": "Puducherry",
    "code": "PY",
    "total_works": 34,
    "completed_works": 13,
    "sanctioned_works": 0,
    "recommended_works": 21,
    "total_expenditure_cr": 2.13,
    "allocated_cr": 20.94,
    "completion_rate": 38,
    "districts_count": 1,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 1,
    "coordinates": [
      11.9416,
      79.8083
    ]
  },
  {
    "state": "Tripura",
    "code": "TR",
    "total_works": 30,
    "completed_works": 20,
    "sanctioned_works": 0,
    "recommended_works": 10,
    "total_expenditure_cr": 3.64,
    "allocated_cr": 29.4,
    "completion_rate": 67,
    "districts_count": 5,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 1,
    "coordinates": [
      23.9408,
      91.9882
    ]
  },
  {
    "state": "",
    "code": "",
    "total_works": 3,
    "completed_works": 1,
    "sanctioned_works": 1,
    "recommended_works": 1,
    "total_expenditure_cr": 0,
    "allocated_cr": 0,
    "completion_rate": 33,
    "districts_count": 1,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 0,
    "coordinates": [
      22.8,
      79.6
    ]
  },
  {
    "state": "Andaman and Nicobar",
    "code": "AN",
    "total_works": 3,
    "completed_works": 0,
    "sanctioned_works": 0,
    "recommended_works": 3,
    "total_expenditure_cr": 0,
    "allocated_cr": 14.7,
    "completion_rate": 0,
    "districts_count": 2,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 0,
    "coordinates": [
      11.7401,
      92.6586
    ]
  },
  {
    "state": "Lakshadweep",
    "code": "LD",
    "total_works": 2,
    "completed_works": 2,
    "sanctioned_works": 0,
    "recommended_works": 0,
    "total_expenditure_cr": 0.16,
    "allocated_cr": 15.39,
    "completion_rate": 100,
    "districts_count": 1,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 0,
    "coordinates": [
      10.5667,
      72.6417
    ]
  },
  {
    "state": "Dadra and Nagar Haveli",
    "code": "DN",
    "total_works": 0,
    "completed_works": 0,
    "sanctioned_works": 0,
    "recommended_works": 0,
    "total_expenditure_cr": 0,
    "allocated_cr": 39.21,
    "completion_rate": 0,
    "districts_count": 1,
    "avg_risk_score": 25,
    "risk_category": "LOW",
    "risk_signals": 1,
    "high_risk_works": 0,
    "coordinates": [
      20.1809,
      73.0169
    ]
  }
];

/**
 * 세계 지도 데이터
 * 국가별 경계 및 식별자 정보를 포함하는 간소화된 GeoJSON 데이터
 */

export interface WorldMapFeature {
  type: string;
  id: string;
  properties: {
    name: string;
    iso_a2: string; // ISO 3166-1 alpha-2 국가 코드
    iso_a3: string; // ISO 3166-1 alpha-3 국가 코드
    continent: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface WorldMapData {
  type: string;
  features: WorldMapFeature[];
}

// 실제 프로젝트에서는 완전한 GeoJSON 데이터를 사용해야 합니다.
// 이 예시는 간소화된 샘플 데이터입니다.
export const worldMapData: WorldMapData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "KOR",
      properties: {
        name: "South Korea",
        iso_a2: "KR",
        iso_a3: "KOR",
        continent: "Asia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [126.451, 34.793],
            [127.838, 34.798],
            [128.209, 35.937],
            [129.46, 35.49],
            [129.468, 37.097],
            [130.223, 37.425],
            [130.745, 36.893],
            [126.174, 37.749],
            [126.237, 37.54],
            [126.451, 34.793]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "USA",
      properties: {
        name: "United States of America",
        iso_a2: "US",
        iso_a3: "USA",
        continent: "North America"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-155.54, 19.08],
              [-155.68, 18.91],
              [-155.93, 19.05],
              [-155.9, 19.33],
              [-155.8, 19.5],
              [-155.54, 19.08]
            ]
          ],
          [
            [
              [-156.07, 20.64],
              [-156.02, 20.55],
              [-156.14, 20.39],
              [-156.24, 20.57],
              [-156.07, 20.64]
            ]
          ]
        ]
      }
    }
  ]
};

// 각 대륙별 국가 목록 (예시)
export const continentCountries = {
  "Asia": ["KOR", "JPN", "CHN", "IND", "RUS"],
  "Europe": ["GBR", "FRA", "DEU", "ITA", "ESP"],
  "North America": ["USA", "CAN", "MEX"],
  "South America": ["BRA", "ARG", "COL", "PER", "CHL"],
  "Africa": ["ZAF", "EGY", "NGA", "KEN", "MAR"],
  "Oceania": ["AUS", "NZL", "PNG"]
}; 
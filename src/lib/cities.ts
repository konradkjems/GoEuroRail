import { City } from '@/types';

const citiesData = [
  {
    "id": "london",
    "name": "London",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.50853,
      "lng": -0.12574
    },
    "region": "Western Europe",
    "population": 8961989,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "berlin",
    "name": "Berlin",
    "country": "Germany",
    "coordinates": {
      "lat": 52.52437,
      "lng": 13.41053
    },
    "region": "Western Europe",
    "population": 3426354,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "madrid",
    "name": "Madrid",
    "country": "Spain",
    "coordinates": {
      "lat": 40.4165,
      "lng": -3.70256
    },
    "region": "Southern Europe",
    "population": 3255944,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "rome",
    "name": "Rome",
    "country": "Italy",
    "coordinates": {
      "lat": 41.89193,
      "lng": 12.51133
    },
    "region": "Southern Europe",
    "population": 2318895,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "paris",
    "name": "Paris",
    "country": "France",
    "coordinates": {
      "lat": 48.85341,
      "lng": 2.3488
    },
    "region": "Western Europe",
    "population": 2138551,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "bucharest",
    "name": "Bucharest",
    "country": "Romania",
    "coordinates": {
      "lat": 44.43225,
      "lng": 26.10626
    },
    "region": "Eastern Europe",
    "population": 1877155,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "hamburg",
    "name": "Hamburg",
    "country": "Germany",
    "coordinates": {
      "lat": 53.55073,
      "lng": 9.99302
    },
    "region": "Western Europe",
    "population": 1845229,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "budapest",
    "name": "Budapest",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.49835,
      "lng": 19.04045
    },
    "region": "Central Europe",
    "population": 1741041,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "warsaw",
    "name": "Warsaw",
    "country": "Poland",
    "coordinates": {
      "lat": 52.22977,
      "lng": 21.01178
    },
    "region": "Eastern Europe",
    "population": 1702139,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "vienna",
    "name": "Vienna",
    "country": "Austria",
    "coordinates": {
      "lat": 48.20849,
      "lng": 16.37208
    },
    "region": "Central Europe",
    "population": 1691468,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "barcelona",
    "name": "Barcelona",
    "country": "Spain",
    "coordinates": {
      "lat": 41.38879,
      "lng": 2.15899
    },
    "region": "Southern Europe",
    "population": 1620343,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "stockholm",
    "name": "Stockholm",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.32938,
      "lng": 18.06871
    },
    "region": "Northern Europe",
    "population": 1515017,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "milan",
    "name": "Milan",
    "country": "Italy",
    "coordinates": {
      "lat": 45.46427,
      "lng": 9.18951
    },
    "region": "Southern Europe",
    "population": 1371498,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "belgrade",
    "name": "Belgrade",
    "country": "Serbia",
    "coordinates": {
      "lat": 44.80401,
      "lng": 20.46513
    },
    "region": "Southern Europe",
    "population": 1273651,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "munich",
    "name": "Munich",
    "country": "Germany",
    "coordinates": {
      "lat": 48.13743,
      "lng": 11.57549
    },
    "region": "Western Europe",
    "population": 1260391,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "prague",
    "name": "Prague",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 50.08804,
      "lng": 14.42076
    },
    "region": "Central Europe",
    "population": 1165581,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "copenhagen",
    "name": "Copenhagen",
    "country": "Denmark",
    "coordinates": {
      "lat": 55.67594,
      "lng": 12.56553
    },
    "region": "Northern Europe",
    "population": 1153615,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "sofia",
    "name": "Sofia",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.69751,
      "lng": 23.32415
    },
    "region": "Other",
    "population": 1152556,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "birmingham",
    "name": "Birmingham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.48142,
      "lng": -1.89983
    },
    "region": "Western Europe",
    "population": 1144919,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "dublin",
    "name": "Dublin",
    "country": "Ireland",
    "coordinates": {
      "lat": 53.33306,
      "lng": -6.24889
    },
    "region": "Western Europe",
    "population": 1024027,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "brussels",
    "name": "Brussels",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.85045,
      "lng": 4.34878
    },
    "region": "Western Europe",
    "population": 1019022,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "köln",
    "name": "Köln",
    "country": "Germany",
    "coordinates": {
      "lat": 50.93333,
      "lng": 6.95
    },
    "region": "Western Europe",
    "population": 963395,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "naples",
    "name": "Naples",
    "country": "Italy",
    "coordinates": {
      "lat": 40.85216,
      "lng": 14.26811
    },
    "region": "Southern Europe",
    "population": 909048,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "marseille",
    "name": "Marseille",
    "country": "France",
    "coordinates": {
      "lat": 43.29695,
      "lng": 5.38107
    },
    "region": "Western Europe",
    "population": 870731,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "liverpool",
    "name": "Liverpool",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.41058,
      "lng": -2.97794
    },
    "region": "Western Europe",
    "population": 864122,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "turin",
    "name": "Turin",
    "country": "Italy",
    "coordinates": {
      "lat": 45.07049,
      "lng": 7.68682
    },
    "region": "Southern Europe",
    "population": 847287,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "valencia",
    "name": "Valencia",
    "country": "Spain",
    "coordinates": {
      "lat": 39.47391,
      "lng": -0.37966
    },
    "region": "Southern Europe",
    "population": 792492,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "łódź",
    "name": "Łódź",
    "country": "Poland",
    "coordinates": {
      "lat": 51.77058,
      "lng": 19.47395
    },
    "region": "Eastern Europe",
    "population": 768755,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "kraków",
    "name": "Kraków",
    "country": "Poland",
    "coordinates": {
      "lat": 50.06143,
      "lng": 19.93658
    },
    "region": "Eastern Europe",
    "population": 755050,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "riga",
    "name": "Riga",
    "country": "Latvia",
    "coordinates": {
      "lat": 56.946,
      "lng": 24.10589
    },
    "region": "Northern Europe",
    "population": 742572,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "amsterdam",
    "name": "Amsterdam",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.37403,
      "lng": 4.88969
    },
    "region": "Western Europe",
    "population": 741636,
    "isTransportHub": true,
    "size": "medium"
  },
  {
    "id": "sarajevo",
    "name": "Sarajevo",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 43.84864,
      "lng": 18.35644
    },
    "region": "Southern Europe",
    "population": 696731,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "sevilla",
    "name": "Sevilla",
    "country": "Spain",
    "coordinates": {
      "lat": 37.38283,
      "lng": -5.97317
    },
    "region": "Southern Europe",
    "population": 684234,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "zaragoza",
    "name": "Zaragoza",
    "country": "Spain",
    "coordinates": {
      "lat": 41.65606,
      "lng": -0.87734
    },
    "region": "Southern Europe",
    "population": 675301,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "athens",
    "name": "Athens",
    "country": "Greece",
    "coordinates": {
      "lat": 37.98376,
      "lng": 23.72784
    },
    "region": "Southern Europe",
    "population": 664046,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "zagreb",
    "name": "Zagreb",
    "country": "Croatia",
    "coordinates": {
      "lat": 45.81444,
      "lng": 15.97798
    },
    "region": "Southern Europe",
    "population": 663592,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "helsinki",
    "name": "Helsinki",
    "country": "Finland",
    "coordinates": {
      "lat": 60.16952,
      "lng": 24.93545
    },
    "region": "Northern Europe",
    "population": 658864,
    "isTransportHub": true,
    "size": "medium"
  },
  {
    "id": "frankfurt-am-main",
    "name": "Frankfurt am Main",
    "country": "Germany",
    "coordinates": {
      "lat": 50.11552,
      "lng": 8.68417
    },
    "region": "Western Europe",
    "population": 650000,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "palermo",
    "name": "Palermo",
    "country": "Italy",
    "coordinates": {
      "lat": 38.1166,
      "lng": 13.3636
    },
    "region": "Southern Europe",
    "population": 648260,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "wrocław",
    "name": "Wrocław",
    "country": "Poland",
    "coordinates": {
      "lat": 51.1,
      "lng": 17.03333
    },
    "region": "Eastern Europe",
    "population": 634893,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "stuttgart",
    "name": "Stuttgart",
    "country": "Germany",
    "coordinates": {
      "lat": 48.78232,
      "lng": 9.17702
    },
    "region": "Western Europe",
    "population": 630305,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "glasgow",
    "name": "Glasgow",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 55.86515,
      "lng": -4.25763
    },
    "region": "Western Europe",
    "population": 626410,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "düsseldorf",
    "name": "Düsseldorf",
    "country": "Germany",
    "coordinates": {
      "lat": 51.22172,
      "lng": 6.77616
    },
    "region": "Western Europe",
    "population": 620523,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "rotterdam",
    "name": "Rotterdam",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.9225,
      "lng": 4.47917
    },
    "region": "Western Europe",
    "population": 598199,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "großzschocher",
    "name": "Großzschocher",
    "country": "Germany",
    "coordinates": {
      "lat": 51.30147,
      "lng": 12.32322
    },
    "region": "Western Europe",
    "population": 597493,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "kleinzschocher",
    "name": "Kleinzschocher",
    "country": "Germany",
    "coordinates": {
      "lat": 51.31568,
      "lng": 12.31979
    },
    "region": "Western Europe",
    "population": 597493,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "essen",
    "name": "Essen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.45657,
      "lng": 7.01228
    },
    "region": "Western Europe",
    "population": 593085,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "dortmund",
    "name": "Dortmund",
    "country": "Germany",
    "coordinates": {
      "lat": 51.51494,
      "lng": 7.466
    },
    "region": "Western Europe",
    "population": 588462,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "göteborg",
    "name": "Göteborg",
    "country": "Sweden",
    "coordinates": {
      "lat": 57.70716,
      "lng": 11.96679
    },
    "region": "Northern Europe",
    "population": 587549,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "genoa",
    "name": "Genoa",
    "country": "Italy",
    "coordinates": {
      "lat": 44.40478,
      "lng": 8.94439
    },
    "region": "Southern Europe",
    "population": 580097,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "oslo",
    "name": "Oslo",
    "country": "Norway",
    "coordinates": {
      "lat": 59.91273,
      "lng": 10.74609
    },
    "region": "Northern Europe",
    "population": 580000,
    "isTransportHub": true,
    "size": "medium"
  },
  {
    "id": "málaga",
    "name": "Málaga",
    "country": "Spain",
    "coordinates": {
      "lat": 36.72016,
      "lng": -4.42034
    },
    "region": "Southern Europe",
    "population": 578460,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "poznań",
    "name": "Poznań",
    "country": "Poland",
    "coordinates": {
      "lat": 52.40692,
      "lng": 16.92993
    },
    "region": "Eastern Europe",
    "population": 570352,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "sheffield",
    "name": "Sheffield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.38297,
      "lng": -1.4659
    },
    "region": "Western Europe",
    "population": 556500,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "dresden",
    "name": "Dresden",
    "country": "Germany",
    "coordinates": {
      "lat": 51.05089,
      "lng": 13.73832
    },
    "region": "Western Europe",
    "population": 556227,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "bremen",
    "name": "Bremen",
    "country": "Germany",
    "coordinates": {
      "lat": 53.07582,
      "lng": 8.80717
    },
    "region": "Western Europe",
    "population": 546501,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "vilnius",
    "name": "Vilnius",
    "country": "Lithuania",
    "coordinates": {
      "lat": 54.68916,
      "lng": 25.2798
    },
    "region": "Northern Europe",
    "population": 542366,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "antwerpen",
    "name": "Antwerpen",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.22047,
      "lng": 4.40026
    },
    "region": "Western Europe",
    "population": 529247,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "lyon",
    "name": "Lyon",
    "country": "France",
    "coordinates": {
      "lat": 45.74846,
      "lng": 4.84671
    },
    "region": "Western Europe",
    "population": 522969,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "lisbon",
    "name": "Lisbon",
    "country": "Portugal",
    "coordinates": {
      "lat": 38.71667,
      "lng": -9.13333
    },
    "region": "Southern Europe",
    "population": 517802,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "leeds",
    "name": "Leeds",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.79648,
      "lng": -1.54785
    },
    "region": "Western Europe",
    "population": 516298,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "nürnberg",
    "name": "Nürnberg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.45421,
      "lng": 11.07752
    },
    "region": "Western Europe",
    "population": 515543,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "hannover",
    "name": "Hannover",
    "country": "Germany",
    "coordinates": {
      "lat": 52.37052,
      "lng": 9.73322
    },
    "region": "Western Europe",
    "population": 515140,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "edinburgh",
    "name": "Edinburgh",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 55.95206,
      "lng": -3.19648
    },
    "region": "Western Europe",
    "population": 506520,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "leipzig",
    "name": "Leipzig",
    "country": "Germany",
    "coordinates": {
      "lat": 51.33962,
      "lng": 12.37129
    },
    "region": "Western Europe",
    "population": 504971,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "duisburg",
    "name": "Duisburg",
    "country": "Germany",
    "coordinates": {
      "lat": 51.43247,
      "lng": 6.76516
    },
    "region": "Western Europe",
    "population": 504358,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "toulouse",
    "name": "Toulouse",
    "country": "France",
    "coordinates": {
      "lat": 43.60426,
      "lng": 1.44367
    },
    "region": "Western Europe",
    "population": 493465,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "skopje",
    "name": "Skopje",
    "country": "Macedonia, The former Yugoslav Rep. of",
    "coordinates": {
      "lat": 41.99646,
      "lng": 21.43141
    },
    "region": "Southern Europe",
    "population": 474889,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "the-hague",
    "name": "The Hague",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.07667,
      "lng": 4.29861
    },
    "region": "Western Europe",
    "population": 474292,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bristol",
    "name": "Bristol",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.45523,
      "lng": -2.59665
    },
    "region": "Western Europe",
    "population": 465866,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gdańsk",
    "name": "Gdańsk",
    "country": "Poland",
    "coordinates": {
      "lat": 54.35227,
      "lng": 18.64912
    },
    "region": "Eastern Europe",
    "population": 461865,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "murcia",
    "name": "Murcia",
    "country": "Spain",
    "coordinates": {
      "lat": 37.98704,
      "lng": -1.13004
    },
    "region": "Southern Europe",
    "population": 460349,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cardiff",
    "name": "Cardiff",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.48,
      "lng": -3.18
    },
    "region": "Western Europe",
    "population": 447287,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bratislava",
    "name": "Bratislava",
    "country": "Slovakia",
    "coordinates": {
      "lat": 48.14816,
      "lng": 17.10674
    },
    "region": "Central Europe",
    "population": 423737,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tirana",
    "name": "Tirana",
    "country": "Albania",
    "coordinates": {
      "lat": 41.3275,
      "lng": 19.81889
    },
    "region": "Southern Europe",
    "population": 418495,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wandsbek",
    "name": "Wandsbek",
    "country": "Germany",
    "coordinates": {
      "lat": 53.58334,
      "lng": 10.08305
    },
    "region": "Western Europe",
    "population": 411422,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "palma",
    "name": "Palma",
    "country": "Spain",
    "coordinates": {
      "lat": 39.56939,
      "lng": 2.65024
    },
    "region": "Southern Europe",
    "population": 409661,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "szczecin",
    "name": "Szczecin",
    "country": "Poland",
    "coordinates": {
      "lat": 53.42894,
      "lng": 14.55302
    },
    "region": "Eastern Europe",
    "population": 407811,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "manchester",
    "name": "Manchester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.48095,
      "lng": -2.23743
    },
    "region": "Western Europe",
    "population": 395515,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bologna",
    "name": "Bologna",
    "country": "Italy",
    "coordinates": {
      "lat": 44.49381,
      "lng": 11.33875
    },
    "region": "Southern Europe",
    "population": 394843,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tallinn",
    "name": "Tallinn",
    "country": "Estonia",
    "coordinates": {
      "lat": 59.43696,
      "lng": 24.75353
    },
    "region": "Northern Europe",
    "population": 394024,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bochum",
    "name": "Bochum",
    "country": "Germany",
    "coordinates": {
      "lat": 51.48165,
      "lng": 7.21648
    },
    "region": "Western Europe",
    "population": 385729,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-3",
    "name": "Sector 3",
    "country": "Romania",
    "coordinates": {
      "lat": 44.4234,
      "lng": 26.16874
    },
    "region": "Eastern Europe",
    "population": 385439,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bochum-hordel",
    "name": "Bochum-Hordel",
    "country": "Germany",
    "coordinates": {
      "lat": 51.50168,
      "lng": 7.1756
    },
    "region": "Western Europe",
    "population": 380000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brno",
    "name": "Brno",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.19522,
      "lng": 16.60796
    },
    "region": "Central Europe",
    "population": 379466,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "iaşi",
    "name": "Iaşi",
    "country": "Romania",
    "coordinates": {
      "lat": 47.16667,
      "lng": 27.6
    },
    "region": "Eastern Europe",
    "population": 378954,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leicester",
    "name": "Leicester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.6386,
      "lng": -1.13169
    },
    "region": "Western Europe",
    "population": 368600,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-6",
    "name": "Sector 6",
    "country": "Romania",
    "coordinates": {
      "lat": 44.43579,
      "lng": 26.01649
    },
    "region": "Eastern Europe",
    "population": 367760,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "florence",
    "name": "Florence",
    "country": "Italy",
    "coordinates": {
      "lat": 43.77925,
      "lng": 11.24626
    },
    "region": "Southern Europe",
    "population": 367150,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bydgoszcz",
    "name": "Bydgoszcz",
    "country": "Poland",
    "coordinates": {
      "lat": 53.1235,
      "lng": 18.00762
    },
    "region": "Eastern Europe",
    "population": 366452,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bradford",
    "name": "Bradford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.79391,
      "lng": -1.75206
    },
    "region": "Western Europe",
    "population": 366187,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "utrecht",
    "name": "Utrecht",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.09083,
      "lng": 5.12222
    },
    "region": "Western Europe",
    "population": 361742,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wuppertal",
    "name": "Wuppertal",
    "country": "Germany",
    "coordinates": {
      "lat": 51.25627,
      "lng": 7.14816
    },
    "region": "Western Europe",
    "population": 360797,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lublin",
    "name": "Lublin",
    "country": "Poland",
    "coordinates": {
      "lat": 51.25,
      "lng": 22.56667
    },
    "region": "Eastern Europe",
    "population": 360044,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "malmö",
    "name": "Malmö",
    "country": "Sweden",
    "coordinates": {
      "lat": 55.60587,
      "lng": 13.00073
    },
    "region": "Northern Europe",
    "population": 351749,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "plovdiv",
    "name": "Plovdiv",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.15,
      "lng": 24.75
    },
    "region": "Other",
    "population": 346893,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bilbao",
    "name": "Bilbao",
    "country": "Spain",
    "coordinates": {
      "lat": 43.26271,
      "lng": -2.92528
    },
    "region": "Southern Europe",
    "population": 345821,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "belfast",
    "name": "Belfast",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.59682,
      "lng": -5.92541
    },
    "region": "Western Europe",
    "population": 345418,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-2",
    "name": "Sector 2",
    "country": "Romania",
    "coordinates": {
      "lat": 44.4528,
      "lng": 26.13321
    },
    "region": "Eastern Europe",
    "population": 345370,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "coventry",
    "name": "Coventry",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.40656,
      "lng": -1.51217
    },
    "region": "Western Europe",
    "population": 345324,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nice",
    "name": "Nice",
    "country": "France",
    "coordinates": {
      "lat": 43.70313,
      "lng": 7.26608
    },
    "region": "Western Europe",
    "population": 342669,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zürich",
    "name": "Zürich",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.36667,
      "lng": 8.55
    },
    "region": "Central Europe",
    "population": 341730,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alicante",
    "name": "Alicante",
    "country": "Spain",
    "coordinates": {
      "lat": 38.34517,
      "lng": -0.48149
    },
    "region": "Southern Europe",
    "population": 334757,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bielefeld",
    "name": "Bielefeld",
    "country": "Germany",
    "coordinates": {
      "lat": 52.03333,
      "lng": 8.53333
    },
    "region": "Western Europe",
    "population": 331906,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bonn",
    "name": "Bonn",
    "country": "Germany",
    "coordinates": {
      "lat": 50.73438,
      "lng": 7.09549
    },
    "region": "Western Europe",
    "population": 330579,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brent",
    "name": "Brent",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.55306,
      "lng": -0.3023
    },
    "region": "Western Europe",
    "population": 329100,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "córdoba",
    "name": "Córdoba",
    "country": "Spain",
    "coordinates": {
      "lat": 37.89155,
      "lng": -4.77275
    },
    "region": "Southern Europe",
    "population": 325708,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "birkenhead",
    "name": "Birkenhead",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.39337,
      "lng": -3.01479
    },
    "region": "Western Europe",
    "population": 325264,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nottingham",
    "name": "Nottingham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.9536,
      "lng": -1.15047
    },
    "region": "Western Europe",
    "population": 323632,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "islington",
    "name": "Islington",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.53622,
      "lng": -0.10304
    },
    "region": "Western Europe",
    "population": 319143,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nantes",
    "name": "Nantes",
    "country": "France",
    "coordinates": {
      "lat": 47.21725,
      "lng": -1.55336
    },
    "region": "Western Europe",
    "population": 318808,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marne-la-vallée",
    "name": "Marne La Vallée",
    "country": "France",
    "coordinates": {
      "lat": 48.83584,
      "lng": 2.64241
    },
    "region": "Western Europe",
    "population": 318325,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reading",
    "name": "Reading",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.45625,
      "lng": -0.97113
    },
    "region": "Western Europe",
    "population": 318014,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "constanţa",
    "name": "Constanţa",
    "country": "Romania",
    "coordinates": {
      "lat": 44.18073,
      "lng": 28.63432
    },
    "region": "Eastern Europe",
    "population": 317832,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "thessaloníki",
    "name": "Thessaloníki",
    "country": "Greece",
    "coordinates": {
      "lat": 40.64361,
      "lng": 22.93086
    },
    "region": "Southern Europe",
    "population": 317778,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "katowice",
    "name": "Katowice",
    "country": "Poland",
    "coordinates": {
      "lat": 50.25841,
      "lng": 19.02754
    },
    "region": "Eastern Europe",
    "population": 317316,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cluj-napoca",
    "name": "Cluj-Napoca",
    "country": "Romania",
    "coordinates": {
      "lat": 46.76667,
      "lng": 23.6
    },
    "region": "Eastern Europe",
    "population": 316748,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bari",
    "name": "Bari",
    "country": "Italy",
    "coordinates": {
      "lat": 41.12066,
      "lng": 16.86982
    },
    "region": "Southern Europe",
    "population": 316491,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hamburg-nord",
    "name": "Hamburg-Nord",
    "country": "Germany",
    "coordinates": {
      "lat": 53.58935,
      "lng": 9.984
    },
    "region": "Western Europe",
    "population": 315514,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "timişoara",
    "name": "Timişoara",
    "country": "Romania",
    "coordinates": {
      "lat": 45.75372,
      "lng": 21.22571
    },
    "region": "Eastern Europe",
    "population": 315053,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kingston-upon-hull",
    "name": "Kingston upon Hull",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.7446,
      "lng": -0.33525
    },
    "region": "Western Europe",
    "population": 314018,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "preston",
    "name": "Preston",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.76282,
      "lng": -2.70452
    },
    "region": "Western Europe",
    "population": 313332,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "varna",
    "name": "Varna",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 43.21667,
      "lng": 27.91667
    },
    "region": "Other",
    "population": 312770,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "catania",
    "name": "Catania",
    "country": "Italy",
    "coordinates": {
      "lat": 37.49223,
      "lng": 15.07041
    },
    "region": "Southern Europe",
    "population": 311584,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mannheim",
    "name": "Mannheim",
    "country": "Germany",
    "coordinates": {
      "lat": 49.4891,
      "lng": 8.46694
    },
    "region": "Western Europe",
    "population": 307960,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "newport",
    "name": "Newport",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.58774,
      "lng": -2.99835
    },
    "region": "Western Europe",
    "population": 306844,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "craiova",
    "name": "Craiova",
    "country": "Romania",
    "coordinates": {
      "lat": 44.31667,
      "lng": 23.8
    },
    "region": "Eastern Europe",
    "population": 305689,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hamburg-mitte",
    "name": "Hamburg-Mitte",
    "country": "Germany",
    "coordinates": {
      "lat": 53.55,
      "lng": 10.01667
    },
    "region": "Western Europe",
    "population": 301231,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "swansea",
    "name": "Swansea",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.62079,
      "lng": -3.94323
    },
    "region": "Western Europe",
    "population": 300352,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "newcastle-upon-tyne",
    "name": "Newcastle upon Tyne",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.97328,
      "lng": -1.61396
    },
    "region": "Western Europe",
    "population": 300125,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "valladolid",
    "name": "Valladolid",
    "country": "Spain",
    "coordinates": {
      "lat": 41.65518,
      "lng": -4.72372
    },
    "region": "Southern Europe",
    "population": 299265,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vigo",
    "name": "Vigo",
    "country": "Spain",
    "coordinates": {
      "lat": 42.23282,
      "lng": -8.72264
    },
    "region": "Southern Europe",
    "population": 297332,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "graz",
    "name": "Graz",
    "country": "Austria",
    "coordinates": {
      "lat": 47.06667,
      "lng": 15.45
    },
    "region": "Central Europe",
    "population": 295424,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "southend-on-sea",
    "name": "Southend-on-Sea",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.53782,
      "lng": 0.71433
    },
    "region": "Western Europe",
    "population": 295310,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "galaţi",
    "name": "Galaţi",
    "country": "Romania",
    "coordinates": {
      "lat": 45.43687,
      "lng": 28.05028
    },
    "region": "Eastern Europe",
    "population": 294087,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "białystok",
    "name": "Białystok",
    "country": "Poland",
    "coordinates": {
      "lat": 53.13333,
      "lng": 23.16433
    },
    "region": "Eastern Europe",
    "population": 291855,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kaunas",
    "name": "Kaunas",
    "country": "Lithuania",
    "coordinates": {
      "lat": 54.90272,
      "lng": 23.90961
    },
    "region": "Northern Europe",
    "population": 289380,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-4",
    "name": "Sector 4",
    "country": "Romania",
    "coordinates": {
      "lat": 44.37571,
      "lng": 26.12085
    },
    "region": "Eastern Europe",
    "population": 287828,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marienthal",
    "name": "Marienthal",
    "country": "Germany",
    "coordinates": {
      "lat": 53.56667,
      "lng": 10.08333
    },
    "region": "Western Europe",
    "population": 287101,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bergen",
    "name": "Bergen",
    "country": "Norway",
    "coordinates": {
      "lat": 60.39299,
      "lng": 5.32415
    },
    "region": "Northern Europe",
    "population": 285911,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "århus",
    "name": "Århus",
    "country": "Denmark",
    "coordinates": {
      "lat": 56.15674,
      "lng": 10.21076
    },
    "region": "Northern Europe",
    "population": 285273,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "karlsruhe",
    "name": "Karlsruhe",
    "country": "Germany",
    "coordinates": {
      "lat": 49.00937,
      "lng": 8.40444
    },
    "region": "Western Europe",
    "population": 283799,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ostrava",
    "name": "Ostrava",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.83465,
      "lng": 18.28204
    },
    "region": "Central Europe",
    "population": 279791,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "south-dublin",
    "name": "South Dublin",
    "country": "Ireland",
    "coordinates": {
      "lat": 53.29026,
      "lng": -6.34151
    },
    "region": "Western Europe",
    "population": 278749,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wiesbaden",
    "name": "Wiesbaden",
    "country": "Germany",
    "coordinates": {
      "lat": 50.08258,
      "lng": 8.24932
    },
    "region": "Western Europe",
    "population": 278609,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gijón",
    "name": "Gijón",
    "country": "Spain",
    "coordinates": {
      "lat": 43.53573,
      "lng": -5.66152
    },
    "region": "Southern Europe",
    "population": 277554,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brighton",
    "name": "Brighton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.82838,
      "lng": -0.13947
    },
    "region": "Western Europe",
    "population": 277103,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "strasbourg",
    "name": "Strasbourg",
    "country": "France",
    "coordinates": {
      "lat": 48.58392,
      "lng": 7.74553
    },
    "region": "Western Europe",
    "population": 274845,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ljubljana",
    "name": "Ljubljana",
    "country": "Slovenia",
    "coordinates": {
      "lat": 46.05108,
      "lng": 14.50513
    },
    "region": "Central Europe",
    "population": 272220,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-5",
    "name": "Sector 5",
    "country": "Romania",
    "coordinates": {
      "lat": 44.38808,
      "lng": 26.07144
    },
    "region": "Eastern Europe",
    "population": 271575,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "derby",
    "name": "Derby",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.92277,
      "lng": -1.47663
    },
    "region": "Western Europe",
    "population": 270468,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "münster",
    "name": "Münster",
    "country": "Germany",
    "coordinates": {
      "lat": 51.96236,
      "lng": 7.62571
    },
    "region": "Western Europe",
    "population": 270184,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gelsenkirchen",
    "name": "Gelsenkirchen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.50508,
      "lng": 7.09654
    },
    "region": "Western Europe",
    "population": 270028,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "southampton",
    "name": "Southampton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.90395,
      "lng": -1.40428
    },
    "region": "Western Europe",
    "population": 269781,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "eimsbüttel",
    "name": "Eimsbüttel",
    "country": "Germany",
    "coordinates": {
      "lat": 53.57416,
      "lng": 9.95679
    },
    "region": "Western Europe",
    "population": 269118,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "eixample",
    "name": "Eixample",
    "country": "Spain",
    "coordinates": {
      "lat": 41.38896,
      "lng": 2.16179
    },
    "region": "Southern Europe",
    "population": 266477,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aachen",
    "name": "Aachen",
    "country": "Germany",
    "coordinates": {
      "lat": 50.77664,
      "lng": 6.08342
    },
    "region": "Western Europe",
    "population": 265208,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gent",
    "name": "Gent",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.05,
      "lng": 3.71667
    },
    "region": "Western Europe",
    "population": 265086,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wolverhampton",
    "name": "Wolverhampton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.58547,
      "lng": -2.12296
    },
    "region": "Western Europe",
    "population": 263700,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mönchengladbach",
    "name": "Mönchengladbach",
    "country": "Germany",
    "coordinates": {
      "lat": 51.18539,
      "lng": 6.44172
    },
    "region": "Western Europe",
    "population": 261742,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bordeaux",
    "name": "Bordeaux",
    "country": "France",
    "coordinates": {
      "lat": 44.84044,
      "lng": -0.5805
    },
    "region": "Western Europe",
    "population": 260958,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "plymouth",
    "name": "Plymouth",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.37153,
      "lng": -4.14305
    },
    "region": "Western Europe",
    "population": 260203,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "augsburg",
    "name": "Augsburg",
    "country": "Germany",
    "coordinates": {
      "lat": 48.37154,
      "lng": 10.89851
    },
    "region": "Western Europe",
    "population": 259196,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stoke-on-trent",
    "name": "Stoke-on-Trent",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.00415,
      "lng": -2.18538
    },
    "region": "Western Europe",
    "population": 258366,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "verona",
    "name": "Verona",
    "country": "Italy",
    "coordinates": {
      "lat": 45.43854,
      "lng": 10.9938
    },
    "region": "Southern Europe",
    "population": 258031,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "l'hospitalet-de-llobregat",
    "name": "L'Hospitalet de Llobregat",
    "country": "Spain",
    "coordinates": {
      "lat": 41.35967,
      "lng": 2.10028
    },
    "region": "Southern Europe",
    "population": 257038,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "espoo",
    "name": "Espoo",
    "country": "Finland",
    "coordinates": {
      "lat": 60.2052,
      "lng": 24.6522
    },
    "region": "Northern Europe",
    "population": 256760,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "latina",
    "name": "Latina",
    "country": "Spain",
    "coordinates": {
      "lat": 40.38897,
      "lng": -3.74569
    },
    "region": "Southern Europe",
    "population": 256644,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "milton-keynes",
    "name": "Milton Keynes",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.04172,
      "lng": -0.75583
    },
    "region": "Western Europe",
    "population": 256385,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "carabanchel",
    "name": "Carabanchel",
    "country": "Spain",
    "coordinates": {
      "lat": 40.39094,
      "lng": -3.7242
    },
    "region": "Southern Europe",
    "population": 253678,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "braşov",
    "name": "Braşov",
    "country": "Romania",
    "coordinates": {
      "lat": 45.64861,
      "lng": 25.60613
    },
    "region": "Eastern Europe",
    "population": 253200,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "altona",
    "name": "Altona",
    "country": "Germany",
    "coordinates": {
      "lat": 53.55,
      "lng": 9.93333
    },
    "region": "Western Europe",
    "population": 250192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "niš",
    "name": "Niš",
    "country": "Serbia",
    "coordinates": {
      "lat": 43.32472,
      "lng": 21.90333
    },
    "region": "Southern Europe",
    "population": 250000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "porto",
    "name": "Porto",
    "country": "Portugal",
    "coordinates": {
      "lat": 41.14961,
      "lng": -8.61099
    },
    "region": "Southern Europe",
    "population": 249633,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gasteiz-/-vitoria",
    "name": "Gasteiz / Vitoria",
    "country": "Spain",
    "coordinates": {
      "lat": 42.84998,
      "lng": -2.67268
    },
    "region": "Southern Europe",
    "population": 249176,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "montpellier",
    "name": "Montpellier",
    "country": "France",
    "coordinates": {
      "lat": 43.61093,
      "lng": 3.87635
    },
    "region": "Western Europe",
    "population": 248252,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "częstochowa",
    "name": "Częstochowa",
    "country": "Poland",
    "coordinates": {
      "lat": 50.79646,
      "lng": 19.12409
    },
    "region": "Eastern Europe",
    "population": 248125,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "city-of-westminster",
    "name": "City of Westminster",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.4975,
      "lng": -0.1357
    },
    "region": "Western Europe",
    "population": 247614,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chemnitz",
    "name": "Chemnitz",
    "country": "Germany",
    "coordinates": {
      "lat": 50.8357,
      "lng": 12.92922
    },
    "region": "Western Europe",
    "population": 247220,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kiel",
    "name": "Kiel",
    "country": "Germany",
    "coordinates": {
      "lat": 54.32133,
      "lng": 10.13489
    },
    "region": "Western Europe",
    "population": 246601,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "a-coruña",
    "name": "A Coruña",
    "country": "Spain",
    "coordinates": {
      "lat": 43.37135,
      "lng": -8.396
    },
    "region": "Southern Europe",
    "population": 246056,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "northampton",
    "name": "Northampton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.25,
      "lng": -0.88333
    },
    "region": "Western Europe",
    "population": 245899,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gdynia",
    "name": "Gdynia",
    "country": "Poland",
    "coordinates": {
      "lat": 54.51889,
      "lng": 18.53188
    },
    "region": "Eastern Europe",
    "population": 244969,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "braunschweig",
    "name": "Braunschweig",
    "country": "Germany",
    "coordinates": {
      "lat": 52.26594,
      "lng": 10.52673
    },
    "region": "Western Europe",
    "population": 244715,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tampere",
    "name": "Tampere",
    "country": "Finland",
    "coordinates": {
      "lat": 61.49911,
      "lng": 23.78712
    },
    "region": "Northern Europe",
    "population": 244315,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "puente-de-vallecas",
    "name": "Puente de Vallecas",
    "country": "Spain",
    "coordinates": {
      "lat": 40.39354,
      "lng": -3.662
    },
    "region": "Southern Europe",
    "population": 244151,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "krefeld",
    "name": "Krefeld",
    "country": "Germany",
    "coordinates": {
      "lat": 51.33645,
      "lng": 6.55381
    },
    "region": "Western Europe",
    "population": 237984,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "halle-(saale)",
    "name": "Halle (Saale)",
    "country": "Germany",
    "coordinates": {
      "lat": 51.48158,
      "lng": 11.97947
    },
    "region": "Western Europe",
    "population": 237865,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oldham",
    "name": "Oldham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.54051,
      "lng": -2.1183
    },
    "region": "Western Europe",
    "population": 237110,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "podgorica",
    "name": "Podgorica",
    "country": "Montenegro",
    "coordinates": {
      "lat": 42.44111,
      "lng": 19.26361
    },
    "region": "Southern Europe",
    "population": 236852,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "magdeburg",
    "name": "Magdeburg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.12773,
      "lng": 11.62916
    },
    "region": "Western Europe",
    "population": 235775,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sant-martí",
    "name": "Sant Martí",
    "country": "Spain",
    "coordinates": {
      "lat": 41.41814,
      "lng": 2.19933
    },
    "region": "Southern Europe",
    "population": 235719,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rouen",
    "name": "Rouen",
    "country": "France",
    "coordinates": {
      "lat": 49.44313,
      "lng": 1.09932
    },
    "region": "Western Europe",
    "population": 234475,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lille",
    "name": "Lille",
    "country": "France",
    "coordinates": {
      "lat": 50.63297,
      "lng": 3.05858
    },
    "region": "Western Europe",
    "population": 234475,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "granada",
    "name": "Granada",
    "country": "Spain",
    "coordinates": {
      "lat": 37.18817,
      "lng": -3.60667
    },
    "region": "Southern Europe",
    "population": 234325,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "groningen",
    "name": "Groningen",
    "country": "Netherlands",
    "coordinates": {
      "lat": 53.21917,
      "lng": 6.56667
    },
    "region": "Western Europe",
    "population": 233218,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "elche",
    "name": "Elche",
    "country": "Spain",
    "coordinates": {
      "lat": 38.26218,
      "lng": -0.70107
    },
    "region": "Southern Europe",
    "population": 230112,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ploieşti",
    "name": "Ploieşti",
    "country": "Romania",
    "coordinates": {
      "lat": 44.95,
      "lng": 26.01667
    },
    "region": "Eastern Europe",
    "population": 228851,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "košice",
    "name": "Košice",
    "country": "Slovakia",
    "coordinates": {
      "lat": 48.71395,
      "lng": 21.25808
    },
    "region": "Central Europe",
    "population": 228249,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ciudad-lineal",
    "name": "Ciudad Lineal",
    "country": "Spain",
    "coordinates": {
      "lat": 40.44505,
      "lng": -3.65132
    },
    "region": "Southern Europe",
    "population": 228171,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bexley",
    "name": "Bexley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.44162,
      "lng": 0.14866
    },
    "region": "Western Europe",
    "population": 228000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sosnowiec",
    "name": "Sosnowiec",
    "country": "Poland",
    "coordinates": {
      "lat": 50.28682,
      "lng": 19.10385
    },
    "region": "Eastern Europe",
    "population": 227295,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "neue-neustadt",
    "name": "Neue Neustadt",
    "country": "Germany",
    "coordinates": {
      "lat": 52.15,
      "lng": 11.63333
    },
    "region": "Western Europe",
    "population": 226851,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "radom",
    "name": "Radom",
    "country": "Poland",
    "coordinates": {
      "lat": 51.40253,
      "lng": 21.14714
    },
    "region": "Eastern Europe",
    "population": 226794,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sector-1",
    "name": "Sector 1",
    "country": "Romania",
    "coordinates": {
      "lat": 44.49239,
      "lng": 26.04831
    },
    "region": "Eastern Europe",
    "population": 225453,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "luton",
    "name": "Luton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.87967,
      "lng": -0.41748
    },
    "region": "Western Europe",
    "population": 225262,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "banja-luka",
    "name": "Banja Luka",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 44.77842,
      "lng": 17.19386
    },
    "region": "Southern Europe",
    "population": 221106,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rennes",
    "name": "Rennes",
    "country": "France",
    "coordinates": {
      "lat": 48.11198,
      "lng": -1.67429
    },
    "region": "Western Europe",
    "population": 220488,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fuencarral-el-pardo",
    "name": "Fuencarral-El Pardo",
    "country": "Spain",
    "coordinates": {
      "lat": 40.4984,
      "lng": -3.7314
    },
    "region": "Southern Europe",
    "population": 220085,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oviedo",
    "name": "Oviedo",
    "country": "Spain",
    "coordinates": {
      "lat": 43.36029,
      "lng": -5.84476
    },
    "region": "Southern Europe",
    "population": 220020,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "messina",
    "name": "Messina",
    "country": "Italy",
    "coordinates": {
      "lat": 38.19394,
      "lng": 15.55256
    },
    "region": "Southern Europe",
    "population": 219948,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "badalona",
    "name": "Badalona",
    "country": "Spain",
    "coordinates": {
      "lat": 41.45004,
      "lng": 2.24741
    },
    "region": "Southern Europe",
    "population": 219547,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oberhausen",
    "name": "Oberhausen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.47805,
      "lng": 6.8625
    },
    "region": "Western Europe",
    "population": 219176,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "terrassa",
    "name": "Terrassa",
    "country": "Spain",
    "coordinates": {
      "lat": 41.56667,
      "lng": 2.01667
    },
    "region": "Southern Europe",
    "population": 218535,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mokotów",
    "name": "Mokotów",
    "country": "Poland",
    "coordinates": {
      "lat": 52.1934,
      "lng": 21.03487
    },
    "region": "Eastern Europe",
    "population": 217683,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mainz",
    "name": "Mainz",
    "country": "Germany",
    "coordinates": {
      "lat": 49.98419,
      "lng": 8.2791
    },
    "region": "Western Europe",
    "population": 217123,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "freiburg",
    "name": "Freiburg",
    "country": "Germany",
    "coordinates": {
      "lat": 47.9959,
      "lng": 7.85222
    },
    "region": "Western Europe",
    "population": 215966,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "archway",
    "name": "Archway",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.56733,
      "lng": -0.13415
    },
    "region": "Western Europe",
    "population": 215667,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "novi-sad",
    "name": "Novi Sad",
    "country": "Serbia",
    "coordinates": {
      "lat": 45.25167,
      "lng": 19.83694
    },
    "region": "Southern Europe",
    "population": 215400,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "erfurt",
    "name": "Erfurt",
    "country": "Germany",
    "coordinates": {
      "lat": 50.9787,
      "lng": 11.03283
    },
    "region": "Western Europe",
    "population": 213692,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brăila",
    "name": "Brăila",
    "country": "Romania",
    "coordinates": {
      "lat": 45.27152,
      "lng": 27.97429
    },
    "region": "Eastern Europe",
    "population": 213569,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "trondheim",
    "name": "Trondheim",
    "country": "Norway",
    "coordinates": {
      "lat": 63.43049,
      "lng": 10.39506
    },
    "region": "Northern Europe",
    "population": 212660,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lübeck",
    "name": "Lübeck",
    "country": "Germany",
    "coordinates": {
      "lat": 53.86893,
      "lng": 10.68729
    },
    "region": "Western Europe",
    "population": 212207,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cartagena",
    "name": "Cartagena",
    "country": "Spain",
    "coordinates": {
      "lat": 37.60197,
      "lng": -0.98397
    },
    "region": "Southern Europe",
    "population": 211996,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pamplona",
    "name": "Pamplona",
    "country": "Spain",
    "coordinates": {
      "lat": 42.81687,
      "lng": -1.64323
    },
    "region": "Southern Europe",
    "population": 209672,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oulu",
    "name": "Oulu",
    "country": "Finland",
    "coordinates": {
      "lat": 65.01236,
      "lng": 25.46816
    },
    "region": "Northern Europe",
    "population": 209648,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "eindhoven",
    "name": "Eindhoven",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.44083,
      "lng": 5.47778
    },
    "region": "Western Europe",
    "population": 209620,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kielce",
    "name": "Kielce",
    "country": "Poland",
    "coordinates": {
      "lat": 50.87033,
      "lng": 20.62752
    },
    "region": "Eastern Europe",
    "population": 208598,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "portsmouth",
    "name": "Portsmouth",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.79899,
      "lng": -1.09125
    },
    "region": "Western Europe",
    "population": 208100,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jerez-de-la-frontera",
    "name": "Jerez de la Frontera",
    "country": "Spain",
    "coordinates": {
      "lat": 36.68645,
      "lng": -6.13606
    },
    "region": "Southern Europe",
    "population": 207532,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oradea",
    "name": "Oradea",
    "country": "Romania",
    "coordinates": {
      "lat": 47.0458,
      "lng": 21.91833
    },
    "region": "Eastern Europe",
    "population": 206614,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sabadell",
    "name": "Sabadell",
    "country": "Spain",
    "coordinates": {
      "lat": 41.54329,
      "lng": 2.10942
    },
    "region": "Southern Europe",
    "population": 206493,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "móstoles",
    "name": "Móstoles",
    "country": "Spain",
    "coordinates": {
      "lat": 40.32234,
      "lng": -3.86496
    },
    "region": "Southern Europe",
    "population": 206478,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "linz",
    "name": "Linz",
    "country": "Austria",
    "coordinates": {
      "lat": 48.30639,
      "lng": 14.28611
    },
    "region": "Central Europe",
    "population": 204846,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alcalá-de-henares",
    "name": "Alcalá de Henares",
    "country": "Spain",
    "coordinates": {
      "lat": 40.48205,
      "lng": -3.35996
    },
    "region": "Southern Europe",
    "population": 204574,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "trieste",
    "name": "Trieste",
    "country": "Italy",
    "coordinates": {
      "lat": 45.64953,
      "lng": 13.77678
    },
    "region": "Southern Europe",
    "population": 204338,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "padova",
    "name": "Padova",
    "country": "Italy",
    "coordinates": {
      "lat": 45.40797,
      "lng": 11.88586
    },
    "region": "Southern Europe",
    "population": 203725,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "debrecen",
    "name": "Debrecen",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.53167,
      "lng": 21.62444
    },
    "region": "Central Europe",
    "population": 202402,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "favoriten",
    "name": "Favoriten",
    "country": "Austria",
    "coordinates": {
      "lat": 48.16116,
      "lng": 16.38233
    },
    "region": "Central Europe",
    "population": 201882,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "swindon",
    "name": "Swindon",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.55797,
      "lng": -1.78116
    },
    "region": "Western Europe",
    "population": 201669,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brescia",
    "name": "Brescia",
    "country": "Italy",
    "coordinates": {
      "lat": 45.53558,
      "lng": 10.21472
    },
    "region": "Southern Europe",
    "population": 200423,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "charleroi",
    "name": "Charleroi",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.41136,
      "lng": 4.44448
    },
    "region": "Western Europe",
    "population": 200132,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tilburg",
    "name": "Tilburg",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.55551,
      "lng": 5.0913
    },
    "region": "Western Europe",
    "population": 199613,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dudley",
    "name": "Dudley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.5,
      "lng": -2.08333
    },
    "region": "Western Europe",
    "population": 199059,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hagen",
    "name": "Hagen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.36081,
      "lng": 7.47168
    },
    "region": "Western Europe",
    "population": 198972,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gliwice",
    "name": "Gliwice",
    "country": "Poland",
    "coordinates": {
      "lat": 50.29761,
      "lng": 18.67658
    },
    "region": "Eastern Europe",
    "population": 198835,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "toruń",
    "name": "Toruń",
    "country": "Poland",
    "coordinates": {
      "lat": 53.01375,
      "lng": 18.59814
    },
    "region": "Eastern Europe",
    "population": 198613,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aberdeen",
    "name": "Aberdeen",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 57.14369,
      "lng": -2.09814
    },
    "region": "Western Europe",
    "population": 198590,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "taranto",
    "name": "Taranto",
    "country": "Italy",
    "coordinates": {
      "lat": 40.46438,
      "lng": 17.24707
    },
    "region": "Southern Europe",
    "population": 198585,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rostock",
    "name": "Rostock",
    "country": "Germany",
    "coordinates": {
      "lat": 54.0887,
      "lng": 12.14049
    },
    "region": "Western Europe",
    "population": 198293,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "parma",
    "name": "Parma",
    "country": "Italy",
    "coordinates": {
      "lat": 44.79935,
      "lng": 10.32618
    },
    "region": "Southern Europe",
    "population": 198292,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fuenlabrada",
    "name": "Fuenlabrada",
    "country": "Spain",
    "coordinates": {
      "lat": 40.28419,
      "lng": -3.79415
    },
    "region": "Southern Europe",
    "population": 197836,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reims",
    "name": "Reims",
    "country": "France",
    "coordinates": {
      "lat": 49.26526,
      "lng": 4.02853
    },
    "region": "Western Europe",
    "population": 196565,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "burgas",
    "name": "Burgas",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.50606,
      "lng": 27.46781
    },
    "region": "Other",
    "population": 195966,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "turku",
    "name": "Turku",
    "country": "Finland",
    "coordinates": {
      "lat": 60.45148,
      "lng": 22.26869
    },
    "region": "Northern Europe",
    "population": 195301,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "liège",
    "name": "Liège",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.63373,
      "lng": 5.56749
    },
    "region": "Western Europe",
    "population": 195278,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "prato",
    "name": "Prato",
    "country": "Italy",
    "coordinates": {
      "lat": 43.8805,
      "lng": 11.09699
    },
    "region": "Southern Europe",
    "population": 195089,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kassel",
    "name": "Kassel",
    "country": "Germany",
    "coordinates": {
      "lat": 51.31667,
      "lng": 9.5
    },
    "region": "Western Europe",
    "population": 194501,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zabrze",
    "name": "Zabrze",
    "country": "Poland",
    "coordinates": {
      "lat": 50.32492,
      "lng": 18.78576
    },
    "region": "Eastern Europe",
    "population": 192177,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cork",
    "name": "Cork",
    "country": "Ireland",
    "coordinates": {
      "lat": 51.89797,
      "lng": -8.47061
    },
    "region": "Western Europe",
    "population": 190384,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vantaa",
    "name": "Vantaa",
    "country": "Finland",
    "coordinates": {
      "lat": 60.29414,
      "lng": 25.04099
    },
    "region": "Northern Europe",
    "population": 190058,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bytom",
    "name": "Bytom",
    "country": "Poland",
    "coordinates": {
      "lat": 50.34802,
      "lng": 18.93282
    },
    "region": "Eastern Europe",
    "population": 189186,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "almería",
    "name": "Almería",
    "country": "Spain",
    "coordinates": {
      "lat": 36.83814,
      "lng": -2.45974
    },
    "region": "Southern Europe",
    "population": 188810,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sutton",
    "name": "Sutton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.35,
      "lng": -0.2
    },
    "region": "Western Europe",
    "population": 187600,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "donaustadt",
    "name": "Donaustadt",
    "country": "Austria",
    "coordinates": {
      "lat": 48.2333,
      "lng": 16.46002
    },
    "region": "Central Europe",
    "population": 187007,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leganés",
    "name": "Leganés",
    "country": "Spain",
    "coordinates": {
      "lat": 40.32718,
      "lng": -3.7635
    },
    "region": "Southern Europe",
    "population": 186066,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "le-havre",
    "name": "Le Havre",
    "country": "France",
    "coordinates": {
      "lat": 49.49346,
      "lng": 0.10785
    },
    "region": "Western Europe",
    "population": 185972,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "donostia-/-san-sebastián",
    "name": "Donostia / San Sebastián",
    "country": "Spain",
    "coordinates": {
      "lat": 43.31283,
      "lng": -1.97499
    },
    "region": "Southern Europe",
    "population": 185357,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "modena",
    "name": "Modena",
    "country": "Italy",
    "coordinates": {
      "lat": 44.64783,
      "lng": 10.92539
    },
    "region": "Southern Europe",
    "population": 184732,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "genève",
    "name": "Genève",
    "country": "Switzerland",
    "coordinates": {
      "lat": 46.20222,
      "lng": 6.14569
    },
    "region": "Central Europe",
    "population": 183981,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cergy-pontoise",
    "name": "Cergy-Pontoise",
    "country": "France",
    "coordinates": {
      "lat": 49.03894,
      "lng": 2.07805
    },
    "region": "Western Europe",
    "population": 183430,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "st-helens",
    "name": "St Helens",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.45,
      "lng": -2.73333
    },
    "region": "Western Europe",
    "population": 183200,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sants-montjuïc",
    "name": "Sants-Montjuïc",
    "country": "Spain",
    "coordinates": {
      "lat": 41.37263,
      "lng": 2.1546
    },
    "region": "Southern Europe",
    "population": 183120,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reggio-calabria",
    "name": "Reggio Calabria",
    "country": "Italy",
    "coordinates": {
      "lat": 38.11047,
      "lng": 15.66129
    },
    "region": "Southern Europe",
    "population": 182455,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "potsdam",
    "name": "Potsdam",
    "country": "Germany",
    "coordinates": {
      "lat": 52.39886,
      "lng": 13.06566
    },
    "region": "Western Europe",
    "population": 182112,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "odense",
    "name": "Odense",
    "country": "Denmark",
    "coordinates": {
      "lat": 55.39594,
      "lng": 10.38831
    },
    "region": "Northern Europe",
    "population": 180863,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "crawley",
    "name": "Crawley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.11303,
      "lng": -0.18312
    },
    "region": "Western Europe",
    "population": 180508,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "castelló-de-la-plana",
    "name": "Castelló de la Plana",
    "country": "Spain",
    "coordinates": {
      "lat": 39.98567,
      "lng": -0.04935
    },
    "region": "Southern Europe",
    "population": 180005,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "praga-południe",
    "name": "Praga Południe",
    "country": "Poland",
    "coordinates": {
      "lat": 52.24424,
      "lng": 21.08545
    },
    "region": "Eastern Europe",
    "population": 179836,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saarbrücken",
    "name": "Saarbrücken",
    "country": "Germany",
    "coordinates": {
      "lat": 49.23262,
      "lng": 7.00982
    },
    "region": "Western Europe",
    "population": 179349,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hamm",
    "name": "Hamm",
    "country": "Germany",
    "coordinates": {
      "lat": 51.68033,
      "lng": 7.82089
    },
    "region": "Western Europe",
    "population": 178967,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "burgos",
    "name": "Burgos",
    "country": "Spain",
    "coordinates": {
      "lat": 42.34106,
      "lng": -3.70184
    },
    "region": "Southern Europe",
    "population": 178966,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "amadora",
    "name": "Amadora",
    "country": "Portugal",
    "coordinates": {
      "lat": 38.75382,
      "lng": -9.23083
    },
    "region": "Southern Europe",
    "population": 178858,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ipswich",
    "name": "Ipswich",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.05917,
      "lng": 1.15545
    },
    "region": "Western Europe",
    "population": 178835,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "uppsala",
    "name": "Uppsala",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.85882,
      "lng": 17.63889
    },
    "region": "Northern Europe",
    "population": 177074,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bielsko-biala",
    "name": "Bielsko-Biala",
    "country": "Poland",
    "coordinates": {
      "lat": 49.82245,
      "lng": 19.04686
    },
    "region": "Eastern Europe",
    "population": 176515,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "almere-stad",
    "name": "Almere Stad",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.37025,
      "lng": 5.21413
    },
    "region": "Western Europe",
    "population": 176432,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saint-étienne",
    "name": "Saint-Étienne",
    "country": "France",
    "coordinates": {
      "lat": 45.43389,
      "lng": 4.39
    },
    "region": "Western Europe",
    "population": 176280,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wigan",
    "name": "Wigan",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.54296,
      "lng": -2.63706
    },
    "region": "Western Europe",
    "population": 175405,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "croydon",
    "name": "Croydon",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.38333,
      "lng": -0.1
    },
    "region": "Western Europe",
    "population": 173314,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "warrington",
    "name": "Warrington",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.39254,
      "lng": -2.58024
    },
    "region": "Western Europe",
    "population": 172330,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "klaipėda",
    "name": "Klaipėda",
    "country": "Lithuania",
    "coordinates": {
      "lat": 55.7068,
      "lng": 21.13912
    },
    "region": "Northern Europe",
    "population": 172292,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "walsall",
    "name": "Walsall",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.58528,
      "lng": -1.98396
    },
    "region": "Western Europe",
    "population": 172141,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "herne",
    "name": "Herne",
    "country": "Germany",
    "coordinates": {
      "lat": 51.5388,
      "lng": 7.22572
    },
    "region": "Western Europe",
    "population": 172108,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "santander",
    "name": "Santander",
    "country": "Spain",
    "coordinates": {
      "lat": 43.46472,
      "lng": -3.80444
    },
    "region": "Southern Europe",
    "population": 172044,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mansfield",
    "name": "Mansfield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.13333,
      "lng": -1.2
    },
    "region": "Western Europe",
    "population": 171958,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reggio-nell'emilia",
    "name": "Reggio nell'Emilia",
    "country": "Italy",
    "coordinates": {
      "lat": 44.69825,
      "lng": 10.63125
    },
    "region": "Southern Europe",
    "population": 171944,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "olsztyn",
    "name": "Olsztyn",
    "country": "Poland",
    "coordinates": {
      "lat": 53.77995,
      "lng": 20.49416
    },
    "region": "Eastern Europe",
    "population": 171803,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bacău",
    "name": "Bacău",
    "country": "Romania",
    "coordinates": {
      "lat": 46.56718,
      "lng": 26.91384
    },
    "region": "Eastern Europe",
    "population": 171396,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mülheim",
    "name": "Mülheim",
    "country": "Germany",
    "coordinates": {
      "lat": 51.43218,
      "lng": 6.87967
    },
    "region": "Western Europe",
    "population": 170921,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sunderland",
    "name": "Sunderland",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.90465,
      "lng": -1.38222
    },
    "region": "Western Europe",
    "population": 170134,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "albacete",
    "name": "Albacete",
    "country": "Spain",
    "coordinates": {
      "lat": 38.99424,
      "lng": -1.85643
    },
    "region": "Southern Europe",
    "population": 169716,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "harburg",
    "name": "Harburg",
    "country": "Germany",
    "coordinates": {
      "lat": 53.46057,
      "lng": 9.98388
    },
    "region": "Western Europe",
    "population": 169221,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "arad",
    "name": "Arad",
    "country": "Romania",
    "coordinates": {
      "lat": 46.18333,
      "lng": 21.31667
    },
    "region": "Eastern Europe",
    "population": 169065,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pilsen",
    "name": "Pilsen",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.74747,
      "lng": 13.37759
    },
    "region": "Central Europe",
    "population": 168733,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "toulon",
    "name": "Toulon",
    "country": "France",
    "coordinates": {
      "lat": 43.12442,
      "lng": 5.92836
    },
    "region": "Western Europe",
    "population": 168701,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "angers",
    "name": "Angers",
    "country": "France",
    "coordinates": {
      "lat": 47.47156,
      "lng": -0.55202
    },
    "region": "Western Europe",
    "population": 168279,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ilford",
    "name": "Ilford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.55765,
      "lng": 0.07278
    },
    "region": "Western Europe",
    "population": 168168,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "horta-guinardó",
    "name": "Horta-Guinardó",
    "country": "Spain",
    "coordinates": {
      "lat": 41.41849,
      "lng": 2.1677
    },
    "region": "Southern Europe",
    "population": 168092,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pátra",
    "name": "Pátra",
    "country": "Greece",
    "coordinates": {
      "lat": 38.24444,
      "lng": 21.73444
    },
    "region": "Southern Europe",
    "population": 168034,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alcorcón",
    "name": "Alcorcón",
    "country": "Spain",
    "coordinates": {
      "lat": 40.34582,
      "lng": -3.82487
    },
    "region": "Southern Europe",
    "population": 167967,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "breda",
    "name": "Breda",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.58656,
      "lng": 4.77596
    },
    "region": "Western Europe",
    "population": 167673,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piteşti",
    "name": "Piteşti",
    "country": "Romania",
    "coordinates": {
      "lat": 44.85,
      "lng": 24.86667
    },
    "region": "Eastern Europe",
    "population": 167669,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "getafe",
    "name": "Getafe",
    "country": "Spain",
    "coordinates": {
      "lat": 40.30571,
      "lng": -3.73295
    },
    "region": "Southern Europe",
    "population": 167164,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "linköping",
    "name": "Linköping",
    "country": "Sweden",
    "coordinates": {
      "lat": 58.41086,
      "lng": 15.62157
    },
    "region": "Northern Europe",
    "population": 166673,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "osnabrück",
    "name": "Osnabrück",
    "country": "Germany",
    "coordinates": {
      "lat": 52.27264,
      "lng": 8.0498
    },
    "region": "Western Europe",
    "population": 166462,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nou-barris",
    "name": "Nou Barris",
    "country": "Spain",
    "coordinates": {
      "lat": 41.44163,
      "lng": 2.17727
    },
    "region": "Southern Europe",
    "population": 166310,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "slough",
    "name": "Slough",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.50949,
      "lng": -0.59541
    },
    "region": "Western Europe",
    "population": 164793,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "neukölln",
    "name": "Neukölln",
    "country": "Germany",
    "coordinates": {
      "lat": 52.47719,
      "lng": 13.43126
    },
    "region": "Western Europe",
    "population": 164636,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "basel",
    "name": "Basel",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.55839,
      "lng": 7.57327
    },
    "region": "Central Europe",
    "population": 164488,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zenica",
    "name": "Zenica",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 44.20169,
      "lng": 17.90397
    },
    "region": "Southern Europe",
    "population": 164423,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "solingen",
    "name": "Solingen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.17343,
      "lng": 7.0845
    },
    "region": "Western Europe",
    "population": 164359,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piraeus",
    "name": "Piraeus",
    "country": "Greece",
    "coordinates": {
      "lat": 37.94203,
      "lng": 23.64619
    },
    "region": "Southern Europe",
    "population": 163688,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bournemouth",
    "name": "Bournemouth",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.72048,
      "lng": -1.8795
    },
    "region": "Western Europe",
    "population": 163600,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "peterborough",
    "name": "Peterborough",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.57364,
      "lng": -0.24777
    },
    "region": "Western Europe",
    "population": 163379,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ludwigshafen-am-rhein",
    "name": "Ludwigshafen am Rhein",
    "country": "Germany",
    "coordinates": {
      "lat": 49.48121,
      "lng": 8.44641
    },
    "region": "Western Europe",
    "population": 163196,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "floridsdorf",
    "name": "Floridsdorf",
    "country": "Austria",
    "coordinates": {
      "lat": 48.25,
      "lng": 16.4
    },
    "region": "Central Europe",
    "population": 162779,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leverkusen",
    "name": "Leverkusen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.0303,
      "lng": 6.98432
    },
    "region": "Western Europe",
    "population": 162738,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oxford",
    "name": "Oxford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.75222,
      "lng": -1.25596
    },
    "region": "Western Europe",
    "population": 162100,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hortaleza",
    "name": "Hortaleza",
    "country": "Spain",
    "coordinates": {
      "lat": 40.47444,
      "lng": -3.6411
    },
    "region": "Southern Europe",
    "population": 161661,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "szeged",
    "name": "Szeged",
    "country": "Hungary",
    "coordinates": {
      "lat": 46.253,
      "lng": 20.14824
    },
    "region": "Central Europe",
    "population": 160766,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "anderlecht",
    "name": "Anderlecht",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.83619,
      "lng": 4.31454
    },
    "region": "Western Europe",
    "population": 160553,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oldenburg",
    "name": "Oldenburg",
    "country": "Germany",
    "coordinates": {
      "lat": 53.14118,
      "lng": 8.21467
    },
    "region": "Western Europe",
    "population": 159218,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nijmegen",
    "name": "Nijmegen",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.8425,
      "lng": 5.85278
    },
    "region": "Western Europe",
    "population": 158732,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "grenoble",
    "name": "Grenoble",
    "country": "France",
    "coordinates": {
      "lat": 45.17869,
      "lng": 5.71479
    },
    "region": "Western Europe",
    "population": 158552,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rzeszów",
    "name": "Rzeszów",
    "country": "Poland",
    "coordinates": {
      "lat": 50.04132,
      "lng": 21.99901
    },
    "region": "Eastern Europe",
    "population": 158382,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dijon",
    "name": "Dijon",
    "country": "France",
    "coordinates": {
      "lat": 47.31667,
      "lng": 5.01667
    },
    "region": "Western Europe",
    "population": 158002,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "san-blas-canillejas",
    "name": "San Blas-Canillejas",
    "country": "Spain",
    "coordinates": {
      "lat": 40.43893,
      "lng": -3.61537
    },
    "region": "Southern Europe",
    "population": 157367,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salzburg",
    "name": "Salzburg",
    "country": "Austria",
    "coordinates": {
      "lat": 47.79941,
      "lng": 13.04399
    },
    "region": "Central Europe",
    "population": 157245,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "livorno",
    "name": "Livorno",
    "country": "Italy",
    "coordinates": {
      "lat": 43.54427,
      "lng": 10.32615
    },
    "region": "Southern Europe",
    "population": 157017,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "enfield-town",
    "name": "Enfield Town",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.65147,
      "lng": -0.08497
    },
    "region": "Western Europe",
    "population": 156858,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "york",
    "name": "York",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.95763,
      "lng": -1.08271
    },
    "region": "Western Europe",
    "population": 156135,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "örebro",
    "name": "Örebro",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.27412,
      "lng": 15.2066
    },
    "region": "Northern Europe",
    "population": 155989,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salamanca",
    "name": "Salamanca",
    "country": "Spain",
    "coordinates": {
      "lat": 40.96882,
      "lng": -5.66388
    },
    "region": "Southern Europe",
    "population": 155619,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zemun",
    "name": "Zemun",
    "country": "Serbia",
    "coordinates": {
      "lat": 44.8458,
      "lng": 20.40116
    },
    "region": "Southern Europe",
    "population": 155591,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "telford",
    "name": "Telford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.67659,
      "lng": -2.44926
    },
    "region": "Western Europe",
    "population": 155570,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tetuán-de-las-victorias",
    "name": "Tetuán de las Victorias",
    "country": "Spain",
    "coordinates": {
      "lat": 40.45975,
      "lng": -3.6975
    },
    "region": "Southern Europe",
    "population": 155000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "miskolc",
    "name": "Miskolc",
    "country": "Hungary",
    "coordinates": {
      "lat": 48.10306,
      "lng": 20.77806
    },
    "region": "Central Europe",
    "population": 154521,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "enschede",
    "name": "Enschede",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.21833,
      "lng": 6.89583
    },
    "region": "Western Europe",
    "population": 153655,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kreuzberg",
    "name": "Kreuzberg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.49973,
      "lng": 13.40338
    },
    "region": "Western Europe",
    "population": 153135,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "logroño",
    "name": "Logroño",
    "country": "Spain",
    "coordinates": {
      "lat": 42.46667,
      "lng": -2.45
    },
    "region": "Southern Europe",
    "population": 152485,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "neuss",
    "name": "Neuss",
    "country": "Germany",
    "coordinates": {
      "lat": 51.19807,
      "lng": 6.68504
    },
    "region": "Western Europe",
    "population": 152457,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sibiu",
    "name": "Sibiu",
    "country": "Romania",
    "coordinates": {
      "lat": 45.8,
      "lng": 24.15
    },
    "region": "Eastern Europe",
    "population": 151894,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ursynów",
    "name": "Ursynów",
    "country": "Poland",
    "coordinates": {
      "lat": 52.15051,
      "lng": 21.05041
    },
    "region": "Eastern Europe",
    "population": 150668,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "poole",
    "name": "Poole",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.71429,
      "lng": -1.98458
    },
    "region": "Western Europe",
    "population": 150092,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "split",
    "name": "Split",
    "country": "Croatia",
    "coordinates": {
      "lat": 43.50891,
      "lng": 16.43915
    },
    "region": "Southern Europe",
    "population": 149830,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "madrid-centro",
    "name": "Madrid Centro",
    "country": "Spain",
    "coordinates": {
      "lat": 40.41831,
      "lng": -3.70275
    },
    "region": "Southern Europe",
    "population": 149718,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "burnley",
    "name": "Burnley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.8,
      "lng": -2.23333
    },
    "region": "Western Europe",
    "population": 149422,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cagliari",
    "name": "Cagliari",
    "country": "Italy",
    "coordinates": {
      "lat": 39.23054,
      "lng": 9.11917
    },
    "region": "Southern Europe",
    "population": 149257,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "harrow",
    "name": "Harrow",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.57835,
      "lng": -0.33208
    },
    "region": "Western Europe",
    "population": 149246,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "huddersfield",
    "name": "Huddersfield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.64904,
      "lng": -1.78416
    },
    "region": "Western Europe",
    "population": 149017,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "prenzlauer-berg",
    "name": "Prenzlauer Berg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.53878,
      "lng": 13.42443
    },
    "region": "Western Europe",
    "population": 148878,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "arganzuela",
    "name": "Arganzuela",
    "country": "Spain",
    "coordinates": {
      "lat": 40.40021,
      "lng": -3.69618
    },
    "region": "Southern Europe",
    "population": 148797,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rimini",
    "name": "Rimini",
    "country": "Italy",
    "coordinates": {
      "lat": 44.05755,
      "lng": 12.56528
    },
    "region": "Southern Europe",
    "population": 148688,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "badajoz",
    "name": "Badajoz",
    "country": "Spain",
    "coordinates": {
      "lat": 38.87789,
      "lng": -6.97061
    },
    "region": "Southern Europe",
    "population": 148334,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nîmes",
    "name": "Nîmes",
    "country": "France",
    "coordinates": {
      "lat": 43.83665,
      "lng": 4.35788
    },
    "region": "Western Europe",
    "population": 148236,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dundee",
    "name": "Dundee",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 56.46913,
      "lng": -2.97489
    },
    "region": "Western Europe",
    "population": 148210,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sarrià-sant-gervasi",
    "name": "Sarrià-Sant Gervasi",
    "country": "Spain",
    "coordinates": {
      "lat": 41.40104,
      "lng": 2.1394
    },
    "region": "Southern Europe",
    "population": 147912,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "clermont-ferrand",
    "name": "Clermont-Ferrand",
    "country": "France",
    "coordinates": {
      "lat": 45.77969,
      "lng": 3.08682
    },
    "region": "Western Europe",
    "population": 147865,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sant-andreu",
    "name": "Sant Andreu",
    "country": "Spain",
    "coordinates": {
      "lat": 41.43541,
      "lng": 2.18982
    },
    "region": "Southern Europe",
    "population": 147732,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salamanca",
    "name": "Salamanca",
    "country": "Spain",
    "coordinates": {
      "lat": 40.42972,
      "lng": -3.67975
    },
    "region": "Southern Europe",
    "population": 147707,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mestre",
    "name": "Mestre",
    "country": "Italy",
    "coordinates": {
      "lat": 45.49167,
      "lng": 12.24538
    },
    "region": "Southern Europe",
    "population": 147662,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "haarlem",
    "name": "Haarlem",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.38084,
      "lng": 4.63683
    },
    "region": "Western Europe",
    "population": 147590,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kragujevac",
    "name": "Kragujevac",
    "country": "Serbia",
    "coordinates": {
      "lat": 44.01667,
      "lng": 20.91667
    },
    "region": "Southern Europe",
    "population": 147473,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lárisa",
    "name": "Lárisa",
    "country": "Greece",
    "coordinates": {
      "lat": 39.63689,
      "lng": 22.41761
    },
    "region": "Southern Europe",
    "population": 146926,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "târgu-mureş",
    "name": "Târgu-Mureş",
    "country": "Romania",
    "coordinates": {
      "lat": 46.54245,
      "lng": 24.55747
    },
    "region": "Eastern Europe",
    "population": 146863,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aix-en-provence",
    "name": "Aix-en-Provence",
    "country": "France",
    "coordinates": {
      "lat": 43.5283,
      "lng": 5.44973
    },
    "region": "Western Europe",
    "population": 146821,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saint-quentin-en-yvelines",
    "name": "Saint-Quentin-en-Yvelines",
    "country": "France",
    "coordinates": {
      "lat": 48.77186,
      "lng": 2.01891
    },
    "region": "Western Europe",
    "population": 146598,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "blackburn",
    "name": "Blackburn",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.75,
      "lng": -2.48333
    },
    "region": "Western Europe",
    "population": 146521,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ruda-śląska",
    "name": "Ruda Śląska",
    "country": "Poland",
    "coordinates": {
      "lat": 50.2584,
      "lng": 18.85632
    },
    "region": "Eastern Europe",
    "population": 146189,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chamberí",
    "name": "Chamberí",
    "country": "Spain",
    "coordinates": {
      "lat": 40.43404,
      "lng": -3.70379
    },
    "region": "Southern Europe",
    "population": 145934,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cambridge",
    "name": "Cambridge",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.2,
      "lng": 0.11667
    },
    "region": "Western Europe",
    "population": 145674,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pécs",
    "name": "Pécs",
    "country": "Hungary",
    "coordinates": {
      "lat": 46.0725,
      "lng": 18.23083
    },
    "region": "Central Europe",
    "population": 145347,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "blackpool",
    "name": "Blackpool",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.81667,
      "lng": -3.05
    },
    "region": "Western Europe",
    "population": 145007,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brest",
    "name": "Brest",
    "country": "France",
    "coordinates": {
      "lat": 48.39029,
      "lng": -4.48628
    },
    "region": "Western Europe",
    "population": 144899,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stavanger",
    "name": "Stavanger",
    "country": "Norway",
    "coordinates": {
      "lat": 58.97005,
      "lng": 5.73332
    },
    "region": "Northern Europe",
    "population": 144877,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "basildon",
    "name": "Basildon",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.56844,
      "lng": 0.45782
    },
    "region": "Western Europe",
    "population": 144859,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "le-mans",
    "name": "Le Mans",
    "country": "France",
    "coordinates": {
      "lat": 48.0021,
      "lng": 0.20251
    },
    "region": "Western Europe",
    "population": 144515,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jyväskylä",
    "name": "Jyväskylä",
    "country": "Finland",
    "coordinates": {
      "lat": 62.24147,
      "lng": 25.72088
    },
    "region": "Northern Europe",
    "population": 144477,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "huelva",
    "name": "Huelva",
    "country": "Spain",
    "coordinates": {
      "lat": 37.26638,
      "lng": -6.94004
    },
    "region": "Southern Europe",
    "population": 144258,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stara-zagora",
    "name": "Stara Zagora",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.43278,
      "lng": 25.64194
    },
    "region": "Other",
    "population": 143431,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ruse",
    "name": "Ruse",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 43.84872,
      "lng": 25.9534
    },
    "region": "Other",
    "population": 143417,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "heidelberg",
    "name": "Heidelberg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.40768,
      "lng": 8.69079
    },
    "region": "Western Europe",
    "population": 143345,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "norwich",
    "name": "Norwich",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.62783,
      "lng": 1.29834
    },
    "region": "Western Europe",
    "population": 143135,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "amiens",
    "name": "Amiens",
    "country": "France",
    "coordinates": {
      "lat": 49.9,
      "lng": 2.3
    },
    "region": "Western Europe",
    "population": 143086,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aalborg",
    "name": "Aalborg",
    "country": "Denmark",
    "coordinates": {
      "lat": 57.048,
      "lng": 9.9187
    },
    "region": "Northern Europe",
    "population": 142937,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "middlesbrough",
    "name": "Middlesbrough",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.57623,
      "lng": -1.23483
    },
    "region": "Western Europe",
    "population": 142707,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rybnik",
    "name": "Rybnik",
    "country": "Poland",
    "coordinates": {
      "lat": 50.09713,
      "lng": 18.54179
    },
    "region": "Eastern Europe",
    "population": 142510,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tuzla",
    "name": "Tuzla",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 44.53842,
      "lng": 18.66709
    },
    "region": "Southern Europe",
    "population": 142486,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "paderborn",
    "name": "Paderborn",
    "country": "Germany",
    "coordinates": {
      "lat": 51.71905,
      "lng": 8.75439
    },
    "region": "Western Europe",
    "population": 142161,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "arnhem",
    "name": "Arnhem",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.98,
      "lng": 5.91111
    },
    "region": "Western Europe",
    "population": 141674,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tours",
    "name": "Tours",
    "country": "France",
    "coordinates": {
      "lat": 47.39484,
      "lng": 0.70398
    },
    "region": "Western Europe",
    "population": 141621,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bolton",
    "name": "Bolton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.58333,
      "lng": -2.43333
    },
    "region": "Western Europe",
    "population": 141331,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "usera",
    "name": "Usera",
    "country": "Spain",
    "coordinates": {
      "lat": 40.38866,
      "lng": -3.70035
    },
    "region": "Southern Europe",
    "population": 141189,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "limoges",
    "name": "Limoges",
    "country": "France",
    "coordinates": {
      "lat": 45.83362,
      "lng": 1.24759
    },
    "region": "Western Europe",
    "population": 141176,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wola",
    "name": "Wola",
    "country": "Poland",
    "coordinates": {
      "lat": 52.23477,
      "lng": 20.96004
    },
    "region": "Eastern Europe",
    "population": 140958,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "darmstadt",
    "name": "Darmstadt",
    "country": "Germany",
    "coordinates": {
      "lat": 49.87167,
      "lng": 8.65027
    },
    "region": "Western Europe",
    "population": 140385,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zaanstad",
    "name": "Zaanstad",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.45313,
      "lng": 4.81356
    },
    "region": "Western Europe",
    "population": 140085,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chamartín",
    "name": "Chamartín",
    "country": "Spain",
    "coordinates": {
      "lat": 40.46206,
      "lng": -3.6766
    },
    "region": "Southern Europe",
    "population": 140000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "peristéri",
    "name": "Peristéri",
    "country": "Greece",
    "coordinates": {
      "lat": 38.01539,
      "lng": 23.69187
    },
    "region": "Southern Europe",
    "population": 139981,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "amersfoort",
    "name": "Amersfoort",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.155,
      "lng": 5.3875
    },
    "region": "Western Europe",
    "population": 139914,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sollentuna",
    "name": "Sollentuna",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.42804,
      "lng": 17.95093
    },
    "region": "Northern Europe",
    "population": 139606,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lausanne",
    "name": "Lausanne",
    "country": "Switzerland",
    "coordinates": {
      "lat": 46.516,
      "lng": 6.63282
    },
    "region": "Central Europe",
    "population": 139111,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stockport",
    "name": "Stockport",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.40979,
      "lng": -2.15761
    },
    "region": "Western Europe",
    "population": 139052,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xi.-kerület",
    "name": "Budapest XI. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.47603,
      "lng": 19.03605
    },
    "region": "Central Europe",
    "population": 139049,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lleida",
    "name": "Lleida",
    "country": "Spain",
    "coordinates": {
      "lat": 41.61674,
      "lng": 0.62218
    },
    "region": "Southern Europe",
    "population": 137856,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "irákleion",
    "name": "Irákleion",
    "country": "Greece",
    "coordinates": {
      "lat": 35.32787,
      "lng": 25.14341
    },
    "region": "Southern Europe",
    "population": 137154,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "foggia",
    "name": "Foggia",
    "country": "Italy",
    "coordinates": {
      "lat": 41.45845,
      "lng": 15.55188
    },
    "region": "Southern Europe",
    "population": 137032,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "apeldoorn",
    "name": "Apeldoorn",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.21,
      "lng": 5.96944
    },
    "region": "Western Europe",
    "population": 136670,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "baia-mare",
    "name": "Baia Mare",
    "country": "Romania",
    "coordinates": {
      "lat": 47.65729,
      "lng": 23.56808
    },
    "region": "Eastern Europe",
    "population": 136553,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "west-bromwich",
    "name": "West Bromwich",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.51868,
      "lng": -1.9945
    },
    "region": "Western Europe",
    "population": 135618,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bielany",
    "name": "Bielany",
    "country": "Poland",
    "coordinates": {
      "lat": 52.29242,
      "lng": 20.93531
    },
    "region": "Eastern Europe",
    "population": 134854,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marbella",
    "name": "Marbella",
    "country": "Spain",
    "coordinates": {
      "lat": 36.51543,
      "lng": -4.88583
    },
    "region": "Southern Europe",
    "population": 134623,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "'s-hertogenbosch",
    "name": "'s-Hertogenbosch",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.69917,
      "lng": 5.30417
    },
    "region": "Western Europe",
    "population": 134520,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "śródmieście",
    "name": "Śródmieście",
    "country": "Poland",
    "coordinates": {
      "lat": 52.22904,
      "lng": 21.01644
    },
    "region": "Eastern Europe",
    "population": 134306,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "león",
    "name": "León",
    "country": "Spain",
    "coordinates": {
      "lat": 42.60003,
      "lng": -5.57032
    },
    "region": "Southern Europe",
    "population": 134305,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "würzburg",
    "name": "Würzburg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.79391,
      "lng": 9.95121
    },
    "region": "Western Europe",
    "population": 133731,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hastings",
    "name": "Hastings",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.85568,
      "lng": 0.58009
    },
    "region": "Western Europe",
    "population": 133422,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "high-wycombe",
    "name": "High Wycombe",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.62907,
      "lng": -0.74934
    },
    "region": "Western Europe",
    "population": 133204,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "schaerbeek",
    "name": "Schaerbeek",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.86935,
      "lng": 4.37737
    },
    "region": "Western Europe",
    "population": 132761,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hoofddorp",
    "name": "Hoofddorp",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.3025,
      "lng": 4.68889
    },
    "region": "Western Europe",
    "population": 132734,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "innsbruck",
    "name": "Innsbruck",
    "country": "Austria",
    "coordinates": {
      "lat": 47.26266,
      "lng": 11.39454
    },
    "region": "Central Europe",
    "population": 132493,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gloucester",
    "name": "Gloucester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.86568,
      "lng": -2.2431
    },
    "region": "Western Europe",
    "population": 132416,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tarragona",
    "name": "Tarragona",
    "country": "Spain",
    "coordinates": {
      "lat": 41.11905,
      "lng": 1.24544
    },
    "region": "Southern Europe",
    "population": 132299,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ferrara",
    "name": "Ferrara",
    "country": "Italy",
    "coordinates": {
      "lat": 44.83804,
      "lng": 11.62057
    },
    "region": "Southern Europe",
    "population": 132009,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "villeurbanne",
    "name": "Villeurbanne",
    "country": "France",
    "coordinates": {
      "lat": 45.76601,
      "lng": 4.8795
    },
    "region": "Western Europe",
    "population": 131445,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "buzău",
    "name": "Buzău",
    "country": "Romania",
    "coordinates": {
      "lat": 45.15,
      "lng": 26.83333
    },
    "region": "Eastern Europe",
    "population": 130954,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "exeter",
    "name": "Exeter",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.7236,
      "lng": -3.52751
    },
    "region": "Western Europe",
    "population": 130709,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "umeå",
    "name": "Umeå",
    "country": "Sweden",
    "coordinates": {
      "lat": 63.82842,
      "lng": 20.25972
    },
    "region": "Northern Europe",
    "population": 130224,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zugló",
    "name": "Zugló",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.51758,
      "lng": 19.10549
    },
    "region": "Central Europe",
    "population": 130000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tychy",
    "name": "Tychy",
    "country": "Poland",
    "coordinates": {
      "lat": 50.13717,
      "lng": 18.96641
    },
    "region": "Eastern Europe",
    "population": 130000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tottenham",
    "name": "Tottenham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.60373,
      "lng": -0.06794
    },
    "region": "Western Europe",
    "population": 130000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salford",
    "name": "Salford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.48771,
      "lng": -2.29042
    },
    "region": "Western Europe",
    "population": 129794,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "newcastle-under-lyme",
    "name": "Newcastle under Lyme",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53,
      "lng": -2.23333
    },
    "region": "Western Europe",
    "population": 129441,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "acilia-castel-fusano-ostia-antica",
    "name": "Acilia-Castel Fusano-Ostia Antica",
    "country": "Italy",
    "coordinates": {
      "lat": 41.76337,
      "lng": 12.33078
    },
    "region": "Southern Europe",
    "population": 129362,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "charlottenburg",
    "name": "Charlottenburg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.51667,
      "lng": 13.28333
    },
    "region": "Western Europe",
    "population": 129359,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "győr",
    "name": "Győr",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.68333,
      "lng": 17.63512
    },
    "region": "Central Europe",
    "population": 129301,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "regensburg",
    "name": "Regensburg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.01513,
      "lng": 12.10161
    },
    "region": "Western Europe",
    "population": 129151,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "białołeka",
    "name": "Białołeka",
    "country": "Poland",
    "coordinates": {
      "lat": 52.32127,
      "lng": 20.97204
    },
    "region": "Eastern Europe",
    "population": 129106,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "besançon",
    "name": "Besançon",
    "country": "France",
    "coordinates": {
      "lat": 47.24878,
      "lng": 6.01815
    },
    "region": "Western Europe",
    "population": 128426,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "västerås",
    "name": "Västerås",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.61617,
      "lng": 16.55276
    },
    "region": "Northern Europe",
    "population": 127799,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "opole",
    "name": "Opole",
    "country": "Poland",
    "coordinates": {
      "lat": 50.67211,
      "lng": 17.92533
    },
    "region": "Eastern Europe",
    "population": 127676,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "elbląg",
    "name": "Elbląg",
    "country": "Poland",
    "coordinates": {
      "lat": 54.1522,
      "lng": 19.40884
    },
    "region": "Eastern Europe",
    "population": 127558,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "płock",
    "name": "Płock",
    "country": "Poland",
    "coordinates": {
      "lat": 52.54682,
      "lng": 19.70638
    },
    "region": "Eastern Europe",
    "population": 127474,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wałbrzych",
    "name": "Wałbrzych",
    "country": "Poland",
    "coordinates": {
      "lat": 50.77141,
      "lng": 16.28432
    },
    "region": "Eastern Europe",
    "population": 127431,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "södermalm",
    "name": "Södermalm",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.31278,
      "lng": 18.07577
    },
    "region": "Northern Europe",
    "population": 127323,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "villaverde",
    "name": "Villaverde",
    "country": "Spain",
    "coordinates": {
      "lat": 40.35,
      "lng": -3.7
    },
    "region": "Southern Europe",
    "population": 126802,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cadiz",
    "name": "Cadiz",
    "country": "Spain",
    "coordinates": {
      "lat": 36.52672,
      "lng": -6.2891
    },
    "region": "Southern Europe",
    "population": 126766,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "solihull",
    "name": "Solihull",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.41426,
      "lng": -1.78094
    },
    "region": "Western Europe",
    "population": 126577,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "retiro",
    "name": "Retiro",
    "country": "Spain",
    "coordinates": {
      "lat": 40.41317,
      "lng": -3.68307
    },
    "region": "Southern Europe",
    "population": 126058,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salerno",
    "name": "Salerno",
    "country": "Italy",
    "coordinates": {
      "lat": 40.67545,
      "lng": 14.79328
    },
    "region": "Southern Europe",
    "population": 125797,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "watford",
    "name": "Watford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.65531,
      "lng": -0.39602
    },
    "region": "Western Europe",
    "population": 125707,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saint-peters",
    "name": "Saint Peters",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.36667,
      "lng": 1.41667
    },
    "region": "Western Europe",
    "population": 125370,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gorzów-wielkopolski",
    "name": "Gorzów Wielkopolski",
    "country": "Poland",
    "coordinates": {
      "lat": 52.73679,
      "lng": 15.22878
    },
    "region": "Eastern Europe",
    "population": 124430,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "monza",
    "name": "Monza",
    "country": "Italy",
    "coordinates": {
      "lat": 45.58005,
      "lng": 9.27246
    },
    "region": "Southern Europe",
    "population": 124398,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "targówek",
    "name": "Targówek",
    "country": "Poland",
    "coordinates": {
      "lat": 52.29185,
      "lng": 21.04845
    },
    "region": "Eastern Europe",
    "population": 124279,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "metz",
    "name": "Metz",
    "country": "France",
    "coordinates": {
      "lat": 49.11911,
      "lng": 6.17269
    },
    "region": "Western Europe",
    "population": 123914,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-iii.-kerület",
    "name": "Budapest III. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.54157,
      "lng": 19.04501
    },
    "region": "Central Europe",
    "population": 123723,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wolfsburg",
    "name": "Wolfsburg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.42452,
      "lng": 10.7815
    },
    "region": "Western Europe",
    "population": 123064,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dos-hermanas",
    "name": "Dos Hermanas",
    "country": "Spain",
    "coordinates": {
      "lat": 37.28287,
      "lng": -5.92088
    },
    "region": "Southern Europe",
    "population": 122943,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "schöneberg",
    "name": "Schöneberg",
    "country": "Germany",
    "coordinates": {
      "lat": 52.46667,
      "lng": 13.35
    },
    "region": "Western Europe",
    "population": 122658,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "recklinghausen",
    "name": "Recklinghausen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.61379,
      "lng": 7.19738
    },
    "region": "Western Europe",
    "population": 122438,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "maastricht",
    "name": "Maastricht",
    "country": "Netherlands",
    "coordinates": {
      "lat": 50.84833,
      "lng": 5.68889
    },
    "region": "Western Europe",
    "population": 122378,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "burton-upon-trent",
    "name": "Burton upon Trent",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.80728,
      "lng": -1.64263
    },
    "region": "Western Europe",
    "population": 122199,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "göttingen",
    "name": "Göttingen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.53443,
      "lng": 9.93228
    },
    "region": "Western Europe",
    "population": 122149,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "durrës",
    "name": "Durrës",
    "country": "Albania",
    "coordinates": {
      "lat": 41.32355,
      "lng": 19.45469
    },
    "region": "Southern Europe",
    "population": 122034,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "colchester",
    "name": "Colchester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.88921,
      "lng": 0.90421
    },
    "region": "Western Europe",
    "population": 121859,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mataró",
    "name": "Mataró",
    "country": "Spain",
    "coordinates": {
      "lat": 41.54211,
      "lng": 2.4445
    },
    "region": "Southern Europe",
    "population": 121722,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bern",
    "name": "Bern",
    "country": "Switzerland",
    "coordinates": {
      "lat": 46.94809,
      "lng": 7.44744
    },
    "region": "Central Europe",
    "population": 121631,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "siracusa",
    "name": "Siracusa",
    "country": "Italy",
    "coordinates": {
      "lat": 37.07542,
      "lng": 15.28664
    },
    "region": "Southern Europe",
    "population": 121605,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kuopio",
    "name": "Kuopio",
    "country": "Finland",
    "coordinates": {
      "lat": 62.89238,
      "lng": 27.67703
    },
    "region": "Northern Europe",
    "population": 121557,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gràcia",
    "name": "Gràcia",
    "country": "Spain",
    "coordinates": {
      "lat": 41.40237,
      "lng": 2.15641
    },
    "region": "Southern Europe",
    "population": 121502,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "braga",
    "name": "Braga",
    "country": "Portugal",
    "coordinates": {
      "lat": 41.55032,
      "lng": -8.42005
    },
    "region": "Southern Europe",
    "population": 121394,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bergamo",
    "name": "Bergamo",
    "country": "Italy",
    "coordinates": {
      "lat": 45.69601,
      "lng": 9.66721
    },
    "region": "Southern Europe",
    "population": 121200,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "heilbronn",
    "name": "Heilbronn",
    "country": "Germany",
    "coordinates": {
      "lat": 49.13995,
      "lng": 9.22054
    },
    "region": "Western Europe",
    "population": 120733,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "trento",
    "name": "Trento",
    "country": "Italy",
    "coordinates": {
      "lat": 46.06787,
      "lng": 11.12108
    },
    "region": "Southern Europe",
    "population": 120709,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ingolstadt",
    "name": "Ingolstadt",
    "country": "Germany",
    "coordinates": {
      "lat": 48.76508,
      "lng": 11.42372
    },
    "region": "Western Europe",
    "population": 120658,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ulm",
    "name": "Ulm",
    "country": "Germany",
    "coordinates": {
      "lat": 48.39841,
      "lng": 9.99155
    },
    "region": "Western Europe",
    "population": 120451,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "włocławek",
    "name": "Włocławek",
    "country": "Poland",
    "coordinates": {
      "lat": 52.64817,
      "lng": 19.0678
    },
    "region": "Eastern Europe",
    "population": 120339,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "perugia",
    "name": "Perugia",
    "country": "Italy",
    "coordinates": {
      "lat": 43.1122,
      "lng": 12.38878
    },
    "region": "Southern Europe",
    "population": 120137,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lahti",
    "name": "Lahti",
    "country": "Finland",
    "coordinates": {
      "lat": 60.98267,
      "lng": 25.66151
    },
    "region": "Northern Europe",
    "population": 120093,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bottrop",
    "name": "Bottrop",
    "country": "Germany",
    "coordinates": {
      "lat": 51.52392,
      "lng": 6.9285
    },
    "region": "Western Europe",
    "population": 119909,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leiden",
    "name": "Leiden",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.15833,
      "lng": 4.49306
    },
    "region": "Western Europe",
    "population": 119713,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bergedorf",
    "name": "Bergedorf",
    "country": "Germany",
    "coordinates": {
      "lat": 53.48462,
      "lng": 10.22904
    },
    "region": "Western Europe",
    "population": 119665,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pescara",
    "name": "Pescara",
    "country": "Italy",
    "coordinates": {
      "lat": 42.4584,
      "lng": 14.20283
    },
    "region": "Southern Europe",
    "population": 119554,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pforzheim",
    "name": "Pforzheim",
    "country": "Germany",
    "coordinates": {
      "lat": 48.88436,
      "lng": 8.69892
    },
    "region": "Western Europe",
    "population": 119313,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dordrecht",
    "name": "Dordrecht",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.81,
      "lng": 4.67361
    },
    "region": "Western Europe",
    "population": 119260,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "offenbach",
    "name": "Offenbach",
    "country": "Germany",
    "coordinates": {
      "lat": 50.10061,
      "lng": 8.76647
    },
    "region": "Western Europe",
    "population": 119192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "santa-coloma-de-gramenet",
    "name": "Santa Coloma de Gramenet",
    "country": "Spain",
    "coordinates": {
      "lat": 41.45152,
      "lng": 2.2081
    },
    "region": "Southern Europe",
    "population": 118821,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brugge",
    "name": "Brugge",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.20892,
      "lng": 3.22424
    },
    "region": "Western Europe",
    "population": 118509,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zielona-góra",
    "name": "Zielona Góra",
    "country": "Poland",
    "coordinates": {
      "lat": 51.93548,
      "lng": 15.50643
    },
    "region": "Eastern Europe",
    "population": 118433,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dąbrowa-górnicza",
    "name": "Dąbrowa Górnicza",
    "country": "Poland",
    "coordinates": {
      "lat": 50.33394,
      "lng": 19.20479
    },
    "region": "Eastern Europe",
    "population": 118285,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "eastbourne",
    "name": "Eastbourne",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.76871,
      "lng": 0.28453
    },
    "region": "Western Europe",
    "population": 118219,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "torrejón-de-ardoz",
    "name": "Torrejón de Ardoz",
    "country": "Spain",
    "coordinates": {
      "lat": 40.45535,
      "lng": -3.46973
    },
    "region": "Southern Europe",
    "population": 118162,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "friedrichshain",
    "name": "Friedrichshain",
    "country": "Germany",
    "coordinates": {
      "lat": 52.51559,
      "lng": 13.45482
    },
    "region": "Western Europe",
    "population": 117829,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tarnów",
    "name": "Tarnów",
    "country": "Poland",
    "coordinates": {
      "lat": 50.01381,
      "lng": 20.98698
    },
    "region": "Eastern Europe",
    "population": 117799,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nyíregyháza",
    "name": "Nyíregyháza",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.95539,
      "lng": 21.71671
    },
    "region": "Central Europe",
    "population": 117689,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rotherham",
    "name": "Rotherham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.43012,
      "lng": -1.35678
    },
    "region": "Western Europe",
    "population": 117618,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "remscheid",
    "name": "Remscheid",
    "country": "Germany",
    "coordinates": {
      "lat": 51.17983,
      "lng": 7.1925
    },
    "region": "Western Europe",
    "population": 117118,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "setúbal",
    "name": "Setúbal",
    "country": "Portugal",
    "coordinates": {
      "lat": 38.5244,
      "lng": -8.8882
    },
    "region": "Southern Europe",
    "population": 117110,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "čačak",
    "name": "Čačak",
    "country": "Serbia",
    "coordinates": {
      "lat": 43.89139,
      "lng": 20.34972
    },
    "region": "Southern Europe",
    "population": 117072,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "forlì",
    "name": "Forlì",
    "country": "Italy",
    "coordinates": {
      "lat": 44.22177,
      "lng": 12.04144
    },
    "region": "Southern Europe",
    "population": 116696,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "moncloa-aravaca",
    "name": "Moncloa-Aravaca",
    "country": "Spain",
    "coordinates": {
      "lat": 40.43547,
      "lng": -3.7317
    },
    "region": "Southern Europe",
    "population": 116531,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cheltenham",
    "name": "Cheltenham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.90006,
      "lng": -2.07972
    },
    "region": "Western Europe",
    "population": 116447,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "orléans",
    "name": "Orléans",
    "country": "France",
    "coordinates": {
      "lat": 47.90289,
      "lng": 1.90389
    },
    "region": "Western Europe",
    "population": 116269,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "algeciras",
    "name": "Algeciras",
    "country": "Spain",
    "coordinates": {
      "lat": 36.13326,
      "lng": -5.45051
    },
    "region": "Southern Europe",
    "population": 116209,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zoetermeer",
    "name": "Zoetermeer",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.0575,
      "lng": 4.49306
    },
    "region": "Western Europe",
    "population": 115845,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "parla",
    "name": "Parla",
    "country": "Spain",
    "coordinates": {
      "lat": 40.23604,
      "lng": -3.76752
    },
    "region": "Southern Europe",
    "population": 115611,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "botoşani",
    "name": "Botoşani",
    "country": "Romania",
    "coordinates": {
      "lat": 47.75,
      "lng": 26.66667
    },
    "region": "Eastern Europe",
    "population": 114783,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "doncaster",
    "name": "Doncaster",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.52285,
      "lng": -1.13116
    },
    "region": "Western Europe",
    "population": 113566,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bremerhaven",
    "name": "Bremerhaven",
    "country": "Germany",
    "coordinates": {
      "lat": 53.53615,
      "lng": 8.59298
    },
    "region": "Western Europe",
    "population": 113557,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xiii.-kerület",
    "name": "Budapest XIII. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.52978,
      "lng": 19.08068
    },
    "region": "Central Europe",
    "population": 113531,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nippes",
    "name": "Nippes",
    "country": "Germany",
    "coordinates": {
      "lat": 50.96545,
      "lng": 6.95314
    },
    "region": "Western Europe",
    "population": 113487,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jaén",
    "name": "Jaén",
    "country": "Spain",
    "coordinates": {
      "lat": 37.76922,
      "lng": -3.79028
    },
    "region": "Southern Europe",
    "population": 113457,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chorzów",
    "name": "Chorzów",
    "country": "Poland",
    "coordinates": {
      "lat": 50.30582,
      "lng": 18.9742
    },
    "region": "Eastern Europe",
    "population": 113430,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "porz-am-rhein",
    "name": "Porz am Rhein",
    "country": "Germany",
    "coordinates": {
      "lat": 50.88637,
      "lng": 7.0583
    },
    "region": "Western Europe",
    "population": 113415,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chesterfield",
    "name": "Chesterfield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.25,
      "lng": -1.41667
    },
    "region": "Western Europe",
    "population": 113057,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reutlingen",
    "name": "Reutlingen",
    "country": "Germany",
    "coordinates": {
      "lat": 48.49144,
      "lng": 9.20427
    },
    "region": "Western Europe",
    "population": 112627,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "satu-mare",
    "name": "Satu Mare",
    "country": "Romania",
    "coordinates": {
      "lat": 47.79926,
      "lng": 22.86255
    },
    "region": "Eastern Europe",
    "population": 112490,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fürth",
    "name": "Fürth",
    "country": "Germany",
    "coordinates": {
      "lat": 49.47593,
      "lng": 10.98856
    },
    "region": "Western Europe",
    "population": 112025,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vicenza",
    "name": "Vicenza",
    "country": "Italy",
    "coordinates": {
      "lat": 45.54672,
      "lng": 11.5475
    },
    "region": "Southern Europe",
    "population": 111980,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zwolle",
    "name": "Zwolle",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.5125,
      "lng": 6.09444
    },
    "region": "Western Europe",
    "population": 111805,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "daugavpils",
    "name": "Daugavpils",
    "country": "Latvia",
    "coordinates": {
      "lat": 55.88333,
      "lng": 26.53333
    },
    "region": "Northern Europe",
    "population": 111564,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chelmsford",
    "name": "Chelmsford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.73575,
      "lng": 0.46958
    },
    "region": "Western Europe",
    "population": 111511,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marzahn",
    "name": "Marzahn",
    "country": "Germany",
    "coordinates": {
      "lat": 52.54525,
      "lng": 13.56983
    },
    "region": "Western Europe",
    "population": 111508,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mulhouse",
    "name": "Mulhouse",
    "country": "France",
    "coordinates": {
      "lat": 47.75205,
      "lng": 7.32866
    },
    "region": "Western Europe",
    "population": 111430,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "montreuil",
    "name": "Montreuil",
    "country": "France",
    "coordinates": {
      "lat": 48.86415,
      "lng": 2.44322
    },
    "region": "Western Europe",
    "population": 111240,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "terni",
    "name": "Terni",
    "country": "Italy",
    "coordinates": {
      "lat": 42.56335,
      "lng": 12.64329
    },
    "region": "Southern Europe",
    "population": 111189,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "namur",
    "name": "Namur",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.4669,
      "lng": 4.86746
    },
    "region": "Western Europe",
    "population": 110939,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "perpignan",
    "name": "Perpignan",
    "country": "France",
    "coordinates": {
      "lat": 42.69764,
      "lng": 2.89541
    },
    "region": "Western Europe",
    "population": 110706,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "caen",
    "name": "Caen",
    "country": "France",
    "coordinates": {
      "lat": 49.18585,
      "lng": -0.35912
    },
    "region": "Western Europe",
    "population": 110624,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "delicias",
    "name": "Delicias",
    "country": "Spain",
    "coordinates": {
      "lat": 41.64928,
      "lng": -0.90757
    },
    "region": "Southern Europe",
    "population": 110520,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rodenkirchen",
    "name": "Rodenkirchen",
    "country": "Germany",
    "coordinates": {
      "lat": 50.89328,
      "lng": 6.99481
    },
    "region": "Western Europe",
    "population": 110158,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mendip",
    "name": "Mendip",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.2372,
      "lng": -2.6266
    },
    "region": "Western Europe",
    "population": 110000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pisa",
    "name": "Pisa",
    "country": "Italy",
    "coordinates": {
      "lat": 43.70853,
      "lng": 10.4036
    },
    "region": "Southern Europe",
    "population": 109960,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kecskemét",
    "name": "Kecskemét",
    "country": "Hungary",
    "coordinates": {
      "lat": 46.90618,
      "lng": 19.69128
    },
    "region": "Central Europe",
    "population": 109847,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wakefield",
    "name": "Wakefield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.68331,
      "lng": -1.49768
    },
    "region": "Western Europe",
    "population": 109766,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "walthamstow",
    "name": "Walthamstow",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.59067,
      "lng": -0.02077
    },
    "region": "Western Europe",
    "population": 109424,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "boulogne-billancourt",
    "name": "Boulogne-Billancourt",
    "country": "France",
    "coordinates": {
      "lat": 48.83545,
      "lng": 2.24128
    },
    "region": "Western Europe",
    "population": 108782,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kalisz",
    "name": "Kalisz",
    "country": "Poland",
    "coordinates": {
      "lat": 51.76109,
      "lng": 18.09102
    },
    "region": "Eastern Europe",
    "population": 108759,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dagenham",
    "name": "Dagenham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.55,
      "lng": 0.16667
    },
    "region": "Western Europe",
    "population": 108368,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rijeka",
    "name": "Rijeka",
    "country": "Croatia",
    "coordinates": {
      "lat": 45.32673,
      "lng": 14.44241
    },
    "region": "Southern Europe",
    "population": 107964,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "basingstoke",
    "name": "Basingstoke",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.26249,
      "lng": -1.08708
    },
    "region": "Western Europe",
    "population": 107642,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "maidstone",
    "name": "Maidstone",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.26667,
      "lng": 0.51667
    },
    "region": "Western Europe",
    "population": 107627,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "râmnicu-vâlcea",
    "name": "Râmnicu Vâlcea",
    "country": "Romania",
    "coordinates": {
      "lat": 45.1,
      "lng": 24.36667
    },
    "region": "Eastern Europe",
    "population": 107558,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alcobendas",
    "name": "Alcobendas",
    "country": "Spain",
    "coordinates": {
      "lat": 40.54746,
      "lng": -3.64197
    },
    "region": "Southern Europe",
    "population": 107514,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "koszalin",
    "name": "Koszalin",
    "country": "Poland",
    "coordinates": {
      "lat": 54.19438,
      "lng": 16.17222
    },
    "region": "Eastern Europe",
    "population": 107450,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bolzano",
    "name": "Bolzano",
    "country": "Italy",
    "coordinates": {
      "lat": 46.49067,
      "lng": 11.33982
    },
    "region": "Southern Europe",
    "population": 107436,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "koblenz",
    "name": "Koblenz",
    "country": "Germany",
    "coordinates": {
      "lat": 50.35357,
      "lng": 7.57883
    },
    "region": "Western Europe",
    "population": 107319,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "siegen",
    "name": "Siegen",
    "country": "Germany",
    "coordinates": {
      "lat": 50.87481,
      "lng": 8.02431
    },
    "region": "Western Europe",
    "population": 107242,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reus",
    "name": "Reus",
    "country": "Spain",
    "coordinates": {
      "lat": 41.15612,
      "lng": 1.10687
    },
    "region": "Southern Europe",
    "population": 107118,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sutton-coldfield",
    "name": "Sutton Coldfield",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.56667,
      "lng": -1.81667
    },
    "region": "Western Europe",
    "population": 107030,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bedford",
    "name": "Bedford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.13459,
      "lng": -0.46632
    },
    "region": "Western Europe",
    "population": 106940,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "coimbra",
    "name": "Coimbra",
    "country": "Portugal",
    "coordinates": {
      "lat": 40.20564,
      "lng": -8.41955
    },
    "region": "Southern Europe",
    "population": 106582,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bergisch-gladbach",
    "name": "Bergisch Gladbach",
    "country": "Germany",
    "coordinates": {
      "lat": 50.9856,
      "lng": 7.13298
    },
    "region": "Western Europe",
    "population": 106184,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "legnica",
    "name": "Legnica",
    "country": "Poland",
    "coordinates": {
      "lat": 51.21006,
      "lng": 16.1619
    },
    "region": "Eastern Europe",
    "population": 106033,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "suceava",
    "name": "Suceava",
    "country": "Romania",
    "coordinates": {
      "lat": 47.63333,
      "lng": 26.25
    },
    "region": "Eastern Europe",
    "population": 105796,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ourense",
    "name": "Ourense",
    "country": "Spain",
    "coordinates": {
      "lat": 42.33669,
      "lng": -7.86407
    },
    "region": "Southern Europe",
    "population": 105233,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nancy",
    "name": "Nancy",
    "country": "France",
    "coordinates": {
      "lat": 48.68439,
      "lng": 6.18496
    },
    "region": "Western Europe",
    "population": 105058,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "moratalaz",
    "name": "Moratalaz",
    "country": "Spain",
    "coordinates": {
      "lat": 40.40742,
      "lng": -3.64935
    },
    "region": "Southern Europe",
    "population": 104923,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jena",
    "name": "Jena",
    "country": "Germany",
    "coordinates": {
      "lat": 50.92878,
      "lng": 11.5899
    },
    "region": "Western Europe",
    "population": 104712,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gera",
    "name": "Gera",
    "country": "Germany",
    "coordinates": {
      "lat": 50.88029,
      "lng": 12.08187
    },
    "region": "Western Europe",
    "population": 104659,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ottakring",
    "name": "Ottakring",
    "country": "Austria",
    "coordinates": {
      "lat": 48.21667,
      "lng": 16.3
    },
    "region": "Central Europe",
    "population": 104627,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mostar",
    "name": "Mostar",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 43.34333,
      "lng": 17.80806
    },
    "region": "Southern Europe",
    "population": 104518,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "helsingborg",
    "name": "Helsingborg",
    "country": "Sweden",
    "coordinates": {
      "lat": 56.04673,
      "lng": 12.69437
    },
    "region": "Northern Europe",
    "population": 104250,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "woking",
    "name": "Woking",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.31903,
      "lng": -0.55893
    },
    "region": "Western Europe",
    "population": 103932,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "salzgitter",
    "name": "Salzgitter",
    "country": "Germany",
    "coordinates": {
      "lat": 52.15705,
      "lng": 10.4154
    },
    "region": "Western Europe",
    "population": 103866,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lincoln",
    "name": "Lincoln",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.22683,
      "lng": -0.53792
    },
    "region": "Western Europe",
    "population": 103813,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piacenza",
    "name": "Piacenza",
    "country": "Italy",
    "coordinates": {
      "lat": 45.05242,
      "lng": 9.69342
    },
    "region": "Southern Europe",
    "population": 103607,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "moers",
    "name": "Moers",
    "country": "Germany",
    "coordinates": {
      "lat": 51.45342,
      "lng": 6.6326
    },
    "region": "Western Europe",
    "population": 103487,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "queluz",
    "name": "Queluz",
    "country": "Portugal",
    "coordinates": {
      "lat": 38.75657,
      "lng": -9.25451
    },
    "region": "Southern Europe",
    "population": 103399,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hildesheim",
    "name": "Hildesheim",
    "country": "Germany",
    "coordinates": {
      "lat": 52.15077,
      "lng": 9.95112
    },
    "region": "Western Europe",
    "population": 103052,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "drammen",
    "name": "Drammen",
    "country": "Norway",
    "coordinates": {
      "lat": 59.74389,
      "lng": 10.20449
    },
    "region": "Northern Europe",
    "population": 103007,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "liberec",
    "name": "Liberec",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 50.76711,
      "lng": 15.05619
    },
    "region": "Central Europe",
    "population": 102951,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hengelo",
    "name": "Hengelo",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.26583,
      "lng": 6.79306
    },
    "region": "Western Europe",
    "population": 102773,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lyon-03",
    "name": "Lyon 03",
    "country": "France",
    "coordinates": {
      "lat": 45.76124,
      "lng": 4.85184
    },
    "region": "Western Europe",
    "population": 102725,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piatra-neamţ",
    "name": "Piatra Neamţ",
    "country": "Romania",
    "coordinates": {
      "lat": 46.91667,
      "lng": 26.33333
    },
    "region": "Eastern Europe",
    "population": 102688,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "erlangen",
    "name": "Erlangen",
    "country": "Germany",
    "coordinates": {
      "lat": 49.59099,
      "lng": 11.00783
    },
    "region": "Western Europe",
    "population": 102675,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bemowo",
    "name": "Bemowo",
    "country": "Poland",
    "coordinates": {
      "lat": 52.2546,
      "lng": 20.90844
    },
    "region": "Eastern Europe",
    "population": 102393,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ciutat-vella",
    "name": "Ciutat Vella",
    "country": "Spain",
    "coordinates": {
      "lat": 41.38022,
      "lng": 2.17319
    },
    "region": "Southern Europe",
    "population": 102347,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "drobeta-turnu-severin",
    "name": "Drobeta-Turnu Severin",
    "country": "Romania",
    "coordinates": {
      "lat": 44.62693,
      "lng": 22.65288
    },
    "region": "Eastern Europe",
    "population": 102346,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mitte",
    "name": "Mitte",
    "country": "Germany",
    "coordinates": {
      "lat": 52.52003,
      "lng": 13.40489
    },
    "region": "Western Europe",
    "population": 102338,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "novara",
    "name": "Novara",
    "country": "Italy",
    "coordinates": {
      "lat": 45.44694,
      "lng": 8.62118
    },
    "region": "Southern Europe",
    "population": 101916,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wilmersdorf",
    "name": "Wilmersdorf",
    "country": "Germany",
    "coordinates": {
      "lat": 52.48333,
      "lng": 13.31667
    },
    "region": "Western Europe",
    "population": 101877,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "torrevieja",
    "name": "Torrevieja",
    "country": "Spain",
    "coordinates": {
      "lat": 37.97872,
      "lng": -0.68222
    },
    "region": "Southern Europe",
    "population": 101792,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "worcester",
    "name": "Worcester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.18935,
      "lng": -2.22001
    },
    "region": "Western Europe",
    "population": 101659,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "venlo",
    "name": "Venlo",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.37,
      "lng": 6.16806
    },
    "region": "Western Europe",
    "population": 101603,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "székesfehérvár",
    "name": "Székesfehérvár",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.18995,
      "lng": 18.41034
    },
    "region": "Central Europe",
    "population": 101600,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bath",
    "name": "Bath",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.3751,
      "lng": -2.36172
    },
    "region": "Western Europe",
    "population": 101557,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "argenteuil",
    "name": "Argenteuil",
    "country": "France",
    "coordinates": {
      "lat": 48.94788,
      "lng": 2.24744
    },
    "region": "Western Europe",
    "population": 101475,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "simmering",
    "name": "Simmering",
    "country": "Austria",
    "coordinates": {
      "lat": 48.18333,
      "lng": 16.43333
    },
    "region": "Central Europe",
    "population": 101420,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "witten",
    "name": "Witten",
    "country": "Germany",
    "coordinates": {
      "lat": 51.44362,
      "lng": 7.35258
    },
    "region": "Western Europe",
    "population": 101247,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gillingham",
    "name": "Gillingham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.38914,
      "lng": 0.54863
    },
    "region": "Western Europe",
    "population": 101187,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leuven",
    "name": "Leuven",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.87959,
      "lng": 4.70093
    },
    "region": "Western Europe",
    "population": 101032,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pleven",
    "name": "Pleven",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 43.41667,
      "lng": 24.61667
    },
    "region": "Other",
    "population": 100952,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "elbasan",
    "name": "Elbasan",
    "country": "Albania",
    "coordinates": {
      "lat": 41.1125,
      "lng": 20.08222
    },
    "region": "Southern Europe",
    "population": 100903,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "arezzo",
    "name": "Arezzo",
    "country": "Italy",
    "coordinates": {
      "lat": 43.46276,
      "lng": 11.88068
    },
    "region": "Southern Europe",
    "population": 100734,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kallithéa",
    "name": "Kallithéa",
    "country": "Greece",
    "coordinates": {
      "lat": 37.95,
      "lng": 23.7
    },
    "region": "Southern Europe",
    "population": 100641,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "klagenfurt-am-wörthersee",
    "name": "Klagenfurt am Wörthersee",
    "country": "Austria",
    "coordinates": {
      "lat": 46.62472,
      "lng": 14.30528
    },
    "region": "Central Europe",
    "population": 100316,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "udine",
    "name": "Udine",
    "country": "Italy",
    "coordinates": {
      "lat": 46.0693,
      "lng": 13.23715
    },
    "region": "Southern Europe",
    "population": 100170,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "trier",
    "name": "Trier",
    "country": "Germany",
    "coordinates": {
      "lat": 49.75565,
      "lng": 6.63935
    },
    "region": "Western Europe",
    "population": 100129,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "subotica",
    "name": "Subotica",
    "country": "Serbia",
    "coordinates": {
      "lat": 46.1,
      "lng": 19.66667
    },
    "region": "Southern Europe",
    "population": 100000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "becontree",
    "name": "Becontree",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.5529,
      "lng": 0.129
    },
    "region": "Western Europe",
    "population": 100000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "andria",
    "name": "Andria",
    "country": "Italy",
    "coordinates": {
      "lat": 41.23117,
      "lng": 16.29797
    },
    "region": "Southern Europe",
    "population": 99784,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "olomouc",
    "name": "Olomouc",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.59552,
      "lng": 17.25175
    },
    "region": "Central Europe",
    "population": 99496,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "šiauliai",
    "name": "Šiauliai",
    "country": "Lithuania",
    "coordinates": {
      "lat": 55.93333,
      "lng": 23.31667
    },
    "region": "Northern Europe",
    "population": 99462,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "acharnés",
    "name": "Acharnés",
    "country": "Greece",
    "coordinates": {
      "lat": 38.08333,
      "lng": 23.73333
    },
    "region": "Southern Europe",
    "population": 99346,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "worthing",
    "name": "Worthing",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.81795,
      "lng": -0.37538
    },
    "region": "Western Europe",
    "population": 99110,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "roubaix",
    "name": "Roubaix",
    "country": "France",
    "coordinates": {
      "lat": 50.69421,
      "lng": 3.17456
    },
    "region": "Western Europe",
    "population": 98828,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zwickau",
    "name": "Zwickau",
    "country": "Germany",
    "coordinates": {
      "lat": 50.72724,
      "lng": 12.48839
    },
    "region": "Western Europe",
    "population": 98796,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kaiserslautern",
    "name": "Kaiserslautern",
    "country": "Germany",
    "coordinates": {
      "lat": 49.443,
      "lng": 7.77161
    },
    "region": "Western Europe",
    "population": 98732,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tourcoing",
    "name": "Tourcoing",
    "country": "France",
    "coordinates": {
      "lat": 50.72391,
      "lng": 3.16117
    },
    "region": "Western Europe",
    "population": 98656,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "słupsk",
    "name": "Słupsk",
    "country": "Poland",
    "coordinates": {
      "lat": 54.46405,
      "lng": 17.02872
    },
    "region": "Eastern Europe",
    "population": 98608,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "barakaldo",
    "name": "Barakaldo",
    "country": "Spain",
    "coordinates": {
      "lat": 43.29639,
      "lng": -2.98813
    },
    "region": "Southern Europe",
    "population": 98460,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-iv.-kerület",
    "name": "Budapest IV. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.56182,
      "lng": 19.08909
    },
    "region": "Central Europe",
    "population": 98374,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "iserlohn",
    "name": "Iserlohn",
    "country": "Germany",
    "coordinates": {
      "lat": 51.37547,
      "lng": 7.70281
    },
    "region": "Western Europe",
    "population": 97910,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "santiago-de-compostela",
    "name": "Santiago de Compostela",
    "country": "Spain",
    "coordinates": {
      "lat": 42.88052,
      "lng": -8.54569
    },
    "region": "Southern Europe",
    "population": 97849,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "meidling",
    "name": "Meidling",
    "country": "Austria",
    "coordinates": {
      "lat": 48.16667,
      "lng": 16.33333
    },
    "region": "Central Europe",
    "population": 97624,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rochdale",
    "name": "Rochdale",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.61766,
      "lng": -2.1552
    },
    "region": "Western Europe",
    "population": 97550,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "deventer",
    "name": "Deventer",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.255,
      "lng": 6.16389
    },
    "region": "Western Europe",
    "population": 97331,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "târgu-jiu",
    "name": "Târgu Jiu",
    "country": "Romania",
    "coordinates": {
      "lat": 45.05,
      "lng": 23.28333
    },
    "region": "Eastern Europe",
    "population": 97179,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cesena",
    "name": "Cesena",
    "country": "Italy",
    "coordinates": {
      "lat": 44.1391,
      "lng": 12.24315
    },
    "region": "Southern Europe",
    "population": 97137,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "molenbeek-saint-jean",
    "name": "Molenbeek-Saint-Jean",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.8499,
      "lng": 4.31248
    },
    "region": "Western Europe",
    "population": 97037,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "maribor",
    "name": "Maribor",
    "country": "Slovenia",
    "coordinates": {
      "lat": 46.55472,
      "lng": 15.64667
    },
    "region": "Central Europe",
    "population": 97019,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lugo",
    "name": "Lugo",
    "country": "Spain",
    "coordinates": {
      "lat": 43.00992,
      "lng": -7.55602
    },
    "region": "Southern Europe",
    "population": 96678,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "schwerin",
    "name": "Schwerin",
    "country": "Germany",
    "coordinates": {
      "lat": 53.62937,
      "lng": 11.41316
    },
    "region": "Western Europe",
    "population": 96641,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jaworzno",
    "name": "Jaworzno",
    "country": "Poland",
    "coordinates": {
      "lat": 50.20528,
      "lng": 19.27498
    },
    "region": "Eastern Europe",
    "population": 96541,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "san-fernando",
    "name": "San Fernando",
    "country": "Spain",
    "coordinates": {
      "lat": 36.4759,
      "lng": -6.19817
    },
    "region": "Southern Europe",
    "population": 96366,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "girona",
    "name": "Girona",
    "country": "Spain",
    "coordinates": {
      "lat": 41.98311,
      "lng": 2.82493
    },
    "region": "Southern Europe",
    "population": 96188,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gütersloh",
    "name": "Gütersloh",
    "country": "Germany",
    "coordinates": {
      "lat": 51.90693,
      "lng": 8.37853
    },
    "region": "Western Europe",
    "population": 96180,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saint-denis",
    "name": "Saint-Denis",
    "country": "France",
    "coordinates": {
      "lat": 48.93564,
      "lng": 2.35387
    },
    "region": "Western Europe",
    "population": 96128,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jastrzębie-zdrój",
    "name": "Jastrzębie Zdrój",
    "country": "Poland",
    "coordinates": {
      "lat": 49.95542,
      "lng": 18.57479
    },
    "region": "Eastern Europe",
    "population": 95813,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "las-rozas-de-madrid",
    "name": "Las Rozas de Madrid",
    "country": "Spain",
    "coordinates": {
      "lat": 40.49292,
      "lng": -3.87371
    },
    "region": "Southern Europe",
    "population": 95550,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mons",
    "name": "Mons",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.45413,
      "lng": 3.95229
    },
    "region": "Western Europe",
    "population": 95299,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "royal-leamington-spa",
    "name": "Royal Leamington Spa",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.2852,
      "lng": -1.52
    },
    "region": "Western Europe",
    "population": 95172,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "delft",
    "name": "Delft",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.00667,
      "lng": 4.35556
    },
    "region": "Western Europe",
    "population": 95060,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "grudziądz",
    "name": "Grudziądz",
    "country": "Poland",
    "coordinates": {
      "lat": 53.48411,
      "lng": 18.75366
    },
    "region": "Eastern Europe",
    "population": 95045,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "frederiksberg",
    "name": "Frederiksberg",
    "country": "Denmark",
    "coordinates": {
      "lat": 55.67938,
      "lng": 12.53463
    },
    "region": "Northern Europe",
    "population": 95029,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "romford",
    "name": "Romford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.57515,
      "lng": 0.18582
    },
    "region": "Western Europe",
    "population": 95000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alkmaar",
    "name": "Alkmaar",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.63167,
      "lng": 4.74861
    },
    "region": "Western Europe",
    "population": 94853,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leskovac",
    "name": "Leskovac",
    "country": "Serbia",
    "coordinates": {
      "lat": 42.99806,
      "lng": 21.94611
    },
    "region": "Southern Europe",
    "population": 94758,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "harlow",
    "name": "Harlow",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.77655,
      "lng": 0.11158
    },
    "region": "Western Europe",
    "population": 94365,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "limerick",
    "name": "Limerick",
    "country": "Ireland",
    "coordinates": {
      "lat": 52.66472,
      "lng": -8.62306
    },
    "region": "Western Europe",
    "population": 94192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cacém",
    "name": "Cacém",
    "country": "Portugal",
    "coordinates": {
      "lat": 38.76698,
      "lng": -9.29793
    },
    "region": "Southern Europe",
    "population": 93982,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gesundbrunnen",
    "name": "Gesundbrunnen",
    "country": "Germany",
    "coordinates": {
      "lat": 52.55035,
      "lng": 13.39139
    },
    "region": "Western Europe",
    "population": 93862,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jönköping",
    "name": "Jönköping",
    "country": "Sweden",
    "coordinates": {
      "lat": 57.78145,
      "lng": 14.15618
    },
    "region": "Northern Europe",
    "population": 93797,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "norrköping",
    "name": "Norrköping",
    "country": "Sweden",
    "coordinates": {
      "lat": 58.59419,
      "lng": 16.1826
    },
    "region": "Northern Europe",
    "population": 93765,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "düren",
    "name": "Düren",
    "country": "Germany",
    "coordinates": {
      "lat": 50.80434,
      "lng": 6.49299
    },
    "region": "Western Europe",
    "population": 93440,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "české-budějovice",
    "name": "České Budějovice",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 48.97447,
      "lng": 14.47434
    },
    "region": "Central Europe",
    "population": 93426,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "la-spezia",
    "name": "La Spezia",
    "country": "Italy",
    "coordinates": {
      "lat": 44.103,
      "lng": 9.82375
    },
    "region": "Southern Europe",
    "population": 93288,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "barletta",
    "name": "Barletta",
    "country": "Italy",
    "coordinates": {
      "lat": 41.31429,
      "lng": 16.28165
    },
    "region": "Southern Europe",
    "population": 93279,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xviii.-kerület",
    "name": "Budapest XVIII. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.44417,
      "lng": 19.17595
    },
    "region": "Central Europe",
    "population": 93225,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kristiansand",
    "name": "Kristiansand",
    "country": "Norway",
    "coordinates": {
      "lat": 58.14671,
      "lng": 7.9956
    },
    "region": "Northern Europe",
    "population": 93205,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ochota",
    "name": "Ochota",
    "country": "Poland",
    "coordinates": {
      "lat": 52.22096,
      "lng": 20.98526
    },
    "region": "Eastern Europe",
    "population": 93192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "praga-północ",
    "name": "Praga Północ",
    "country": "Poland",
    "coordinates": {
      "lat": 52.25443,
      "lng": 21.03472
    },
    "region": "Eastern Europe",
    "population": 93192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cáceres",
    "name": "Cáceres",
    "country": "Spain",
    "coordinates": {
      "lat": 39.47649,
      "lng": -6.37224
    },
    "region": "Southern Europe",
    "population": 93131,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "heerlen",
    "name": "Heerlen",
    "country": "Netherlands",
    "coordinates": {
      "lat": 50.88365,
      "lng": 5.98154
    },
    "region": "Western Europe",
    "population": 93084,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nuneaton",
    "name": "Nuneaton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.52323,
      "lng": -1.46523
    },
    "region": "Western Europe",
    "population": 92698,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "high-peak",
    "name": "High Peak",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.36797,
      "lng": -1.84536
    },
    "region": "Western Europe",
    "population": 92666,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rahlstedt",
    "name": "Rahlstedt",
    "country": "Germany",
    "coordinates": {
      "lat": 53.60194,
      "lng": 10.15667
    },
    "region": "Western Europe",
    "population": 92511,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tulcea",
    "name": "Tulcea",
    "country": "Romania",
    "coordinates": {
      "lat": 45.1787,
      "lng": 28.80501
    },
    "region": "Eastern Europe",
    "population": 92475,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "esslingen",
    "name": "Esslingen",
    "country": "Germany",
    "coordinates": {
      "lat": 48.73961,
      "lng": 9.30473
    },
    "region": "Western Europe",
    "population": 92390,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "darlington",
    "name": "Darlington",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.52429,
      "lng": -1.55039
    },
    "region": "Western Europe",
    "population": 92363,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alessandria",
    "name": "Alessandria",
    "country": "Italy",
    "coordinates": {
      "lat": 44.90924,
      "lng": 8.61007
    },
    "region": "Southern Europe",
    "population": 92104,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "winterthur",
    "name": "Winterthur",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.50564,
      "lng": 8.72413
    },
    "region": "Central Europe",
    "population": 91908,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lorca",
    "name": "Lorca",
    "country": "Spain",
    "coordinates": {
      "lat": 37.67119,
      "lng": -1.7017
    },
    "region": "Southern Europe",
    "population": 91906,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sassari",
    "name": "Sassari",
    "country": "Italy",
    "coordinates": {
      "lat": 40.72586,
      "lng": 8.55552
    },
    "region": "Southern Europe",
    "population": 91895,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "southport",
    "name": "Southport",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.64581,
      "lng": -3.01008
    },
    "region": "Western Europe",
    "population": 91703,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ratingen",
    "name": "Ratingen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.29724,
      "lng": 6.84929
    },
    "region": "Western Europe",
    "population": 91606,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kalamariá",
    "name": "Kalamariá",
    "country": "Greece",
    "coordinates": {
      "lat": 40.5825,
      "lng": 22.95028
    },
    "region": "Southern Europe",
    "population": 91518,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "leeuwarden",
    "name": "Leeuwarden",
    "country": "Netherlands",
    "coordinates": {
      "lat": 53.20139,
      "lng": 5.80859
    },
    "region": "Western Europe",
    "population": 91424,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tartu",
    "name": "Tartu",
    "country": "Estonia",
    "coordinates": {
      "lat": 58.38062,
      "lng": 26.72509
    },
    "region": "Northern Europe",
    "population": 91407,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marl",
    "name": "Marl",
    "country": "Germany",
    "coordinates": {
      "lat": 51.65671,
      "lng": 7.09038
    },
    "region": "Western Europe",
    "population": 91398,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lünen",
    "name": "Lünen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.61634,
      "lng": 7.52872
    },
    "region": "Western Europe",
    "population": 91009,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hradec-králové",
    "name": "Hradec Králové",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 50.20923,
      "lng": 15.83277
    },
    "region": "Central Europe",
    "population": 90596,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chester",
    "name": "Chester",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.1905,
      "lng": -2.89189
    },
    "region": "Western Europe",
    "population": 90524,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ústí-nad-labem",
    "name": "Ústí nad Labem",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 50.6607,
      "lng": 14.03227
    },
    "region": "Central Europe",
    "population": 90378,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "coslada",
    "name": "Coslada",
    "country": "Spain",
    "coordinates": {
      "lat": 40.42378,
      "lng": -3.56129
    },
    "region": "Southern Europe",
    "population": 90280,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stevenage",
    "name": "Stevenage",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.90224,
      "lng": -0.20256
    },
    "region": "Western Europe",
    "population": 90232,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "huddinge",
    "name": "Huddinge",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.23705,
      "lng": 17.98192
    },
    "region": "Northern Europe",
    "population": 90182,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wembley",
    "name": "Wembley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.55242,
      "lng": -0.29686
    },
    "region": "Western Europe",
    "population": 90045,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ancona",
    "name": "Ancona",
    "country": "Italy",
    "coordinates": {
      "lat": 43.5942,
      "lng": 13.50337
    },
    "region": "Southern Europe",
    "population": 89994,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "avignon",
    "name": "Avignon",
    "country": "France",
    "coordinates": {
      "lat": 43.94834,
      "lng": 4.80892
    },
    "region": "Western Europe",
    "population": 89769,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "grays",
    "name": "Grays",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.47566,
      "lng": 0.32521
    },
    "region": "Western Europe",
    "population": 89755,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lillestrøm",
    "name": "Lillestrøm",
    "country": "Norway",
    "coordinates": {
      "lat": 59.95597,
      "lng": 11.04918
    },
    "region": "Northern Europe",
    "population": 89684,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vlorë",
    "name": "Vlorë",
    "country": "Albania",
    "coordinates": {
      "lat": 40.4686,
      "lng": 19.48318
    },
    "region": "Southern Europe",
    "population": 89546,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "níkaia",
    "name": "Níkaia",
    "country": "Greece",
    "coordinates": {
      "lat": 37.96667,
      "lng": 23.65
    },
    "region": "Southern Europe",
    "population": 89380,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marseille-13",
    "name": "Marseille 13",
    "country": "France",
    "coordinates": {
      "lat": 43.31856,
      "lng": 5.40836
    },
    "region": "Western Europe",
    "population": 89316,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "harrogate",
    "name": "Harrogate",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.99078,
      "lng": -1.5373
    },
    "region": "Western Europe",
    "population": 89060,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "talavera-de-la-reina",
    "name": "Talavera de la Reina",
    "country": "Spain",
    "coordinates": {
      "lat": 39.96348,
      "lng": -4.83076
    },
    "region": "Southern Europe",
    "population": 88856,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hartlepool",
    "name": "Hartlepool",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.68554,
      "lng": -1.21028
    },
    "region": "Western Europe",
    "population": 88855,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-ii.-kerület",
    "name": "Budapest II. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.51984,
      "lng": 19.02218
    },
    "region": "Central Europe",
    "population": 88729,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hanau-am-main",
    "name": "Hanau am Main",
    "country": "Germany",
    "coordinates": {
      "lat": 50.13423,
      "lng": 8.91418
    },
    "region": "Western Europe",
    "population": 88648,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pardubice",
    "name": "Pardubice",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 50.04075,
      "lng": 15.77659
    },
    "region": "Central Europe",
    "population": 88520,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "târgovişte",
    "name": "Târgovişte",
    "country": "Romania",
    "coordinates": {
      "lat": 44.92543,
      "lng": 25.4567
    },
    "region": "Eastern Europe",
    "population": 88435,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "el-puerto-de-santa-maría",
    "name": "El Puerto de Santa María",
    "country": "Spain",
    "coordinates": {
      "lat": 36.59389,
      "lng": -6.23298
    },
    "region": "Southern Europe",
    "population": 88364,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "shkodër",
    "name": "Shkodër",
    "country": "Albania",
    "coordinates": {
      "lat": 42.06828,
      "lng": 19.51258
    },
    "region": "Southern Europe",
    "population": 88245,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "velbert",
    "name": "Velbert",
    "country": "Germany",
    "coordinates": {
      "lat": 51.33537,
      "lng": 7.04348
    },
    "region": "Western Europe",
    "population": 87669,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ludwigsburg",
    "name": "Ludwigsburg",
    "country": "Germany",
    "coordinates": {
      "lat": 48.89731,
      "lng": 9.19161
    },
    "region": "Western Europe",
    "population": 87603,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "jelenia-góra",
    "name": "Jelenia Góra",
    "country": "Poland",
    "coordinates": {
      "lat": 50.89973,
      "lng": 15.72899
    },
    "region": "Eastern Europe",
    "population": 87310,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "glyfáda",
    "name": "Glyfáda",
    "country": "Greece",
    "coordinates": {
      "lat": 37.86289,
      "lng": 23.75802
    },
    "region": "Southern Europe",
    "population": 87305,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lund",
    "name": "Lund",
    "country": "Sweden",
    "coordinates": {
      "lat": 55.70584,
      "lng": 13.19321
    },
    "region": "Northern Europe",
    "population": 87244,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cornellà-de-llobregat",
    "name": "Cornellà de Llobregat",
    "country": "Spain",
    "coordinates": {
      "lat": 41.35,
      "lng": 2.08333
    },
    "region": "Southern Europe",
    "population": 87173,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fulham",
    "name": "Fulham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.48026,
      "lng": -0.1993
    },
    "region": "Western Europe",
    "population": 87161,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "londonderry-county-borough",
    "name": "Londonderry County Borough",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.99721,
      "lng": -7.30917
    },
    "region": "Western Europe",
    "population": 87153,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "brindisi",
    "name": "Brindisi",
    "country": "Italy",
    "coordinates": {
      "lat": 40.63215,
      "lng": 17.93607
    },
    "region": "Southern Europe",
    "population": 87141,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "asnières-sur-seine",
    "name": "Asnières-sur-Seine",
    "country": "France",
    "coordinates": {
      "lat": 48.91667,
      "lng": 2.28333
    },
    "region": "Western Europe",
    "population": 86742,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nanterre",
    "name": "Nanterre",
    "country": "France",
    "coordinates": {
      "lat": 48.89198,
      "lng": 2.20675
    },
    "region": "Western Europe",
    "population": 86719,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ixelles",
    "name": "Ixelles",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.83333,
      "lng": 4.36667
    },
    "region": "Western Europe",
    "population": 86671,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nitra",
    "name": "Nitra",
    "country": "Slovakia",
    "coordinates": {
      "lat": 48.30763,
      "lng": 18.08453
    },
    "region": "Central Europe",
    "population": 86329,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "orihuela",
    "name": "Orihuela",
    "country": "Spain",
    "coordinates": {
      "lat": 38.08483,
      "lng": -0.94401
    },
    "region": "Southern Europe",
    "population": 86164,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lyon-08",
    "name": "Lyon 08",
    "country": "France",
    "coordinates": {
      "lat": 45.73626,
      "lng": 4.86866
    },
    "region": "Western Europe",
    "population": 86154,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "grimsby",
    "name": "Grimsby",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.56539,
      "lng": -0.07553
    },
    "region": "Western Europe",
    "population": 86138,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cannock",
    "name": "Cannock",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.69045,
      "lng": -2.03085
    },
    "region": "Western Europe",
    "population": 86121,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "volos",
    "name": "Volos",
    "country": "Greece",
    "coordinates": {
      "lat": 39.36923,
      "lng": 22.94769
    },
    "region": "Southern Europe",
    "population": 86048,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "novi-pazar",
    "name": "Novi Pazar",
    "country": "Serbia",
    "coordinates": {
      "lat": 43.13667,
      "lng": 20.51222
    },
    "region": "Southern Europe",
    "population": 85996,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "poitiers",
    "name": "Poitiers",
    "country": "France",
    "coordinates": {
      "lat": 46.58261,
      "lng": 0.34348
    },
    "region": "Western Europe",
    "population": 85960,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lichterfelde",
    "name": "Lichterfelde",
    "country": "Germany",
    "coordinates": {
      "lat": 52.4333,
      "lng": 13.30762
    },
    "region": "Western Europe",
    "population": 85885,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "panevėžys",
    "name": "Panevėžys",
    "country": "Lithuania",
    "coordinates": {
      "lat": 55.73186,
      "lng": 24.35983
    },
    "region": "Northern Europe",
    "population": 85885,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "flensburg",
    "name": "Flensburg",
    "country": "Germany",
    "coordinates": {
      "lat": 54.78431,
      "lng": 9.43961
    },
    "region": "Western Europe",
    "population": 85838,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "treviso",
    "name": "Treviso",
    "country": "Italy",
    "coordinates": {
      "lat": 45.66673,
      "lng": 12.2416
    },
    "region": "Southern Europe",
    "population": 85760,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hemel-hempstead",
    "name": "Hemel Hempstead",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.75368,
      "lng": -0.44975
    },
    "region": "Western Europe",
    "population": 85629,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "versailles",
    "name": "Versailles",
    "country": "France",
    "coordinates": {
      "lat": 48.80359,
      "lng": 2.13424
    },
    "region": "Western Europe",
    "population": 85416,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sandnes",
    "name": "Sandnes",
    "country": "Norway",
    "coordinates": {
      "lat": 58.85244,
      "lng": 5.73521
    },
    "region": "Northern Europe",
    "population": 85386,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "torre-del-greco",
    "name": "Torre del Greco",
    "country": "Italy",
    "coordinates": {
      "lat": 40.78931,
      "lng": 14.36806
    },
    "region": "Southern Europe",
    "population": 85332,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lido-di-ostia",
    "name": "Lido di Ostia",
    "country": "Italy",
    "coordinates": {
      "lat": 41.73212,
      "lng": 12.27654
    },
    "region": "Southern Europe",
    "population": 85301,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wedding",
    "name": "Wedding",
    "country": "Germany",
    "coordinates": {
      "lat": 52.54734,
      "lng": 13.35594
    },
    "region": "Western Europe",
    "population": 85275,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "courbevoie",
    "name": "Courbevoie",
    "country": "France",
    "coordinates": {
      "lat": 48.89672,
      "lng": 2.25666
    },
    "region": "Western Europe",
    "population": 85158,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ceuta",
    "name": "Ceuta",
    "country": "Spain",
    "coordinates": {
      "lat": 35.88919,
      "lng": -5.32042
    },
    "region": "Southern Europe",
    "population": 85144,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "liepāja",
    "name": "Liepāja",
    "country": "Latvia",
    "coordinates": {
      "lat": 56.50474,
      "lng": 21.01085
    },
    "region": "Northern Europe",
    "population": 85132,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "créteil",
    "name": "Créteil",
    "country": "France",
    "coordinates": {
      "lat": 48.79266,
      "lng": 2.46569
    },
    "region": "Western Europe",
    "population": 84833,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "amsterdam-zuidoost",
    "name": "Amsterdam-Zuidoost",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.3075,
      "lng": 4.97222
    },
    "region": "Western Europe",
    "population": 84811,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "como",
    "name": "Como",
    "country": "Italy",
    "coordinates": {
      "lat": 45.80819,
      "lng": 9.0832
    },
    "region": "Southern Europe",
    "population": 84808,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ílion",
    "name": "Ílion",
    "country": "Greece",
    "coordinates": {
      "lat": 38.03333,
      "lng": 23.7
    },
    "region": "Southern Europe",
    "population": 84793,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cottbus",
    "name": "Cottbus",
    "country": "Germany",
    "coordinates": {
      "lat": 51.75769,
      "lng": 14.32888
    },
    "region": "Western Europe",
    "population": 84754,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "el-ejido",
    "name": "El Ejido",
    "country": "Spain",
    "coordinates": {
      "lat": 36.77629,
      "lng": -2.81456
    },
    "region": "Southern Europe",
    "population": 84710,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "st-albans",
    "name": "St Albans",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.75,
      "lng": -0.33333
    },
    "region": "Western Europe",
    "population": 84561,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wilhelmshaven",
    "name": "Wilhelmshaven",
    "country": "Germany",
    "coordinates": {
      "lat": 53.52998,
      "lng": 8.11253
    },
    "region": "Western Europe",
    "population": 84393,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "nowy-sącz",
    "name": "Nowy Sącz",
    "country": "Poland",
    "coordinates": {
      "lat": 49.62177,
      "lng": 20.69705
    },
    "region": "Eastern Europe",
    "population": 84376,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "redditch",
    "name": "Redditch",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.3065,
      "lng": -1.94569
    },
    "region": "Western Europe",
    "population": 84300,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "toledo",
    "name": "Toledo",
    "country": "Spain",
    "coordinates": {
      "lat": 39.8581,
      "lng": -4.02263
    },
    "region": "Southern Europe",
    "population": 84282,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hellersdorf",
    "name": "Hellersdorf",
    "country": "Germany",
    "coordinates": {
      "lat": 52.53319,
      "lng": 13.6088
    },
    "region": "Western Europe",
    "population": 84103,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reinickendorf",
    "name": "Reinickendorf",
    "country": "Germany",
    "coordinates": {
      "lat": 52.56395,
      "lng": 13.33552
    },
    "region": "Western Europe",
    "population": 83972,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "prešov",
    "name": "Prešov",
    "country": "Slovakia",
    "coordinates": {
      "lat": 48.99839,
      "lng": 21.23393
    },
    "region": "Central Europe",
    "population": 83897,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fredrikstad",
    "name": "Fredrikstad",
    "country": "Norway",
    "coordinates": {
      "lat": 59.2181,
      "lng": 10.9298
    },
    "region": "Northern Europe",
    "population": 83761,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sliven",
    "name": "Sliven",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.68583,
      "lng": 26.32917
    },
    "region": "Other",
    "population": 83740,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "south-shields",
    "name": "South Shields",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.99859,
      "lng": -1.4323
    },
    "region": "Western Europe",
    "population": 83655,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "derry",
    "name": "Derry",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.9981,
      "lng": -7.30934
    },
    "region": "Western Europe",
    "population": 83652,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hilversum",
    "name": "Hilversum",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.22333,
      "lng": 5.17639
    },
    "region": "Western Europe",
    "population": 83640,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pori",
    "name": "Pori",
    "country": "Finland",
    "coordinates": {
      "lat": 61.48333,
      "lng": 21.78333
    },
    "region": "Northern Europe",
    "population": 83491,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "galway",
    "name": "Galway",
    "country": "Ireland",
    "coordinates": {
      "lat": 53.27245,
      "lng": -9.05095
    },
    "region": "Western Europe",
    "population": 83456,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tübingen",
    "name": "Tübingen",
    "country": "Germany",
    "coordinates": {
      "lat": 48.52266,
      "lng": 9.05222
    },
    "region": "Western Europe",
    "population": 83416,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "busto-arsizio",
    "name": "Busto Arsizio",
    "country": "Italy",
    "coordinates": {
      "lat": 45.61128,
      "lng": 8.84914
    },
    "region": "Southern Europe",
    "population": 83405,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "guadalajara",
    "name": "Guadalajara",
    "country": "Spain",
    "coordinates": {
      "lat": 40.62862,
      "lng": -3.16185
    },
    "region": "Southern Europe",
    "population": 83039,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "uccle",
    "name": "Uccle",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.80225,
      "lng": 4.33943
    },
    "region": "Western Europe",
    "population": 82929,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "weston-super-mare",
    "name": "Weston-super-Mare",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.34603,
      "lng": -2.97665
    },
    "region": "Western Europe",
    "population": 82903,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "minden",
    "name": "Minden",
    "country": "Germany",
    "coordinates": {
      "lat": 52.28953,
      "lng": 8.91455
    },
    "region": "Western Europe",
    "population": 82879,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kraljevo",
    "name": "Kraljevo",
    "country": "Serbia",
    "coordinates": {
      "lat": 43.72583,
      "lng": 20.68944
    },
    "region": "Southern Europe",
    "population": 82846,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "havířov",
    "name": "Havířov",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.77984,
      "lng": 18.43688
    },
    "region": "Central Europe",
    "population": 82768,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pau",
    "name": "Pau",
    "country": "France",
    "coordinates": {
      "lat": 43.31117,
      "lng": -0.35583
    },
    "region": "Western Europe",
    "population": 82697,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "roquetas-de-mar",
    "name": "Roquetas de Mar",
    "country": "Spain",
    "coordinates": {
      "lat": 36.76419,
      "lng": -2.61475
    },
    "region": "Southern Europe",
    "population": 82665,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "palencia",
    "name": "Palencia",
    "country": "Spain",
    "coordinates": {
      "lat": 42.00955,
      "lng": -4.52406
    },
    "region": "Southern Europe",
    "population": 82651,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "algorta",
    "name": "Algorta",
    "country": "Spain",
    "coordinates": {
      "lat": 43.34927,
      "lng": -3.0094
    },
    "region": "Southern Europe",
    "population": 82624,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "halifax",
    "name": "Halifax",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.71667,
      "lng": -1.85
    },
    "region": "Western Europe",
    "population": 82624,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lyon-07",
    "name": "Lyon 07",
    "country": "France",
    "coordinates": {
      "lat": 45.74525,
      "lng": 4.84197
    },
    "region": "Western Europe",
    "population": 82573,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pernik",
    "name": "Pernik",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 42.6,
      "lng": 23.03333
    },
    "region": "Other",
    "population": 82467,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pozuelo-de-alarcón",
    "name": "Pozuelo de Alarcón",
    "country": "Spain",
    "coordinates": {
      "lat": 40.43293,
      "lng": -3.81338
    },
    "region": "Southern Europe",
    "population": 82428,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sant-boi-de-llobregat",
    "name": "Sant Boi de Llobregat",
    "country": "Spain",
    "coordinates": {
      "lat": 41.34357,
      "lng": 2.03659
    },
    "region": "Southern Europe",
    "population": 82428,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "colombes",
    "name": "Colombes",
    "country": "France",
    "coordinates": {
      "lat": 48.91882,
      "lng": 2.25404
    },
    "region": "Western Europe",
    "population": 82300,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "les-corts",
    "name": "Les Corts",
    "country": "Spain",
    "coordinates": {
      "lat": 41.38712,
      "lng": 2.13007
    },
    "region": "Southern Europe",
    "population": 82270,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-viii.-kerület",
    "name": "Budapest VIII. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.48919,
      "lng": 19.07012
    },
    "region": "Central Europe",
    "population": 82222,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "beckenham",
    "name": "Beckenham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.40878,
      "lng": -0.02526
    },
    "region": "Western Europe",
    "population": 82000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "edmonton",
    "name": "Edmonton",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.62561,
      "lng": -0.05798
    },
    "region": "Western Europe",
    "population": 82000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tamworth",
    "name": "Tamworth",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.63399,
      "lng": -1.69587
    },
    "region": "Western Europe",
    "population": 81964,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "žilina",
    "name": "Žilina",
    "country": "Slovakia",
    "coordinates": {
      "lat": 49.22315,
      "lng": 18.73941
    },
    "region": "Central Europe",
    "population": 81940,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sesto-san-giovanni",
    "name": "Sesto San Giovanni",
    "country": "Italy",
    "coordinates": {
      "lat": 45.53329,
      "lng": 9.22585
    },
    "region": "Southern Europe",
    "population": 81822,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "villingen-schwenningen",
    "name": "Villingen-Schwenningen",
    "country": "Germany",
    "coordinates": {
      "lat": 48.06226,
      "lng": 8.49358
    },
    "region": "Western Europe",
    "population": 81770,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lucca",
    "name": "Lucca",
    "country": "Italy",
    "coordinates": {
      "lat": 43.84369,
      "lng": 10.50447
    },
    "region": "Southern Europe",
    "population": 81748,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "luzern",
    "name": "Luzern",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.05048,
      "lng": 8.30635
    },
    "region": "Central Europe",
    "population": 81691,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pontevedra",
    "name": "Pontevedra",
    "country": "Spain",
    "coordinates": {
      "lat": 42.431,
      "lng": -8.64435
    },
    "region": "Southern Europe",
    "population": 81576,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "scunthorpe",
    "name": "Scunthorpe",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.57905,
      "lng": -0.65437
    },
    "region": "Western Europe",
    "population": 81576,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bistriţa",
    "name": "Bistriţa",
    "country": "Romania",
    "coordinates": {
      "lat": 47.13316,
      "lng": 24.50011
    },
    "region": "Eastern Europe",
    "population": 81318,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "konstanz",
    "name": "Konstanz",
    "country": "Germany",
    "coordinates": {
      "lat": 47.66033,
      "lng": 9.17582
    },
    "region": "Western Europe",
    "population": 81275,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "konin",
    "name": "Konin",
    "country": "Poland",
    "coordinates": {
      "lat": 52.22338,
      "lng": 18.25121
    },
    "region": "Eastern Europe",
    "population": 81258,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pozzuoli",
    "name": "Pozzuoli",
    "country": "Italy",
    "coordinates": {
      "lat": 40.84394,
      "lng": 14.0952
    },
    "region": "Southern Europe",
    "population": 81231,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "reşiţa",
    "name": "Reşiţa",
    "country": "Romania",
    "coordinates": {
      "lat": 45.30083,
      "lng": 21.88917
    },
    "region": "Eastern Europe",
    "population": 81228,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "worms",
    "name": "Worms",
    "country": "Germany",
    "coordinates": {
      "lat": 49.63278,
      "lng": 8.35916
    },
    "region": "Western Europe",
    "population": 81099,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "moabit",
    "name": "Moabit",
    "country": "Germany",
    "coordinates": {
      "lat": 52.52635,
      "lng": 13.33903
    },
    "region": "Western Europe",
    "population": 81021,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vitry-sur-seine",
    "name": "Vitry-sur-Seine",
    "country": "France",
    "coordinates": {
      "lat": 48.78716,
      "lng": 2.40332
    },
    "region": "Western Europe",
    "population": 81001,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ravenna",
    "name": "Ravenna",
    "country": "Italy",
    "coordinates": {
      "lat": 44.41344,
      "lng": 12.20121
    },
    "region": "Southern Europe",
    "population": 80868,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "getxo",
    "name": "Getxo",
    "country": "Spain",
    "coordinates": {
      "lat": 43.35689,
      "lng": -3.01146
    },
    "region": "Southern Europe",
    "population": 80770,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lecce",
    "name": "Lecce",
    "country": "Italy",
    "coordinates": {
      "lat": 40.35481,
      "lng": 18.17244
    },
    "region": "Southern Europe",
    "population": 80695,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aulnay-sous-bois",
    "name": "Aulnay-sous-Bois",
    "country": "France",
    "coordinates": {
      "lat": 48.93814,
      "lng": 2.49402
    },
    "region": "Western Europe",
    "population": 80615,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "varese",
    "name": "Varese",
    "country": "Italy",
    "coordinates": {
      "lat": 45.82058,
      "lng": 8.82511
    },
    "region": "Southern Europe",
    "population": 80588,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kouvola",
    "name": "Kouvola",
    "country": "Finland",
    "coordinates": {
      "lat": 60.86667,
      "lng": 26.7
    },
    "region": "Northern Europe",
    "population": 80483,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tallaght",
    "name": "Tallaght",
    "country": "Ireland",
    "coordinates": {
      "lat": 53.2859,
      "lng": -6.37344
    },
    "region": "Western Europe",
    "population": 80339,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "giugliano-in-campania",
    "name": "Giugliano in Campania",
    "country": "Italy",
    "coordinates": {
      "lat": 40.92849,
      "lng": 14.20197
    },
    "region": "Southern Europe",
    "population": 80269,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xv.-kerület",
    "name": "Budapest XV. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.56263,
      "lng": 19.11681
    },
    "region": "Central Europe",
    "population": 80218,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "neumünster",
    "name": "Neumünster",
    "country": "Germany",
    "coordinates": {
      "lat": 54.07477,
      "lng": 9.98195
    },
    "region": "Western Europe",
    "population": 80196,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piotrków-trybunalski",
    "name": "Piotrków Trybunalski",
    "country": "Poland",
    "coordinates": {
      "lat": 51.40547,
      "lng": 19.70321
    },
    "region": "Eastern Europe",
    "population": 80128,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "purmerend",
    "name": "Purmerend",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.505,
      "lng": 4.95972
    },
    "region": "Western Europe",
    "population": 80117,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gandia",
    "name": "Gandia",
    "country": "Spain",
    "coordinates": {
      "lat": 38.96667,
      "lng": -0.18333
    },
    "region": "Southern Europe",
    "population": 80020,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dorsten",
    "name": "Dorsten",
    "country": "Germany",
    "coordinates": {
      "lat": 51.66166,
      "lng": 6.96514
    },
    "region": "Western Europe",
    "population": 79981,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stockton-on-tees",
    "name": "Stockton-on-Tees",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.56848,
      "lng": -1.3187
    },
    "region": "Western Europe",
    "population": 79957,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zrenjanin",
    "name": "Zrenjanin",
    "country": "Serbia",
    "coordinates": {
      "lat": 45.38361,
      "lng": 20.38194
    },
    "region": "Southern Europe",
    "population": 79773,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "amstelveen",
    "name": "Amstelveen",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.30083,
      "lng": 4.86389
    },
    "region": "Western Europe",
    "population": 79639,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lüdenscheid",
    "name": "Lüdenscheid",
    "country": "Germany",
    "coordinates": {
      "lat": 51.21977,
      "lng": 7.6273
    },
    "region": "Western Europe",
    "population": 79386,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dobrich",
    "name": "Dobrich",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 43.56667,
      "lng": 27.83333
    },
    "region": "Other",
    "population": 79269,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sant-cugat-del-vallès",
    "name": "Sant Cugat del Vallès",
    "country": "Spain",
    "coordinates": {
      "lat": 41.47063,
      "lng": 2.08611
    },
    "region": "Southern Europe",
    "population": 79253,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "slatina",
    "name": "Slatina",
    "country": "Romania",
    "coordinates": {
      "lat": 44.43333,
      "lng": 24.36667
    },
    "region": "Eastern Europe",
    "population": 78988,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "catanzaro",
    "name": "Catanzaro",
    "country": "Italy",
    "coordinates": {
      "lat": 38.88247,
      "lng": 16.60086
    },
    "region": "Southern Europe",
    "population": 78970,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marburg-an-der-lahn",
    "name": "Marburg an der Lahn",
    "country": "Germany",
    "coordinates": {
      "lat": 50.80904,
      "lng": 8.77069
    },
    "region": "Western Europe",
    "population": 78895,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marseille-08",
    "name": "Marseille 08",
    "country": "France",
    "coordinates": {
      "lat": 43.27083,
      "lng": 5.3821
    },
    "region": "Western Europe",
    "population": 78837,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "deurne",
    "name": "Deurne",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.22134,
      "lng": 4.46595
    },
    "region": "Western Europe",
    "population": 78747,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "avilés",
    "name": "Avilés",
    "country": "Spain",
    "coordinates": {
      "lat": 43.55473,
      "lng": -5.92483
    },
    "region": "Southern Europe",
    "population": 78715,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "torrent",
    "name": "Torrent",
    "country": "Spain",
    "coordinates": {
      "lat": 39.43705,
      "lng": -0.46546
    },
    "region": "Southern Europe",
    "population": 78543,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "carlisle",
    "name": "Carlisle",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.8951,
      "lng": -2.9382
    },
    "region": "Western Europe",
    "population": 78470,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kőbánya",
    "name": "Kőbánya",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.48427,
      "lng": 19.13913
    },
    "region": "Central Europe",
    "population": 78414,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xvii.-kerület",
    "name": "Budapest XVII. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.47997,
      "lng": 19.25388
    },
    "region": "Central Europe",
    "population": 78250,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rheinhausen",
    "name": "Rheinhausen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.40055,
      "lng": 6.71187
    },
    "region": "Western Europe",
    "population": 78203,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ilioúpoli",
    "name": "Ilioúpoli",
    "country": "Greece",
    "coordinates": {
      "lat": 37.93149,
      "lng": 23.76779
    },
    "region": "Southern Europe",
    "population": 78153,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "szombathely",
    "name": "Szombathely",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.23088,
      "lng": 16.62155
    },
    "region": "Central Europe",
    "population": 78025,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "castrop-rauxel",
    "name": "Castrop-Rauxel",
    "country": "Germany",
    "coordinates": {
      "lat": 51.55657,
      "lng": 7.31155
    },
    "region": "Western Europe",
    "population": 77924,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marsala",
    "name": "Marsala",
    "country": "Italy",
    "coordinates": {
      "lat": 37.7992,
      "lng": 12.4367
    },
    "region": "Southern Europe",
    "population": 77915,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marseille-15",
    "name": "Marseille 15",
    "country": "France",
    "coordinates": {
      "lat": 43.37224,
      "lng": 5.35386
    },
    "region": "Western Europe",
    "population": 77770,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "roosendaal",
    "name": "Roosendaal",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.53083,
      "lng": 4.46528
    },
    "region": "Western Europe",
    "population": 77725,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hasselt",
    "name": "Hasselt",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.93106,
      "lng": 5.33781
    },
    "region": "Western Europe",
    "population": 77651,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gateshead",
    "name": "Gateshead",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.96209,
      "lng": -1.60168
    },
    "region": "Western Europe",
    "population": 77649,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "inowrocław",
    "name": "Inowrocław",
    "country": "Poland",
    "coordinates": {
      "lat": 52.79886,
      "lng": 18.26387
    },
    "region": "Eastern Europe",
    "population": 77597,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bogenhausen",
    "name": "Bogenhausen",
    "country": "Germany",
    "coordinates": {
      "lat": 48.15221,
      "lng": 11.61585
    },
    "region": "Western Europe",
    "population": 77542,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aalst",
    "name": "Aalst",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.93604,
      "lng": 4.0355
    },
    "region": "Western Europe",
    "population": 77534,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lubin",
    "name": "Lubin",
    "country": "Poland",
    "coordinates": {
      "lat": 51.40089,
      "lng": 16.20149
    },
    "region": "Eastern Europe",
    "population": 77532,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mechelen",
    "name": "Mechelen",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.02574,
      "lng": 4.47762
    },
    "region": "Western Europe",
    "population": 77530,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lisburn",
    "name": "Lisburn",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 54.52337,
      "lng": -6.03527
    },
    "region": "Western Europe",
    "population": 77506,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "focșani",
    "name": "Focșani",
    "country": "Romania",
    "coordinates": {
      "lat": 45.7,
      "lng": 27.18333
    },
    "region": "Eastern Europe",
    "population": 77313,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chiclana-de-la-frontera",
    "name": "Chiclana de la Frontera",
    "country": "Spain",
    "coordinates": {
      "lat": 36.41976,
      "lng": -6.14367
    },
    "region": "Southern Europe",
    "population": 77293,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "paisley",
    "name": "Paisley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 55.83173,
      "lng": -4.43254
    },
    "region": "Western Europe",
    "population": 77270,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "joensuu",
    "name": "Joensuu",
    "country": "Finland",
    "coordinates": {
      "lat": 62.60118,
      "lng": 29.76316
    },
    "region": "Northern Europe",
    "population": 77266,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pesaro",
    "name": "Pesaro",
    "country": "Italy",
    "coordinates": {
      "lat": 43.90921,
      "lng": 12.9164
    },
    "region": "Southern Europe",
    "population": 77241,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wawer",
    "name": "Wawer",
    "country": "Poland",
    "coordinates": {
      "lat": 52.19656,
      "lng": 21.17752
    },
    "region": "Eastern Europe",
    "population": 77205,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "siedlce",
    "name": "Siedlce",
    "country": "Poland",
    "coordinates": {
      "lat": 52.16772,
      "lng": 22.29006
    },
    "region": "Eastern Europe",
    "population": 77185,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "putney",
    "name": "Putney",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.46072,
      "lng": -0.21814
    },
    "region": "Western Europe",
    "population": 77140,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "keratsíni",
    "name": "Keratsíni",
    "country": "Greece",
    "coordinates": {
      "lat": 37.9625,
      "lng": 23.61972
    },
    "region": "Southern Europe",
    "population": 77077,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "józsefváros",
    "name": "Józsefváros",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.48938,
      "lng": 19.07292
    },
    "region": "Central Europe",
    "population": 76957,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gladbeck",
    "name": "Gladbeck",
    "country": "Germany",
    "coordinates": {
      "lat": 51.57077,
      "lng": 6.98593
    },
    "region": "Western Europe",
    "population": 76940,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "marseille-09",
    "name": "Marseille 09",
    "country": "France",
    "coordinates": {
      "lat": 43.25433,
      "lng": 5.4057
    },
    "region": "Western Europe",
    "population": 76868,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "la-rochelle",
    "name": "La Rochelle",
    "country": "France",
    "coordinates": {
      "lat": 46.16308,
      "lng": -1.15222
    },
    "region": "Western Europe",
    "population": 76810,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "shrewsbury",
    "name": "Shrewsbury",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.71009,
      "lng": -2.75208
    },
    "region": "Western Europe",
    "population": 76782,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "champigny-sur-marne",
    "name": "Champigny-sur-Marne",
    "country": "France",
    "coordinates": {
      "lat": 48.81642,
      "lng": 2.49366
    },
    "region": "Western Europe",
    "population": 76726,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "luxembourg",
    "name": "Luxembourg",
    "country": "Luxembourg",
    "coordinates": {
      "lat": 49.61167,
      "lng": 6.13
    },
    "region": "Western Europe",
    "population": 76684,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "la-louvière",
    "name": "La Louvière",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.48657,
      "lng": 4.18785
    },
    "region": "Western Europe",
    "population": 76668,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pančevo",
    "name": "Pančevo",
    "country": "Serbia",
    "coordinates": {
      "lat": 44.87177,
      "lng": 20.64167
    },
    "region": "Southern Europe",
    "population": 76654,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rueil-malmaison",
    "name": "Rueil-Malmaison",
    "country": "France",
    "coordinates": {
      "lat": 48.8765,
      "lng": 2.18967
    },
    "region": "Western Europe",
    "population": 76616,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "arnsberg",
    "name": "Arnsberg",
    "country": "Germany",
    "coordinates": {
      "lat": 51.38333,
      "lng": 8.08333
    },
    "region": "Western Europe",
    "population": 76612,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fuorigrotta",
    "name": "Fuorigrotta",
    "country": "Italy",
    "coordinates": {
      "lat": 40.83333,
      "lng": 14.2
    },
    "region": "Southern Europe",
    "population": 76521,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fylde",
    "name": "Fylde",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.83333,
      "lng": -2.91667
    },
    "region": "Western Europe",
    "population": 76500,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rheine",
    "name": "Rheine",
    "country": "Germany",
    "coordinates": {
      "lat": 52.28509,
      "lng": 7.44055
    },
    "region": "Western Europe",
    "population": 76491,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "oss",
    "name": "Oss",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.765,
      "lng": 5.51806
    },
    "region": "Western Europe",
    "population": 76430,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "antibes",
    "name": "Antibes",
    "country": "France",
    "coordinates": {
      "lat": 43.58127,
      "lng": 7.12487
    },
    "region": "Western Europe",
    "population": 76393,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xxi.-kerület",
    "name": "Budapest XXI. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.43047,
      "lng": 19.07098
    },
    "region": "Central Europe",
    "population": 76339,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "latina",
    "name": "Latina",
    "country": "Italy",
    "coordinates": {
      "lat": 41.46614,
      "lng": 12.9043
    },
    "region": "Southern Europe",
    "population": 76305,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "manresa",
    "name": "Manresa",
    "country": "Spain",
    "coordinates": {
      "lat": 41.72815,
      "lng": 1.82399
    },
    "region": "Southern Europe",
    "population": 76250,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "viersen",
    "name": "Viersen",
    "country": "Germany",
    "coordinates": {
      "lat": 51.25435,
      "lng": 6.39441
    },
    "region": "Western Europe",
    "population": 76153,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bracknell",
    "name": "Bracknell",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.41363,
      "lng": -0.75054
    },
    "region": "Western Europe",
    "population": 76103,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "parádsasvár",
    "name": "Parádsasvár",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.9126,
      "lng": 19.97709
    },
    "region": "Central Europe",
    "population": 76000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cinisello-balsamo",
    "name": "Cinisello Balsamo",
    "country": "Italy",
    "coordinates": {
      "lat": 45.55823,
      "lng": 9.21495
    },
    "region": "Southern Europe",
    "population": 75943,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "san-sebastián-de-los-reyes",
    "name": "San Sebastián de los Reyes",
    "country": "Spain",
    "coordinates": {
      "lat": 40.55555,
      "lng": -3.62733
    },
    "region": "Southern Europe",
    "population": 75912,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "delmenhorst",
    "name": "Delmenhorst",
    "country": "Germany",
    "coordinates": {
      "lat": 53.0511,
      "lng": 8.63091
    },
    "region": "Western Europe",
    "population": 75893,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "battersea",
    "name": "Battersea",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.47475,
      "lng": -0.15547
    },
    "region": "Western Europe",
    "population": 75651,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bihać",
    "name": "Bihać",
    "country": "Bosnia and Herzegovina",
    "coordinates": {
      "lat": 44.81694,
      "lng": 15.87083
    },
    "region": "Southern Europe",
    "population": 75641,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "crewe",
    "name": "Crewe",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.09787,
      "lng": -2.44161
    },
    "region": "Western Europe",
    "population": 75556,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "osijek",
    "name": "Osijek",
    "country": "Croatia",
    "coordinates": {
      "lat": 45.55111,
      "lng": 18.69389
    },
    "region": "Southern Europe",
    "population": 75535,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "piła",
    "name": "Piła",
    "country": "Poland",
    "coordinates": {
      "lat": 53.15145,
      "lng": 16.73782
    },
    "region": "Eastern Europe",
    "population": 75532,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "chatham",
    "name": "Chatham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.37891,
      "lng": 0.52786
    },
    "region": "Western Europe",
    "population": 75509,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "schiedam",
    "name": "Schiedam",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.91917,
      "lng": 4.38889
    },
    "region": "Western Europe",
    "population": 75438,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "saint-maur-des-fossés",
    "name": "Saint-Maur-des-Fossés",
    "country": "France",
    "coordinates": {
      "lat": 48.79395,
      "lng": 2.49323
    },
    "region": "Western Europe",
    "population": 75402,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "banská-bystrica",
    "name": "Banská Bystrica",
    "country": "Slovakia",
    "coordinates": {
      "lat": 48.73946,
      "lng": 19.15349
    },
    "region": "Central Europe",
    "population": 75317,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kruševac",
    "name": "Kruševac",
    "country": "Serbia",
    "coordinates": {
      "lat": 43.58,
      "lng": 21.33389
    },
    "region": "Southern Europe",
    "population": 75256,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hove",
    "name": "Hove",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.83088,
      "lng": -0.1672
    },
    "region": "Western Europe",
    "population": 75174,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bayreuth",
    "name": "Bayreuth",
    "country": "Germany",
    "coordinates": {
      "lat": 49.94782,
      "lng": 11.57893
    },
    "region": "Western Europe",
    "population": 75061,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kumanovo",
    "name": "Kumanovo",
    "country": "Macedonia, The former Yugoslav Rep. of",
    "coordinates": {
      "lat": 42.13222,
      "lng": 21.71444
    },
    "region": "Southern Europe",
    "population": 75051,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gela",
    "name": "Gela",
    "country": "Italy",
    "coordinates": {
      "lat": 37.07381,
      "lng": 14.24038
    },
    "region": "Southern Europe",
    "population": 75001,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "spijkenisse",
    "name": "Spijkenisse",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.845,
      "lng": 4.32917
    },
    "region": "Western Europe",
    "population": 74988,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aprilia",
    "name": "Aprilia",
    "country": "Italy",
    "coordinates": {
      "lat": 41.59452,
      "lng": 12.65419
    },
    "region": "Southern Europe",
    "population": 74977,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "haninge",
    "name": "Haninge",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.16775,
      "lng": 18.14478
    },
    "region": "Northern Europe",
    "population": 74968,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gävle",
    "name": "Gävle",
    "country": "Sweden",
    "coordinates": {
      "lat": 60.67452,
      "lng": 17.14174
    },
    "region": "Northern Europe",
    "population": 74884,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "troisdorf",
    "name": "Troisdorf",
    "country": "Germany",
    "coordinates": {
      "lat": 50.80901,
      "lng": 7.14968
    },
    "region": "Western Europe",
    "population": 74749,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aylesbury",
    "name": "Aylesbury",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.81665,
      "lng": -0.81458
    },
    "region": "Western Europe",
    "population": 74748,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "helmond",
    "name": "Helmond",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.48167,
      "lng": 5.66111
    },
    "region": "Western Europe",
    "population": 74740,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "east-kilbride",
    "name": "East Kilbride",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 55.76412,
      "lng": -4.17669
    },
    "region": "Western Europe",
    "population": 74740,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "évosmos",
    "name": "Évosmos",
    "country": "Greece",
    "coordinates": {
      "lat": 40.67056,
      "lng": 22.90833
    },
    "region": "Southern Europe",
    "population": 74686,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mysłowice",
    "name": "Mysłowice",
    "country": "Poland",
    "coordinates": {
      "lat": 50.20745,
      "lng": 19.16668
    },
    "region": "Eastern Europe",
    "population": 74586,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cannes",
    "name": "Cannes",
    "country": "France",
    "coordinates": {
      "lat": 43.55135,
      "lng": 7.01275
    },
    "region": "Western Europe",
    "population": 74545,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "calais",
    "name": "Calais",
    "country": "France",
    "coordinates": {
      "lat": 50.95194,
      "lng": 1.85635
    },
    "region": "Western Europe",
    "population": 74433,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gießen",
    "name": "Gießen",
    "country": "Germany",
    "coordinates": {
      "lat": 50.58727,
      "lng": 8.67554
    },
    "region": "Western Europe",
    "population": 74411,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "asti",
    "name": "Asti",
    "country": "Italy",
    "coordinates": {
      "lat": 44.90162,
      "lng": 8.20751
    },
    "region": "Southern Europe",
    "population": 74348,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ferrol",
    "name": "Ferrol",
    "country": "Spain",
    "coordinates": {
      "lat": 43.48451,
      "lng": -8.23293
    },
    "region": "Southern Europe",
    "population": 74273,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ragusa",
    "name": "Ragusa",
    "country": "Italy",
    "coordinates": {
      "lat": 36.92574,
      "lng": 14.72443
    },
    "region": "Southern Europe",
    "population": 74251,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "khalándrion",
    "name": "Khalándrion",
    "country": "Greece",
    "coordinates": {
      "lat": 38.02369,
      "lng": 23.80068
    },
    "region": "Southern Europe",
    "population": 74192,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vélez-málaga",
    "name": "Vélez-Málaga",
    "country": "Spain",
    "coordinates": {
      "lat": 36.78107,
      "lng": -4.10266
    },
    "region": "Southern Europe",
    "population": 74190,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "béziers",
    "name": "Béziers",
    "country": "France",
    "coordinates": {
      "lat": 43.34122,
      "lng": 3.21402
    },
    "region": "Western Europe",
    "population": 74081,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ciudad-real",
    "name": "Ciudad Real",
    "country": "Spain",
    "coordinates": {
      "lat": 38.98626,
      "lng": -3.92907
    },
    "region": "Southern Europe",
    "population": 74014,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ostrowiec-świętokrzyski",
    "name": "Ostrowiec Świętokrzyski",
    "country": "Poland",
    "coordinates": {
      "lat": 50.92936,
      "lng": 21.38525
    },
    "region": "Eastern Europe",
    "population": 73989,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bocholt",
    "name": "Bocholt",
    "country": "Germany",
    "coordinates": {
      "lat": 51.83879,
      "lng": 6.61531
    },
    "region": "Western Europe",
    "population": 73943,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "casoria",
    "name": "Casoria",
    "country": "Italy",
    "coordinates": {
      "lat": 40.90751,
      "lng": 14.293
    },
    "region": "Southern Europe",
    "population": 73918,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kortrijk",
    "name": "Kortrijk",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.82803,
      "lng": 3.26487
    },
    "region": "Western Europe",
    "population": 73879,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pistoia",
    "name": "Pistoia",
    "country": "Italy",
    "coordinates": {
      "lat": 43.93064,
      "lng": 10.92365
    },
    "region": "Southern Europe",
    "population": 73832,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "prilep",
    "name": "Prilep",
    "country": "Macedonia, The former Yugoslav Rep. of",
    "coordinates": {
      "lat": 41.34514,
      "lng": 21.55504
    },
    "region": "Southern Europe",
    "population": 73814,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vlaardingen",
    "name": "Vlaardingen",
    "country": "Netherlands",
    "coordinates": {
      "lat": 51.9125,
      "lng": 4.34167
    },
    "region": "Western Europe",
    "population": 73798,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mijas",
    "name": "Mijas",
    "country": "Spain",
    "coordinates": {
      "lat": 36.59575,
      "lng": -4.63728
    },
    "region": "Southern Europe",
    "population": 73787,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "detmold",
    "name": "Detmold",
    "country": "Germany",
    "coordinates": {
      "lat": 51.93855,
      "lng": 8.87318
    },
    "region": "Western Europe",
    "population": 73680,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "canary-wharf",
    "name": "Canary Wharf",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.50519,
      "lng": -0.02085
    },
    "region": "Western Europe",
    "population": 73390,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rugby",
    "name": "Rugby",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.37092,
      "lng": -1.26417
    },
    "region": "Western Europe",
    "population": 73150,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "siemianowice-śląskie",
    "name": "Siemianowice Śląskie",
    "country": "Poland",
    "coordinates": {
      "lat": 50.32738,
      "lng": 19.02901
    },
    "region": "Eastern Europe",
    "population": 73121,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "néa-smýrni",
    "name": "Néa Smýrni",
    "country": "Greece",
    "coordinates": {
      "lat": 37.94504,
      "lng": 23.71416
    },
    "region": "Southern Europe",
    "population": 73076,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rubí",
    "name": "Rubí",
    "country": "Spain",
    "coordinates": {
      "lat": 41.49226,
      "lng": 2.03305
    },
    "region": "Southern Europe",
    "population": 72987,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zlín",
    "name": "Zlín",
    "country": "Czech Republic",
    "coordinates": {
      "lat": 49.22645,
      "lng": 17.67065
    },
    "region": "Central Europe",
    "population": 72973,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ostrów-wielkopolski",
    "name": "Ostrów Wielkopolski",
    "country": "Poland",
    "coordinates": {
      "lat": 51.65501,
      "lng": 17.80686
    },
    "region": "Eastern Europe",
    "population": 72898,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "caserta",
    "name": "Caserta",
    "country": "Italy",
    "coordinates": {
      "lat": 41.07262,
      "lng": 14.33231
    },
    "region": "Southern Europe",
    "population": 72844,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "almelo",
    "name": "Almelo",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.35667,
      "lng": 6.6625
    },
    "region": "Western Europe",
    "population": 72725,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lappeenranta",
    "name": "Lappeenranta",
    "country": "Finland",
    "coordinates": {
      "lat": 61.05871,
      "lng": 28.18871
    },
    "region": "Northern Europe",
    "population": 72646,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "steglitz",
    "name": "Steglitz",
    "country": "Germany",
    "coordinates": {
      "lat": 52.45606,
      "lng": 13.332
    },
    "region": "Western Europe",
    "population": 72464,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "shumen",
    "name": "Shumen",
    "country": "Bulgaria",
    "coordinates": {
      "lat": 43.27064,
      "lng": 26.92286
    },
    "region": "Other",
    "population": 72342,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "maroúsi",
    "name": "Maroúsi",
    "country": "Greece",
    "coordinates": {
      "lat": 38.05,
      "lng": 23.8
    },
    "region": "Southern Europe",
    "population": 72333,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "purley",
    "name": "Purley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.33678,
      "lng": -0.11201
    },
    "region": "Western Europe",
    "population": 72000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gouda",
    "name": "Gouda",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.01667,
      "lng": 4.70833
    },
    "region": "Western Europe",
    "population": 71952,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "guildford",
    "name": "Guildford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.23536,
      "lng": -0.57427
    },
    "region": "Western Europe",
    "population": 71873,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zaandam",
    "name": "Zaandam",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.43854,
      "lng": 4.82643
    },
    "region": "Western Europe",
    "population": 71708,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "borås",
    "name": "Borås",
    "country": "Sweden",
    "coordinates": {
      "lat": 57.72101,
      "lng": 12.9401
    },
    "region": "Northern Europe",
    "population": 71700,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "esbjerg",
    "name": "Esbjerg",
    "country": "Denmark",
    "coordinates": {
      "lat": 55.47028,
      "lng": 8.45187
    },
    "region": "Northern Europe",
    "population": 71698,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "peckham",
    "name": "Peckham",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.47403,
      "lng": -0.06969
    },
    "region": "Western Europe",
    "population": 71552,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fuengirola",
    "name": "Fuengirola",
    "country": "Spain",
    "coordinates": {
      "lat": 36.53998,
      "lng": -4.62473
    },
    "region": "Southern Europe",
    "population": 71482,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "barnsley",
    "name": "Barnsley",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 53.55,
      "lng": -1.48333
    },
    "region": "Western Europe",
    "population": 71447,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "norderstedt",
    "name": "Norderstedt",
    "country": "Germany",
    "coordinates": {
      "lat": 53.6859,
      "lng": 9.98041
    },
    "region": "Western Europe",
    "population": 71439,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "agios-dimitrios",
    "name": "Agios Dimitrios",
    "country": "Greece",
    "coordinates": {
      "lat": 37.93333,
      "lng": 23.73333
    },
    "region": "Southern Europe",
    "population": 71294,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dunkerque",
    "name": "Dunkerque",
    "country": "France",
    "coordinates": {
      "lat": 51.0344,
      "lng": 2.37681
    },
    "region": "Western Europe",
    "population": 71287,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "szolnok",
    "name": "Szolnok",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.18333,
      "lng": 20.2
    },
    "region": "Central Europe",
    "population": 71285,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lüneburg",
    "name": "Lüneburg",
    "country": "Germany",
    "coordinates": {
      "lat": 53.2509,
      "lng": 10.41409
    },
    "region": "Western Europe",
    "population": 71260,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stargard",
    "name": "Stargard",
    "country": "Poland",
    "coordinates": {
      "lat": 53.33672,
      "lng": 15.0499
    },
    "region": "Eastern Europe",
    "population": 71224,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "cremona",
    "name": "Cremona",
    "country": "Italy",
    "coordinates": {
      "lat": 45.13325,
      "lng": 10.02129
    },
    "region": "Southern Europe",
    "population": 71223,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "carpi-centro",
    "name": "Carpi Centro",
    "country": "Italy",
    "coordinates": {
      "lat": 44.78237,
      "lng": 10.8777
    },
    "region": "Southern Europe",
    "population": 71148,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "billstedt",
    "name": "Billstedt",
    "country": "Germany",
    "coordinates": {
      "lat": 53.55,
      "lng": 10.13333
    },
    "region": "Western Europe",
    "population": 71077,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "benidorm",
    "name": "Benidorm",
    "country": "Spain",
    "coordinates": {
      "lat": 38.53816,
      "lng": -0.13098
    },
    "region": "Southern Europe",
    "population": 71034,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "zográfos",
    "name": "Zográfos",
    "country": "Greece",
    "coordinates": {
      "lat": 37.97574,
      "lng": 23.76911
    },
    "region": "Southern Europe",
    "population": 71026,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "celle",
    "name": "Celle",
    "country": "Germany",
    "coordinates": {
      "lat": 52.62264,
      "lng": 10.08047
    },
    "region": "Western Europe",
    "population": 71010,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lowestoft",
    "name": "Lowestoft",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.47523,
      "lng": 1.75167
    },
    "region": "Western Europe",
    "population": 70945,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aubervilliers",
    "name": "Aubervilliers",
    "country": "France",
    "coordinates": {
      "lat": 48.91667,
      "lng": 2.38333
    },
    "region": "Western Europe",
    "population": 70914,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vila-nova-de-gaia",
    "name": "Vila Nova de Gaia",
    "country": "Portugal",
    "coordinates": {
      "lat": 41.12401,
      "lng": -8.61241
    },
    "region": "Southern Europe",
    "population": 70811,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gosport",
    "name": "Gosport",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 50.79509,
      "lng": -1.12902
    },
    "region": "Western Europe",
    "population": 70793,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "södertälje",
    "name": "Södertälje",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.19554,
      "lng": 17.62525
    },
    "region": "Northern Europe",
    "population": 70777,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lelystad",
    "name": "Lelystad",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.50833,
      "lng": 5.475
    },
    "region": "Western Europe",
    "population": 70741,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dinslaken",
    "name": "Dinslaken",
    "country": "Germany",
    "coordinates": {
      "lat": 51.56227,
      "lng": 6.7434
    },
    "region": "Western Europe",
    "population": 70573,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sankt-gallen",
    "name": "Sankt Gallen",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.42391,
      "lng": 9.37477
    },
    "region": "Central Europe",
    "population": 70572,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "pabianice",
    "name": "Pabianice",
    "country": "Poland",
    "coordinates": {
      "lat": 51.66446,
      "lng": 19.35473
    },
    "region": "Eastern Europe",
    "population": 70542,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "altamura",
    "name": "Altamura",
    "country": "Italy",
    "coordinates": {
      "lat": 40.82664,
      "lng": 16.54952
    },
    "region": "Southern Europe",
    "population": 70539,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "lamezia-terme",
    "name": "Lamezia Terme",
    "country": "Italy",
    "coordinates": {
      "lat": 38.96255,
      "lng": 16.30938
    },
    "region": "Southern Europe",
    "population": 70501,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "halmstad",
    "name": "Halmstad",
    "country": "Sweden",
    "coordinates": {
      "lat": 56.67446,
      "lng": 12.85676
    },
    "region": "Northern Europe",
    "population": 70480,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "maidenhead",
    "name": "Maidenhead",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.52279,
      "lng": -0.71986
    },
    "region": "Western Europe",
    "population": 70374,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "gniezno",
    "name": "Gniezno",
    "country": "Poland",
    "coordinates": {
      "lat": 52.53481,
      "lng": 17.58259
    },
    "region": "Eastern Europe",
    "population": 70269,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alphen-aan-den-rijn",
    "name": "Alphen aan den Rijn",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.12917,
      "lng": 4.65546
    },
    "region": "Western Europe",
    "population": 70251,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "alcalá-de-guadaira",
    "name": "Alcalá de Guadaira",
    "country": "Spain",
    "coordinates": {
      "lat": 37.33791,
      "lng": -5.83951
    },
    "region": "Southern Europe",
    "population": 70155,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stafford",
    "name": "Stafford",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 52.80521,
      "lng": -2.11636
    },
    "region": "Western Europe",
    "population": 70145,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bamberg",
    "name": "Bamberg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.89873,
      "lng": 10.90067
    },
    "region": "Western Europe",
    "population": 70047,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "southall",
    "name": "Southall",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.50896,
      "lng": -0.3713
    },
    "region": "Western Europe",
    "population": 70000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "uxbridge",
    "name": "Uxbridge",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.5489,
      "lng": -0.48211
    },
    "region": "Western Europe",
    "population": 70000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "fordon",
    "name": "Fordon",
    "country": "Poland",
    "coordinates": {
      "lat": 53.14821,
      "lng": 18.17036
    },
    "region": "Eastern Europe",
    "population": 70000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "dainava-(kaunas)",
    "name": "Dainava (Kaunas)",
    "country": "Lithuania",
    "coordinates": {
      "lat": 54.91525,
      "lng": 23.96831
    },
    "region": "Northern Europe",
    "population": 70000,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "imola",
    "name": "Imola",
    "country": "Italy",
    "coordinates": {
      "lat": 44.35916,
      "lng": 11.7132
    },
    "region": "Southern Europe",
    "population": 69953,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aigáleo",
    "name": "Aigáleo",
    "country": "Greece",
    "coordinates": {
      "lat": 37.98333,
      "lng": 23.68333
    },
    "region": "Southern Europe",
    "population": 69946,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "mérignac",
    "name": "Mérignac",
    "country": "France",
    "coordinates": {
      "lat": 44.84247,
      "lng": -0.64512
    },
    "region": "Western Europe",
    "population": 69791,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "tournai",
    "name": "Tournai",
    "country": "Belgium",
    "coordinates": {
      "lat": 50.60715,
      "lng": 3.38932
    },
    "region": "Western Europe",
    "population": 69554,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "kungsholmen",
    "name": "Kungsholmen",
    "country": "Sweden",
    "coordinates": {
      "lat": 59.33183,
      "lng": 18.04118
    },
    "region": "Northern Europe",
    "population": 69363,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "bitola",
    "name": "Bitola",
    "country": "Macedonia, The former Yugoslav Rep. of",
    "coordinates": {
      "lat": 41.03143,
      "lng": 21.33474
    },
    "region": "Southern Europe",
    "population": 69287,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "vaslui",
    "name": "Vaslui",
    "country": "Romania",
    "coordinates": {
      "lat": 46.63333,
      "lng": 27.73333
    },
    "region": "Eastern Europe",
    "population": 69225,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "suwałki",
    "name": "Suwałki",
    "country": "Poland",
    "coordinates": {
      "lat": 54.11175,
      "lng": 22.93087
    },
    "region": "Eastern Europe",
    "population": 69222,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hunedoara",
    "name": "Hunedoara",
    "country": "Romania",
    "coordinates": {
      "lat": 45.75,
      "lng": 22.9
    },
    "region": "Eastern Europe",
    "population": 69136,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "san-carlo-all'arena",
    "name": "San Carlo All'Arena",
    "country": "Italy",
    "coordinates": {
      "lat": 40.86511,
      "lng": 14.26291
    },
    "region": "Southern Europe",
    "population": 69094,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "giurgiu",
    "name": "Giurgiu",
    "country": "Romania",
    "coordinates": {
      "lat": 43.88664,
      "lng": 25.9627
    },
    "region": "Eastern Europe",
    "population": 69067,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ostend",
    "name": "Ostend",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.21551,
      "lng": 2.927
    },
    "region": "Western Europe",
    "population": 69011,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "sint-niklaas",
    "name": "Sint-Niklaas",
    "country": "Belgium",
    "coordinates": {
      "lat": 51.16509,
      "lng": 4.1437
    },
    "region": "Western Europe",
    "population": 69010,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "royal-tunbridge-wells",
    "name": "Royal Tunbridge Wells",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.13321,
      "lng": 0.26256
    },
    "region": "Western Europe",
    "population": 68910,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "hoorn",
    "name": "Hoorn",
    "country": "Netherlands",
    "coordinates": {
      "lat": 52.6425,
      "lng": 5.05972
    },
    "region": "Western Europe",
    "population": 68852,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "ponferrada",
    "name": "Ponferrada",
    "country": "Spain",
    "coordinates": {
      "lat": 42.54664,
      "lng": -6.59619
    },
    "region": "Southern Europe",
    "population": 68736,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "aschaffenburg",
    "name": "Aschaffenburg",
    "country": "Germany",
    "coordinates": {
      "lat": 49.97704,
      "lng": 9.15214
    },
    "region": "Western Europe",
    "population": 68551,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "budapest-xvi.-kerület",
    "name": "Budapest XVI. kerület",
    "country": "Hungary",
    "coordinates": {
      "lat": 47.51482,
      "lng": 19.17028
    },
    "region": "Central Europe",
    "population": 68484,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "rivas-vaciamadrid",
    "name": "Rivas-Vaciamadrid",
    "country": "Spain",
    "coordinates": {
      "lat": 40.32605,
      "lng": -3.51089
    },
    "region": "Southern Europe",
    "population": 68405,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "wimbledon",
    "name": "Wimbledon",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.42212,
      "lng": -0.20805
    },
    "region": "Western Europe",
    "population": 68187,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "majadahonda",
    "name": "Majadahonda",
    "country": "Spain",
    "coordinates": {
      "lat": 40.47353,
      "lng": -3.87182
    },
    "region": "Southern Europe",
    "population": 68110,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "neubrandenburg",
    "name": "Neubrandenburg",
    "country": "Germany",
    "coordinates": {
      "lat": 53.56414,
      "lng": 13.27532
    },
    "region": "Western Europe",
    "population": 68082,
    "isTransportHub": false,
    "size": "small"
  },
  {
    "id": "stamford-hill",
    "name": "Stamford Hill",
    "country": "United Kingdom",
    "coordinates": {
      "lat": 51.56872,
      "lng": -0.07334
    },
    "region": "Western Europe",
    "population": 68050,
    "isTransportHub": false,
    "size": "small"
  }
];

export const cities: readonly City[] = citiesData as unknown as City[];
export default cities;
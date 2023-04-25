const COUNTRIES = [
  {
    name: "Afghanistan",
    code: "AF",
    callingCode: "+93",
  },
  {
    name: "Åland Islands",
    code: "AX",
    callingCode: "+358",
  },
  {
    name: "Albania",
    code: "AL",
    callingCode: "+355",
  },
  {
    name: "Algeria",
    code: "DZ",
    callingCode: "+213",
  },
  {
    name: "American Samoa",
    code: "AS",
    callingCode: "+1-684",
  },
  {
    name: "Andorra",
    code: "AD",
    callingCode: "+376",
  },
  {
    name: "Angola",
    code: "AO",
    callingCode: "+244",
  },
  {
    name: "Anguilla",
    code: "AI",
    callingCode: "+1-264",
  },
  {
    name: "Antarctica",
    code: "AQ",
    callingCode: "+672",
  },
  {
    name: "Antigua and Barbuda",
    code: "AG",
    callingCode: "+1268",
  },
  {
    name: "Argentina",
    code: "AR",
    callingCode: "+54",
  },
  {
    name: "Armenia",
    code: "AM",
    callingCode: "+374",
  },
  {
    name: "Aruba",
    code: "AW",
    callingCode: "+297",
  },
  {
    name: "Australia",
    code: "AU",
    callingCode: "+61",
  },
  {
    name: "Austria",
    code: "AT",
    callingCode: "+43",
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    callingCode: "+994",
  },
  {
    name: "Bahamas",
    code: "BS",
    callingCode: "+1242",
  },
  {
    name: "Bahrain",
    code: "BH",
    callingCode: "+973",
  },
  {
    name: "Bangladesh",
    code: "BD",
    callingCode: "+880",
  },
  {
    name: "Barbados",
    code: "BB",
    callingCode: "+1246",
  },
  {
    name: "Belarus",
    code: "BY",
    callingCode: "+375",
  },
  {
    name: "Belgium",
    code: "BE",
    callingCode: "+32",
  },
  {
    name: "Belize",
    code: "BZ",
    callingCode: "+501",
  },
  {
    name: "Benin",
    code: "BJ",
    callingCode: "+229",
  },
  {
    name: "Bermuda",
    code: "BM",
    callingCode: "+1-441",
  },
  {
    name: "Bhutan",
    code: "BT",
    callingCode: "+975",
  },
  {
    name: "Bolivarian Republic of Venezuela",
    code: "VE",
    callingCode: "+58",
  },
  {
    name: "Bolivia",
    code: "BO",
    callingCode: "+591",
  },
  {
    name: "Bonaire, Sint Eustatius and Saba",
    code: "BQ",
    callingCode: "+599",
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    callingCode: "+387",
  },
  {
    name: "Botswana",
    code: "BW",
    callingCode: "+267",
  },
  {
    name: "Bouvet Island",
    code: "BV",
    callingCode: "+47",
  },
  {
    name: "Brazil",
    code: "BR",
    callingCode: "+55",
  },
  {
    name: "British Indian Ocean Territory",
    code: "IO",
    callingCode: "+246",
  },
  {
    name: "Brunei",
    code: "BN",
    callingCode: "+673",
  },
  {
    name: "Bulgaria",
    code: "BG",
    callingCode: "+359",
  },
  {
    name: "Burkina Faso",
    code: "BF",
    callingCode: "+226",
  },
  {
    name: "Burundi",
    code: "BI",
    callingCode: "+257",
  },
  {
    name: "Cabo Verde",
    code: "CV",
    callingCode: "+238",
  },
  {
    name: "Cambodia",
    code: "KH",
    callingCode: "+855",
  },
  {
    name: "Cameroon",
    code: "CM",
    callingCode: "+237",
  },
  {
    name: "Canada",
    code: "CA",
    callingCode: "+1",
  },
  {
    name: "Cayman Islands",
    code: "KY",
    callingCode: "+1-345",
  },
  {
    name: "Central African Republic",
    code: "CF",
    callingCode: "+236",
  },
  {
    name: "Chad",
    code: "TD",
    callingCode: "+235",
  },
  {
    name: "Chile",
    code: "CL",
    callingCode: "+56",
  },
  {
    name: "China",
    code: "CN",
    callingCode: "+86",
  },
  {
    name: "Christmas Island",
    code: "CX",
    callingCode: "+61",
  },
  {
    name: "Cocos (Keeling) Islands",
    code: "CC",
    callingCode: "+61",
  },
  {
    name: "Colombia",
    code: "CO",
    callingCode: "+57",
  },
  {
    name: "Comoros",
    code: "KM",
    callingCode: "+269",
  },
  {
    name: "Congo",
    code: "CG",
    callingCode: "+242",
  },
  {
    name: "Congo (DRC)",
    code: "CD",
    callingCode: "+243",
  },
  {
    name: "Cook Islands",
    code: "CK",
    callingCode: "+682",
  },
  {
    name: "Costa Rica",
    code: "CR",
    callingCode: "+506",
  },
  {
    name: "Côte d'Ivoire",
    code: "CI",
    callingCode: "+225",
  },
  {
    name: "Croatia",
    code: "HR",
    callingCode: "+385",
  },
  {
    name: "Cuba",
    code: "CU",
    callingCode: "+53",
  },
  {
    name: "Curaçao",
    code: "CW",
    callingCode: "+599",
  },
  {
    name: "Cyprus",
    code: "CY",
    callingCode: "+357",
  },
  {
    name: "Czech Republic",
    code: "CZ",
    callingCode: "+420",
  },
  {
    name: "Democratic Republic of Timor-Leste",
    code: "TL",
    callingCode: "+670",
  },
  {
    name: "Denmark",
    code: "DK",
    callingCode: "+45",
  },
  {
    name: "Djibouti",
    code: "DJ",
    callingCode: "+253",
  },
  {
    name: "Dominica",
    code: "DM",
    callingCode: "+1-767",
  },
  {
    name: "Dominican Republic",
    code: "DO",
    callingCode: "+1-829",
  },
  {
    name: "Dominican Republic",
    code: "DO",
    callingCode: "+1-829",
  },
  {
    name: "Ecuador",
    code: "EC",
    callingCode: "+593",
  },
  {
    name: "Egypt",
    code: "EG",
    callingCode: "+20",
  },
  {
    name: "El Salvador",
    code: "SV",
    callingCode: "+503",
  },
  {
    name: "Equatorial Guinea",
    code: "GQ",
    callingCode: "+240",
  },
  {
    name: "Eritrea",
    code: "ER",
    callingCode: "+291",
  },
  {
    name: "Estonia",
    code: "EE",
    callingCode: "+372",
  },
  {
    name: "Ethiopia",
    code: "ET",
    callingCode: "+251",
  },
  {
    name: "Falkland Islands (Islas Malvinas)",
    code: "FK",
    callingCode: "+500",
  },
  {
    name: "Faroe Islands",
    code: "FO",
    callingCode: "+298",
  },
  {
    name: "Fiji Islands",
    code: "FJ",
    callingCode: "+679",
  },
  {
    name: "Finland",
    code: "FI",
    callingCode: "+358",
  },
  {
    name: "France",
    code: "FR",
    callingCode: "+33",
  },
  {
    name: "French Guiana",
    code: "GF",
    callingCode: "+594",
  },
  {
    name: "French Polynesia",
    code: "PF",
    callingCode: "+689",
  },
  {
    name: "French Southern and Antarctic Lands",
    code: "TF",
    callingCode: "+0",
  },
  {
    name: "Gabon",
    code: "GA",
    callingCode: "+241",
  },
  {
    name: "Gambia, The",
    code: "GM",
    callingCode: "+220",
  },
  {
    name: "Georgia",
    code: "GE",
    callingCode: "+995",
  },
  {
    name: "Germany",
    code: "DE",
    callingCode: "+49",
  },
  {
    name: "Ghana",
    code: "GH",
    callingCode: "+233",
  },
  {
    name: "Gibraltar",
    code: "GI",
    callingCode: "+350",
  },
  {
    name: "Greece",
    code: "GR",
    callingCode: "+30",
  },
  {
    name: "Greenland",
    code: "GL",
    callingCode: "+299",
  },
  {
    name: "Grenada",
    code: "GD",
    callingCode: "+1-473",
  },
  {
    name: "Guadeloupe",
    code: "GP",
    callingCode: "+590",
  },
  {
    name: "Guam",
    code: "GU",
    callingCode: "+1-671",
  },
  {
    name: "Guatemala",
    code: "GT",
    callingCode: "+502",
  },
  {
    name: "Guernsey",
    code: "GG",
    callingCode: "+44-1481",
  },
  {
    name: "Guinea",
    code: "GN",
    callingCode: "+224",
  },
  {
    name: "Guinea-Bissau",
    code: "GW",
    callingCode: "+245",
  },
  {
    name: "Guyana",
    code: "GY",
    callingCode: "+592",
  },
  {
    name: "Haiti",
    code: "HT",
    callingCode: "+509",
  },
  {
    name: "Heard Island and McDonald Islands",
    code: "HM",
    callingCode: "+0",
  },
  {
    name: "Honduras",
    code: "HN",
    callingCode: "+504",
  },
  {
    name: "Hong Kong SAR",
    code: "HK",
    callingCode: "+852",
  },
  {
    name: "Hungary",
    code: "HU",
    callingCode: "+36",
  },
  {
    name: "Iceland",
    code: "IS",
    callingCode: "+354",
  },
  {
    name: "India",
    code: "IN",
    callingCode: "+91",
  },
  {
    name: "Indonesia",
    code: "ID",
    callingCode: "+62",
  },
  {
    name: "Iran",
    code: "IR",
    callingCode: "+98",
  },
  {
    name: "Iraq",
    code: "IQ",
    callingCode: "+964",
  },
  {
    name: "Ireland",
    code: "IE",
    callingCode: "+353",
  },
  {
    name: "Israel",
    code: "IL",
    callingCode: "+972",
  },
  {
    name: "Italy",
    code: "IT",
    callingCode: "+39",
  },
  {
    name: "Jamaica",
    code: "JM",
    callingCode: "+1-876",
  },
  {
    name: "Jan Mayen",
    code: "SJ",
    callingCode: "+47",
  },
  {
    name: "Japan",
    code: "JP",
    callingCode: "+81",
  },
  {
    name: "Jersey",
    code: "JE",
    callingCode: "+44",
  },
  {
    name: "Jordan",
    code: "JO",
    callingCode: "+962",
  },
  {
    name: "Kazakhstan",
    code: "KZ",
    callingCode: "+7",
  },
  {
    name: "Kenya",
    code: "KE",
    callingCode: "+254",
  },
  {
    name: "Kiribati",
    code: "KI",
    callingCode: "+686",
  },
  {
    name: "Korea",
    code: "KR",
    callingCode: "+82",
  },
  {
    name: "Kosovo",
    code: "XK",
    callingCode: "+383",
  },
  {
    name: "Kuwait",
    code: "KW",
    callingCode: "+965",
  },
  {
    name: "Kyrgyzstan",
    code: "KG",
    callingCode: "+996",
  },
  {
    name: "Laos",
    code: "LA",
    callingCode: "+856",
  },
  {
    name: "Latvia",
    code: "LV",
    callingCode: "+371",
  },
  {
    name: "Lebanon",
    code: "LB",
    callingCode: "+961",
  },
  {
    name: "Lesotho",
    code: "LS",
    callingCode: "+266",
  },
  {
    name: "Liberia",
    code: "LR",
    callingCode: "+231",
  },
  {
    name: "Libya",
    code: "LY",
    callingCode: "+218",
  },
  {
    name: "Liechtenstein",
    code: "LI",
    callingCode: "+423",
  },
  {
    name: "Lithuania",
    code: "LT",
    callingCode: "+370",
  },
  {
    name: "Luxembourg",
    code: "LU",
    callingCode: "+352",
  },
  {
    name: "Macao SAR",
    code: "MO",
    callingCode: "+853",
  },
  {
    name: "Macedonia, Former Yugoslav Republic of",
    code: "MK",
    callingCode: "+389",
  },
  {
    name: "Madagascar",
    code: "MG",
    callingCode: "+261",
  },
  {
    name: "Malawi",
    code: "MW",
    callingCode: "+265",
  },
  {
    name: "Malaysia",
    code: "MY",
    callingCode: "+60",
  },
  {
    name: "Maldives",
    code: "MV",
    callingCode: "+960",
  },
  {
    name: "Mali",
    code: "ML",
    callingCode: "+223",
  },
  {
    name: "Malta",
    code: "MT",
    callingCode: "+356",
  },
  {
    name: "Man, Isle of",
    code: "IM",
    callingCode: "+44",
  },
  {
    name: "Marshall Islands",
    code: "MH",
    callingCode: "+692",
  },
  {
    name: "Martinique",
    code: "MQ",
    callingCode: "+596",
  },
  {
    name: "Mauritania",
    code: "MR",
    callingCode: "+222",
  },
  {
    name: "Mauritius",
    code: "MU",
    callingCode: "+230",
  },
  {
    name: "Mayotte",
    code: "YT",
    callingCode: "+262",
  },
  {
    name: "Mexico",
    code: "MX",
    callingCode: "+52",
  },
  {
    name: "Micronesia",
    code: "FM",
    callingCode: "+691",
  },
  {
    name: "Moldova",
    code: "MD",
    callingCode: "+373",
  },
  {
    name: "Monaco",
    code: "MC",
    callingCode: "+377",
  },
  {
    name: "Mongolia",
    code: "MN",
    callingCode: "+976",
  },
  {
    name: "Montenegro",
    code: "ME",
    callingCode: "+382",
  },
  {
    name: "Montserrat",
    code: "MS",
    callingCode: "+1-664",
  },
  {
    name: "Morocco",
    code: "MA",
    callingCode: "+212",
  },
  {
    name: "Mozambique",
    code: "MZ",
    callingCode: "+258",
  },
  {
    name: "Myanmar",
    code: "MM",
    callingCode: "+95",
  },
  {
    name: "Namibia",
    code: "NA",
    callingCode: "+264",
  },
  {
    name: "Nauru",
    code: "NR",
    callingCode: "+674",
  },
  {
    name: "Nepal",
    code: "NP",
    callingCode: "+977",
  },
  {
    name: "Netherlands",
    code: "NL",
    callingCode: "+31",
  },
  {
    name: "New Caledonia",
    code: "NC",
    callingCode: "+687",
  },
  {
    name: "New Zealand",
    code: "NZ",
    callingCode: "+64",
  },
  {
    name: "Nicaragua",
    code: "NI",
    callingCode: "+505",
  },
  {
    name: "Niger",
    code: "NE",
    callingCode: "+227",
  },
  {
    name: "Nigeria",
    code: "NG",
    callingCode: "+234",
  },
  {
    name: "Niue",
    code: "NU",
    callingCode: "+683",
  },
  {
    name: "Norfolk Island",
    code: "NF",
    callingCode: "+672",
  },
  {
    name: "North Korea",
    code: "KP",
    callingCode: "+850",
  },
  {
    name: "Northern Mariana Islands",
    code: "MP",
    callingCode: "+1-670",
  },
  {
    name: "Norway",
    code: "NO",
    callingCode: "+47",
  },
  {
    name: "Oman",
    code: "OM",
    callingCode: "+968",
  },
  {
    name: "Pakistan",
    code: "PK",
    callingCode: "+92",
  },
  {
    name: "Palau",
    code: "PW",
    callingCode: "+680",
  },
  {
    name: "Palestinian Authority",
    code: "PS",
    callingCode: "+970",
  },
  {
    name: "Panama",
    code: "PA",
    callingCode: "+507",
  },
  {
    name: "Papua New Guinea",
    code: "PG",
    callingCode: "+675",
  },
  {
    name: "Paraguay",
    code: "PY",
    callingCode: "+595",
  },
  {
    name: "Peru",
    code: "PE",
    callingCode: "+51",
  },
  {
    name: "Philippines",
    code: "PH",
    callingCode: "+63",
  },
  {
    name: "Pitcairn Islands",
    code: "PN",
    callingCode: "+870",
  },
  {
    name: "Poland",
    code: "PL",
    callingCode: "+48",
  },
  {
    name: "Portugal",
    code: "PT",
    callingCode: "+351",
  },
  {
    name: "Puerto Rico",
    code: "PR",
    callingCode: "+1-787",
  },
  {
    name: "Qatar",
    code: "QA",
    callingCode: "+974",
  },
  {
    name: "Reunion",
    code: "RE",
    callingCode: "+262",
  },
  {
    name: "Romania",
    code: "RO",
    callingCode: "+40",
  },
  {
    name: "Russia",
    code: "RU",
    callingCode: "+7",
  },
  {
    name: "Rwanda",
    code: "RW",
    callingCode: "+250",
  },
  {
    name: "Saint Barthélemy",
    code: "BL",
    callingCode: "+590",
  },
  {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    code: "SH",
    callingCode: "+290",
  },
  {
    name: "Saint Kitts and Nevis",
    code: "KN",
    callingCode: "+1-869",
  },
  {
    name: "Saint Lucia",
    code: "LC",
    callingCode: "+1-758",
  },
  {
    name: "Saint Martin (French part)",
    code: "MF",
    callingCode: "+590",
  },
  {
    name: "Saint Pierre and Miquelon",
    code: "PM",
    callingCode: "+508",
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    callingCode: "+1-784",
  },
  {
    name: "Samoa",
    code: "WS",
    callingCode: "+685",
  },
  {
    name: "San Marino",
    code: "SM",
    callingCode: "+378",
  },
  {
    name: "São Tomé and Príncipe",
    code: "ST",
    callingCode: "+239",
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    callingCode: "+966",
  },
  {
    name: "Senegal",
    code: "SN",
    callingCode: "+221",
  },
  {
    name: "Serbia",
    code: "RS",
    callingCode: "+381",
  },
  {
    name: "Seychelles",
    code: "SC",
    callingCode: "+248",
  },
  {
    name: "Sierra Leone",
    code: "SL",
    callingCode: "+232",
  },
  {
    name: "Singapore",
    code: "SG",
    callingCode: "+65",
  },
  {
    name: "Sint Maarten (Dutch part)",
    code: "SX",
    callingCode: "+599",
  },
  {
    name: "Slovakia",
    code: "SK",
    callingCode: "+421",
  },
  {
    name: "Slovenia",
    code: "SI",
    callingCode: "+386",
  },
  {
    name: "Solomon Islands",
    code: "SB",
    callingCode: "+677",
  },
  {
    name: "Somalia",
    code: "SO",
    callingCode: "+252",
  },
  {
    name: "South Africa",
    code: "ZA",
    callingCode: "+27",
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    code: "GS",
    callingCode: "+500",
  },
  {
    name: "South Sudan",
    code: "SS",
    callingCode: "+211",
  },
  {
    name: "Spain",
    code: "ES",
    callingCode: "+34",
  },
  {
    name: "Sri Lanka",
    code: "LK",
    callingCode: "+94",
  },
  {
    name: "Sudan",
    code: "SD",
    callingCode: "+249",
  },
  {
    name: "Suriname",
    code: "SR",
    callingCode: "+597",
  },
  {
    name: "Svalbard",
    code: "SJ",
    callingCode: "+47",
  },
  {
    name: "Swaziland",
    code: "SZ",
    callingCode: "+268",
  },
  {
    name: "Sweden",
    code: "SE",
    callingCode: "+46",
  },
  {
    name: "Switzerland",
    code: "CH",
    callingCode: "+41",
  },
  {
    name: "Syria",
    code: "SY",
    callingCode: "+963",
  },
  {
    name: "Taiwan",
    code: "TW",
    callingCode: "+886",
  },
  {
    name: "Tajikistan",
    code: "TJ",
    callingCode: "+992",
  },
  {
    name: "Tanzania",
    code: "TZ",
    callingCode: "+255",
  },
  {
    name: "Thailand",
    code: "TH",
    callingCode: "+66",
  },
  {
    name: "Togo",
    code: "TG",
    callingCode: "+228",
  },
  {
    name: "Tokelau",
    code: "TK",
    callingCode: "+690",
  },
  {
    name: "Tonga",
    code: "TO",
    callingCode: "+676",
  },
  {
    name: "Trinidad and Tobago",
    code: "TT",
    callingCode: "+1-868",
  },
  {
    name: "Tunisia",
    code: "TN",
    callingCode: "+216",
  },
  {
    name: "Turkey",
    code: "TR",
    callingCode: "+90",
  },
  {
    name: "Turkmenistan",
    code: "TM",
    callingCode: "+993",
  },
  {
    name: "Turks and Caicos Islands",
    code: "TC",
    callingCode: "+1-649",
  },
  {
    name: "Tuvalu",
    code: "TV",
    callingCode: "+688",
  },
  {
    name: "U.S. Minor Outlying Islands",
    code: "UM",
    callingCode: "+1",
  },
  {
    name: "Uganda",
    code: "UG",
    callingCode: "+256",
  },
  {
    name: "Ukraine",
    code: "UA",
    callingCode: "+380",
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    callingCode: "+971",
  },
  {
    name: "United Kingdom",
    code: "GB",
    callingCode: "+44",
  },
  {
    name: "United States",
    code: "US",
    callingCode: "+1",
  },
  {
    name: "Uruguay",
    code: "UY",
    callingCode: "+598",
  },
  {
    name: "Uzbekistan",
    code: "UZ",
    callingCode: "+998",
  },
  {
    name: "Vanuatu",
    code: "VU",
    callingCode: "+678",
  },
  {
    name: "Vatican City",
    code: "VA",
    callingCode: "+379",
  },
  {
    name: "Vietnam",
    code: "VN",
    callingCode: "+84",
  },
  {
    name: "Virgin Islands, U.S.",
    code: "VI",
    callingCode: "+1-340",
  },
  {
    name: "Virgin Islands, British",
    code: "VG",
    callingCode: "+1-284",
  },
  {
    name: "Wallis and Futuna",
    code: "WF",
    callingCode: "+681",
  },
  {
    name: "Yemen",
    code: "YE",
    callingCode: "+967",
  },
  {
    name: "Zambia",
    code: "ZM",
    callingCode: "+260",
  },
  {
    name: "Zimbabwe",
    code: "ZW",
    callingCode: "+263",
  },
];

const compareByCode = (a, b) => {
  if (a.code < b.code) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  return 0;
};

// Sorts in alphabetical order.
COUNTRIES.sort(compareByCode);

export default COUNTRIES;

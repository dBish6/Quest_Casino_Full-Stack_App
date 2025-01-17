const n=new Set(["jpeg","jpg","png","webp"]);var a,e,i;!function(n){n.INITIALIZE_FRIENDS="initialize_friends",n.MANAGE_FRIEND_REQUEST="manage_friend_request",n.UNFRIEND="unfriend",n.FRIENDS_UPDATE="friends_update",n.FRIEND_ACTIVITY="friend_activity",n.USER_ACTIVITY="user_activity",n.NEW_NOTIFICATION="new_notification"}(a||(a={})),function(n){n.MANAGE_CHAT_ROOM="manage_chat_room",n.TYPING="typing",n.FRIEND_TYPING_ACTIVITY="friend_typing_activity",n.CHAT_MESSAGE="chat_message",n.CHAT_MESSAGE_SENT="chat_message_sent"}(e||(e={})),function(n){n.MANAGE_RECORD="manage_record",n.MANAGE_PROGRESS="manage_progress"}(i||(i={}));const o=["active","development","inactive"],c=["table","slots","dice"],t=["money","spins"],r=["all","blackjack","slots","dice"],l=["active","inactive"],b=["deposit","withdraw"],m=[{name:"Afghanistan",abbr:"AF",callingCode:"+93",continent:"Asia"},{name:"Åland Islands",abbr:"AX",callingCode:"+358",continent:"Europe"},{name:"Albania",abbr:"AL",callingCode:"+355",continent:"Europe"},{name:"Algeria",abbr:"DZ",callingCode:"+213",continent:"Africa"},{name:"American Samoa",abbr:"AS",callingCode:"+1684",continent:"Oceania"},{name:"Andorra",abbr:"AD",callingCode:"+376",continent:"Europe"},{name:"Angola",abbr:"AO",callingCode:"+244",continent:"Africa"},{name:"Anguilla",abbr:"AI",callingCode:"+1264",continent:"North America"},{name:"Antarctica",abbr:"AQ",callingCode:"+672",continent:"Antarctica"},{name:"Antigua and Barbuda",abbr:"AG",callingCode:"+1268",continent:"North America"},{name:"Argentina",abbr:"AR",callingCode:"+54",continent:"South America"},{name:"Armenia",abbr:"AM",callingCode:"+374",continent:"Asia"},{name:"Aruba",abbr:"AW",callingCode:"+297",continent:"North America"},{name:"Australia",abbr:"AU",callingCode:"+61",continent:"Oceania"},{name:"Austria",abbr:"AT",callingCode:"+43",continent:"Europe"},{name:"Azerbaijan",abbr:"AZ",callingCode:"+994",continent:"Asia"},{name:"Bahamas",abbr:"BS",callingCode:"+1242",continent:"North America"},{name:"Bahrain",abbr:"BH",callingCode:"+973",continent:"Asia"},{name:"Bangladesh",abbr:"BD",callingCode:"+880",continent:"Asia"},{name:"Barbados",abbr:"BB",callingCode:"+1246",continent:"North America"},{name:"Belarus",abbr:"BY",callingCode:"+375",continent:"Europe"},{name:"Belgium",abbr:"BE",callingCode:"+32",continent:"Europe"},{name:"Belize",abbr:"BZ",callingCode:"+501",continent:"North America"},{name:"Benin",abbr:"BJ",callingCode:"+229",continent:"Africa"},{name:"Bermuda",abbr:"BM",callingCode:"+1441",continent:"North America"},{name:"Bhutan",abbr:"BT",callingCode:"+975",continent:"Asia"},{name:"Bolivarian Republic of Venezuela",abbr:"VE",callingCode:"+58",continent:"South America"},{name:"Bolivia",abbr:"BO",callingCode:"+591",continent:"South America"},{name:"Bonaire, Sint Eustatius and Saba",abbr:"BQ",callingCode:"+599",continent:"North America"},{name:"Bosnia and Herzegovina",abbr:"BA",callingCode:"+387",continent:"Europe"},{name:"Botswana",abbr:"BW",callingCode:"+267",continent:"Africa"},{name:"Bouvet Island",abbr:"BV",callingCode:"+47",continent:"Antarctica"},{name:"Brazil",abbr:"BR",callingCode:"+55",continent:"South America"},{name:"British Indian Ocean Territory",abbr:"IO",callingCode:"+246",continent:"Asia"},{name:"Brunei",abbr:"BN",callingCode:"+673",continent:"Asia"},{name:"Bulgaria",abbr:"BG",callingCode:"+359",continent:"Europe"},{name:"Burkina Faso",abbr:"BF",callingCode:"+226",continent:"Africa"},{name:"Burundi",abbr:"BI",callingCode:"+257",continent:"Africa"},{name:"Cabo Verde",abbr:"CV",callingCode:"+238",continent:"Africa"},{name:"Cambodia",abbr:"KH",callingCode:"+855",continent:"Asia"},{name:"Cameroon",abbr:"CM",callingCode:"+237",continent:"Africa"},{name:"Canada",abbr:"CA",callingCode:"+1",continent:"North America"},{name:"Cayman Islands",abbr:"KY",callingCode:"+1345",continent:"North America"},{name:"Central African Republic",abbr:"CF",callingCode:"+236",continent:"Africa"},{name:"Chad",abbr:"TD",callingCode:"+235",continent:"Africa"},{name:"Chile",abbr:"CL",callingCode:"+56",continent:"South America"},{name:"China",abbr:"CN",callingCode:"+86",continent:"Asia"},{name:"Christmas Island",abbr:"CX",callingCode:"+61",continent:"Asia"},{name:"Cocos (Keeling) Islands",abbr:"CC",callingCode:"+61",continent:"Asia"},{name:"Colombia",abbr:"CO",callingCode:"+57",continent:"South America"},{name:"Comoros",abbr:"KM",callingCode:"+269",continent:"Africa"},{name:"Congo",abbr:"CG",callingCode:"+242",continent:"Africa"},{name:"Congo (DRC)",abbr:"CD",callingCode:"+243",continent:"Africa"},{name:"Cook Islands",abbr:"CK",callingCode:"+682",continent:"Oceania"},{name:"Costa Rica",abbr:"CR",callingCode:"+506",continent:"North America"},{name:"Côte d'Ivoire",abbr:"CI",callingCode:"+225",continent:"Africa"},{name:"Croatia",abbr:"HR",callingCode:"+385",continent:"Europe"},{name:"Cuba",abbr:"CU",callingCode:"+53",continent:"North America"},{name:"Curaçao",abbr:"CW",callingCode:"+599",continent:"North America"},{name:"Cyprus",abbr:"CY",callingCode:"+357",continent:"Asia"},{name:"Czech Republic",abbr:"CZ",callingCode:"+420",continent:"Europe"},{name:"Democratic Republic of Timor-Leste",abbr:"TL",callingCode:"+670",continent:"Asia"},{name:"Denmark",abbr:"DK",callingCode:"+45",continent:"Europe"},{name:"Djibouti",abbr:"DJ",callingCode:"+253",continent:"Africa"},{name:"Dominica",abbr:"DM",callingCode:"+1767",continent:"North America"},{name:"Dominican Republic",abbr:"DO",callingCode:"+1829",continent:"North America"},{name:"Ecuador",abbr:"EC",callingCode:"+593",continent:"South America"},{name:"Egypt",abbr:"EG",callingCode:"+20",continent:"Africa"},{name:"El Salvador",abbr:"SV",callingCode:"+503",continent:"North America"},{name:"Equatorial Guinea",abbr:"GQ",callingCode:"+240",continent:"Africa"},{name:"Eritrea",abbr:"ER",callingCode:"+291",continent:"Africa"},{name:"Estonia",abbr:"EE",callingCode:"+372",continent:"Europe"},{name:"Ethiopia",abbr:"ET",callingCode:"+251",continent:"Africa"},{name:"Falkland Islands (Islas Malvinas)",abbr:"FK",callingCode:"+500",continent:"South America"},{name:"Faroe Islands",abbr:"FO",callingCode:"+298",continent:"Europe"},{name:"Fiji Islands",abbr:"FJ",callingCode:"+679",continent:"Oceania"},{name:"Finland",abbr:"FI",callingCode:"+358",continent:"Europe"},{name:"France",abbr:"FR",callingCode:"+33",continent:"Europe"},{name:"French Guiana",abbr:"GF",callingCode:"+594",continent:"South America"},{name:"French Polynesia",abbr:"PF",callingCode:"+689",continent:"Oceania"},{name:"French Southern and Antarctic Lands",abbr:"TF",callingCode:"+0",continent:"Antarctica"},{name:"Gabon",abbr:"GA",callingCode:"+241",continent:"Africa"},{name:"Gambia, The",abbr:"GM",callingCode:"+220",continent:"Africa"},{name:"Georgia",abbr:"GE",callingCode:"+995",continent:"Asia"},{name:"Germany",abbr:"DE",callingCode:"+49",continent:"Europe"},{name:"Ghana",abbr:"GH",callingCode:"+233",continent:"Africa"},{name:"Gibraltar",abbr:"GI",callingCode:"+350",continent:"Europe"},{name:"Greece",abbr:"GR",callingCode:"+30",continent:"Europe"},{name:"Greenland",abbr:"GL",callingCode:"+299",continent:"North America"},{name:"Grenada",abbr:"GD",callingCode:"+1473",continent:"North America"},{name:"Guadeloupe",abbr:"GP",callingCode:"+590",continent:"North America"},{name:"Guam",abbr:"GU",callingCode:"+1671",continent:"Oceania"},{name:"Guatemala",abbr:"GT",callingCode:"+502",continent:"North America"},{name:"Guernsey",abbr:"GG",callingCode:"+44",continent:"Europe"},{name:"Guinea",abbr:"GN",callingCode:"+224",continent:"Africa"},{name:"Guinea-Bissau",abbr:"GW",callingCode:"+245",continent:"Africa"},{name:"Guyana",abbr:"GY",callingCode:"+592",continent:"South America"},{name:"Haiti",abbr:"HT",callingCode:"+509",continent:"North America"},{name:"Heard Island and McDonald Islands",abbr:"HM",callingCode:"+0",continent:"Antarctica"},{name:"Honduras",abbr:"HN",callingCode:"+504",continent:"North America"},{name:"Hong Kong",abbr:"HK",callingCode:"+852",continent:"Asia"},{name:"Hungary",abbr:"HU",callingCode:"+36",continent:"Europe"},{name:"Iceland",abbr:"IS",callingCode:"+354",continent:"Europe"},{name:"India",abbr:"IN",callingCode:"+91",continent:"Asia"},{name:"Indonesia",abbr:"ID",callingCode:"+62",continent:"Asia"},{name:"Iran",abbr:"IR",callingCode:"+98",continent:"Asia"},{name:"Iraq",abbr:"IQ",callingCode:"+964",continent:"Asia"},{name:"Ireland",abbr:"IE",callingCode:"+353",continent:"Europe"},{name:"Isle of Man",abbr:"IM",callingCode:"+44",continent:"Europe"},{name:"Israel",abbr:"IL",callingCode:"+972",continent:"Asia"},{name:"Italy",abbr:"IT",callingCode:"+39",continent:"Europe"},{name:"Jamaica",abbr:"JM",callingCode:"+1876",continent:"North America"},{name:"Japan",abbr:"JP",callingCode:"+81",continent:"Asia"},{name:"Jersey",abbr:"JE",callingCode:"+44",continent:"Europe"},{name:"Jordan",abbr:"JO",callingCode:"+962",continent:"Asia"},{name:"Kazakhstan",abbr:"KZ",callingCode:"+7",continent:"Asia"},{name:"Kenya",abbr:"KE",callingCode:"+254",continent:"Africa"},{name:"Kiribati",abbr:"KI",callingCode:"+686",continent:"Oceania"},{name:"Kuwait",abbr:"KW",callingCode:"+965",continent:"Asia"},{name:"Kyrgyzstan",abbr:"KG",callingCode:"+996",continent:"Asia"},{name:"Lao People's Democratic Republic",abbr:"LA",callingCode:"+856",continent:"Asia"},{name:"Latvia",abbr:"LV",callingCode:"+371",continent:"Europe"},{name:"Lebanon",abbr:"LB",callingCode:"+961",continent:"Asia"},{name:"Lesotho",abbr:"LS",callingCode:"+266",continent:"Africa"},{name:"Liberia",abbr:"LR",callingCode:"+231",continent:"Africa"},{name:"Libya",abbr:"LY",callingCode:"+218",continent:"Africa"},{name:"Liechtenstein",abbr:"LI",callingCode:"+423",continent:"Europe"},{name:"Lithuania",abbr:"LT",callingCode:"+370",continent:"Europe"},{name:"Luxembourg",abbr:"LU",callingCode:"+352",continent:"Europe"},{name:"Macao",abbr:"MO",callingCode:"+853",continent:"Asia"},{name:"Macedonia",abbr:"MK",callingCode:"+389",continent:"Europe"},{name:"Madagascar",abbr:"MG",callingCode:"+261",continent:"Africa"},{name:"Malawi",abbr:"MW",callingCode:"+265",continent:"Africa"},{name:"Malaysia",abbr:"MY",callingCode:"+60",continent:"Asia"},{name:"Maldives",abbr:"MV",callingCode:"+960",continent:"Asia"},{name:"Mali",abbr:"ML",callingCode:"+223",continent:"Africa"},{name:"Malta",abbr:"MT",callingCode:"+356",continent:"Europe"},{name:"Marshall Islands",abbr:"MH",callingCode:"+692",continent:"Oceania"},{name:"Martinique",abbr:"MQ",callingCode:"+596",continent:"North America"},{name:"Mauritania",abbr:"MR",callingCode:"+222",continent:"Africa"},{name:"Mauritius",abbr:"MU",callingCode:"+230",continent:"Africa"},{name:"Mayotte",abbr:"YT",callingCode:"+262",continent:"Africa"},{name:"Mexico",abbr:"MX",callingCode:"+52",continent:"North America"},{name:"Micronesia",abbr:"FM",callingCode:"+691",continent:"Oceania"},{name:"Moldova",abbr:"MD",callingCode:"+373",continent:"Europe"},{name:"Monaco",abbr:"MC",callingCode:"+377",continent:"Europe"},{name:"Mongolia",abbr:"MN",callingCode:"+976",continent:"Asia"},{name:"Montenegro",abbr:"ME",callingCode:"+382",continent:"Europe"},{name:"Montserrat",abbr:"MS",callingCode:"+1664",continent:"North America"},{name:"Morocco",abbr:"MA",callingCode:"+212",continent:"Africa"},{name:"Mozambique",abbr:"MZ",callingCode:"+258",continent:"Africa"},{name:"Myanmar",abbr:"MM",callingCode:"+95",continent:"Asia"},{name:"Namibia",abbr:"NA",callingCode:"+264",continent:"Africa"},{name:"Nauru",abbr:"NR",callingCode:"+674",continent:"Oceania"},{name:"Nepal",abbr:"NP",callingCode:"+977",continent:"Asia"},{name:"Netherlands",abbr:"NL",callingCode:"+31",continent:"Europe"},{name:"New Caledonia",abbr:"NC",callingCode:"+687",continent:"Oceania"},{name:"New Zealand",abbr:"NZ",callingCode:"+64",continent:"Oceania"},{name:"Nicaragua",abbr:"NI",callingCode:"+505",continent:"North America"},{name:"Niger",abbr:"NE",callingCode:"+227",continent:"Africa"},{name:"Nigeria",abbr:"NG",callingCode:"+234",continent:"Africa"},{name:"Niue",abbr:"NU",callingCode:"+683",continent:"Oceania"},{name:"Norfolk Island",abbr:"NF",callingCode:"+672",continent:"Oceania"},{name:"North Korea",abbr:"KP",callingCode:"+850",continent:"Asia"},{name:"Northern Mariana Islands",abbr:"MP",callingCode:"+1670",continent:"Oceania"},{name:"Norway",abbr:"NO",callingCode:"+47",continent:"Europe"},{name:"Oman",abbr:"OM",callingCode:"+968",continent:"Asia"},{name:"Pakistan",abbr:"PK",callingCode:"+92",continent:"Asia"},{name:"Palau",abbr:"PW",callingCode:"+680",continent:"Oceania"},{name:"Palestinian Territory",abbr:"PS",callingCode:"+970",continent:"Asia"},{name:"Panama",abbr:"PA",callingCode:"+507",continent:"North America"},{name:"Papua New Guinea",abbr:"PG",callingCode:"+675",continent:"Oceania"},{name:"Paraguay",abbr:"PY",callingCode:"+595",continent:"South America"},{name:"Peru",abbr:"PE",callingCode:"+51",continent:"South America"},{name:"Philippines",abbr:"PH",callingCode:"+63",continent:"Asia"},{name:"Pitcairn",abbr:"PN",callingCode:"+64",continent:"Oceania"},{name:"Poland",abbr:"PL",callingCode:"+48",continent:"Europe"},{name:"Portugal",abbr:"PT",callingCode:"+351",continent:"Europe"},{name:"Puerto Rico",abbr:"PR",callingCode:"+1",continent:"North America"},{name:"Qatar",abbr:"QA",callingCode:"+974",continent:"Asia"},{name:"Reunion",abbr:"RE",callingCode:"+262",continent:"Africa"},{name:"Romania",abbr:"RO",callingCode:"+40",continent:"Europe"},{name:"Russia",abbr:"RU",callingCode:"+7",continent:"Europe"},{name:"Rwanda",abbr:"RW",callingCode:"+250",continent:"Africa"},{name:"Saint Barthelemy",abbr:"BL",callingCode:"+590",continent:"North America"},{name:"Saint Helena",abbr:"SH",callingCode:"+290",continent:"Africa"},{name:"Saint Kitts and Nevis",abbr:"KN",callingCode:"+1869",continent:"North America"},{name:"Saint Lucia",abbr:"LC",callingCode:"+1758",continent:"North America"},{name:"Saint Martin",abbr:"MF",callingCode:"+590",continent:"North America"},{name:"Saint Pierre and Miquelon",abbr:"PM",callingCode:"+508",continent:"North America"},{name:"Saint Vincent and the Grenadines",abbr:"VC",callingCode:"+1784",continent:"North America"},{name:"Samoa",abbr:"WS",callingCode:"+685",continent:"Oceania"},{name:"San Marino",abbr:"SM",callingCode:"+378",continent:"Europe"},{name:"Sao Tome and Principe",abbr:"ST",callingCode:"+239",continent:"Africa"},{name:"Saudi Arabia",abbr:"SA",callingCode:"+966",continent:"Asia"},{name:"Senegal",abbr:"SN",callingCode:"+221",continent:"Africa"},{name:"Serbia",abbr:"RS",callingCode:"+381",continent:"Europe"},{name:"Seychelles",abbr:"SC",callingCode:"+248",continent:"Africa"},{name:"Sierra Leone",abbr:"SL",callingCode:"+232",continent:"Africa"},{name:"Singapore",abbr:"SG",callingCode:"+65",continent:"Asia"},{name:"Slovakia",abbr:"SK",callingCode:"+421",continent:"Europe"},{name:"Slovenia",abbr:"SI",callingCode:"+386",continent:"Europe"},{name:"Solomon Islands",abbr:"SB",callingCode:"+677",continent:"Oceania"},{name:"Somalia",abbr:"SO",callingCode:"+252",continent:"Africa"},{name:"South Africa",abbr:"ZA",callingCode:"+27",continent:"Africa"},{name:"South Korea",abbr:"KR",callingCode:"+82",continent:"Asia"},{name:"South Sudan",abbr:"SS",callingCode:"+211",continent:"Africa"},{name:"Spain",abbr:"ES",callingCode:"+34",continent:"Europe"},{name:"Sri Lanka",abbr:"LK",callingCode:"+94",continent:"Asia"},{name:"Sudan",abbr:"SD",callingCode:"+249",continent:"Africa"},{name:"Suriname",abbr:"SR",callingCode:"+597",continent:"South America"},{name:"Svalbard and Jan Mayen",abbr:"SJ",callingCode:"+47",continent:"Europe"},{name:"Swaziland",abbr:"SZ",callingCode:"+268",continent:"Africa"},{name:"Sweden",abbr:"SE",callingCode:"+46",continent:"Europe"},{name:"Switzerland",abbr:"CH",callingCode:"+41",continent:"Europe"},{name:"Syria",abbr:"SY",callingCode:"+963",continent:"Asia"},{name:"Taiwan",abbr:"TW",callingCode:"+886",continent:"Asia"},{name:"Tajikistan",abbr:"TJ",callingCode:"+992",continent:"Asia"},{name:"Tanzania",abbr:"TZ",callingCode:"+255",continent:"Africa"},{name:"Thailand",abbr:"TH",callingCode:"+66",continent:"Asia"},{name:"Timor-Leste",abbr:"TL",callingCode:"+670",continent:"Asia"},{name:"Togo",abbr:"TG",callingCode:"+228",continent:"Africa"},{name:"Tokelau",abbr:"TK",callingCode:"+690",continent:"Oceania"},{name:"Tonga",abbr:"TO",callingCode:"+676",continent:"Oceania"},{name:"Trinidad and Tobago",abbr:"TT",callingCode:"+1868",continent:"North America"},{name:"Tunisia",abbr:"TN",callingCode:"+216",continent:"Africa"},{name:"Turkey",abbr:"TR",callingCode:"+90",continent:"Europe"},{name:"Turkmenistan",abbr:"TM",callingCode:"+993",continent:"Asia"},{name:"Turks and Caicos Islands",abbr:"TC",callingCode:"+1649",continent:"North America"},{name:"Tuvalu",abbr:"TV",callingCode:"+688",continent:"Oceania"},{name:"Uganda",abbr:"UG",callingCode:"+256",continent:"Africa"},{name:"Ukraine",abbr:"UA",callingCode:"+380",continent:"Europe"},{name:"United Arab Emirates",abbr:"AE",callingCode:"+971",continent:"Asia"},{name:"United Kingdom",abbr:"GB",callingCode:"+44",continent:"Europe"},{name:"United States",abbr:"US",callingCode:"+1",continent:"North America"},{name:"Uruguay",abbr:"UY",callingCode:"+598",continent:"South America"},{name:"Uzbekistan",abbr:"UZ",callingCode:"+998",continent:"Asia"},{name:"Vanuatu",abbr:"VU",callingCode:"+678",continent:"Oceania"},{name:"Venezuela",abbr:"VE",callingCode:"+58",continent:"South America"},{name:"Vietnam",abbr:"VN",callingCode:"+84",continent:"Asia"},{name:"Virgin Islands, British",abbr:"VG",callingCode:"+1284",continent:"North America"},{name:"Virgin Islands, U.S.",abbr:"VI",callingCode:"+1340",continent:"North America"},{name:"Western Sahara",abbr:"EH",callingCode:"+212",continent:"Africa"},{name:"Yemen",abbr:"YE",callingCode:"+967",continent:"Asia"},{name:"Zambia",abbr:"ZM",callingCode:"+260",continent:"Africa"},{name:"Zimbabwe",abbr:"ZW",callingCode:"+263",continent:"Africa"}],d=new Map(m.map((n=>[n.name,n])));export{n as AVATAR_FILE_EXTENSIONS,a as AuthEvent,m as COUNTRIES,d as COUNTRIES_MAP,e as ChatEvent,c as GAME_CATEGORIES,r as GAME_QUEST_FOR,t as GAME_QUEST_REWARD_TYPES,l as GAME_QUEST_STATUSES,o as GAME_STATUSES,i as GameEvent,b as TRANSACTION_TYPES};

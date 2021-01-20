import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Rivers = new Mongo.Collection("rivers");

Rivers.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  name: String,
}).newContext();

Meteor.methods({
  "rivers.insert"(name) {
    const river = {
      name: name,
    };

    // Check river against schema.
    Rivers.schema.validate(river);

    if (Rivers.schema.isValid()) {
      console.log("Successful validation of river");
      Rivers.insert(river);
    } else {
      console.log("validationErrors:", Rivers.schema.validationErrors());
    }
  },

  "rivers.removeAll"() {
    Rivers.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish("rivers", function () {
    return Rivers.find(
      {},
      {
        fields: {
          name: 1,
        },
      }
    );
  });
}

export const newRivers = [
  "Aan River",
  "Acheron River (Canterbury)",
  "Acheron River (Marlborough)",
  "Ada River",
  "Adams River",
  "Ahaura River",
  "Ahuriri River",
  "Ahuroa River",
  "Akatarawa River",
  "Ākitio River",
  "Alexander River",
  "Alfred River",
  "Allen River",
  "Alma River",
  "Alph River (Ross Dependency)",
  "Anatoki River",
  "Anatori River",
  "Anaweka River",
  "Anne River",
  "Anti Crow River",
  "Aongatete River",
  "Aorangiwai River",
  "Aorere River",
  "Aparima River",
  "Arahura River",
  "Arapaoa River",
  "Araparera River",
  "Arawhata River",
  "Arnold River",
  "Arnst River",
  "Aropaoanui River",
  "Arrow River",
  "Arthur River",
  "Ashburton River / Hakatere",
  "Ashley River / Rakahuri",
  "Avoca River (Canterbury)",
  "Avoca River (Hawke's Bay)",
  "Avon River (Marlborough)",
  "Avon River / Ōtākaro",
  "Awakari River",
  "Awakino River",
  "Awanui River",
  "Awapoko River",
  "Awarau River",
  "Awaroa River",
  "Awarua River (Northland)",
  "Awarua River (Southland)",
  "Awatere River",
  "Awatere River (Gisborne)",
  "Awhea River",
  "Balfour River",
  "Barlow River",
  "Barn River",
  "Barrier River",
  "Baton River",
  "Bealey River",
  "Beaumont River",
  "Beautiful River",
  "Bettne River",
  "Big Hohonu River",
  "Big River (Southland)",
  "Big River (Tasman)",
  "Big River (West Coast, New Zealand)",
  "Big Wainihinihi River",
  "Blackwater River",
  "Blairich River",
  "Blind River / Otuwhero",
  "Blue Duck River",
  "Blue Grey River",
  "Blue River",
  "Bluff River",
  "Blythe River",
  "Bonar River",
  "Boulder River",
  "Bowen River",
  "Boyle River",
  "Branch River (Taylor River tributary)",
  "Branch River (Wairau River tributary)",
  "Broken River",
  "Brown Grey River",
  "Brown River (Marlborough)",
  "Brown River (Tasman)",
  "Brown River (West Coast)",
  "Buller River",
  "Burke River",
  "Butler River",
  "Callery River",
  "Cam River (Marlborough)",
  "Cam River / Ruataniwha",
  "Camelot River",
  "Cameron River",
  "Cape River",
  "Caples River",
  "Cardrona River",
  "Careys Creek",
  "Carrick River",
  "Cascade River",
  "Cass River (Lake Tekapo)",
  "Cass River (Selwyn District)",
  "Castaly River",
  "Castle River (Marlborough)",
  "Castle River (Southland)",
  "Castle River (Wellington)",
  "Catlins River",
  "Cavendish River",
  "Charwell River",
  "Chatterton River",
  "Christopher River",
  "Clarence River",
  "Clark River",
  "Clarke River (Grey District)",
  "Clarke River (Tasman)",
  "Clarke River (Westland District)",
  "Clearwater River",
  "Cleddau River",
  "Clinton River",
  "Clive River",
  "Clutha River",
  "Clyde River",
  "Coal River (Canterbury)",
  "Coal River (Fiordland)",
  "Cobb River",
  "Collins River",
  "Conway River",
  "Cook (Weheka) River",
  "Copland River",
  "Cox River",
  "Crooked River",
  "Cropp River",
  "Crow River (Canterbury)",
  "Crow River (West Coast)",
  "Cust River",
  "D'Urville River",
  "Dane River",
  "Dark River",
  "Dart River (Tasman)",
  "Dart River / Te Awa Whakatipu",
  "Deception River",
  "Deepdale River",
  "Devil River",
  "Dickson River",
  "Dillon River",
  "Dobson River",
  "Donald River (Hawke's Bay)",
  "Donald River (West Coast)",
  "Donne River",
  "Doon River",
  "Doubtful River",
  "Doubtless River",
  "Douglas River",
  "Dove River (Canterbury)",
  "Dove River (Tasman)",
  "Drake River",
  "Dry Awarua River",
  "Dry River",
  "Duncan River",
  "Earnscleugh River",
  "Eastern Hohonu River",
  "Eastern Hutt River",
  "Eastern Waiotauru (Snowy) River",
  "Edison River",
  "Edith River",
  "Edwards River (Mid Canterbury)",
  "Edwards River (North Canterbury)",
  "Eglinton River",
  "Electric River",
  "Elizabeth River",
  "Ellis River",
  "Empson River",
  "Esk River (Canterbury)",
  "Esk River (Hawke's Bay)",
  "Esperance River",
  "Evans River",
  "Eyre River",
  "Fairhall River",
  "Falls River",
  "Fish River",
  "Flaxbourne River",
  "Fleming River",
  "Forbes River",
  "Forgotten River",
  "Fork Stream",
  "Four Mile River",
  "Fox River (Buller)",
  "Fox River (Westland)",
  "Frances River",
  "Freshwater River",
  "Fyfe River",
  "Garry River",
  "Gelt River",
  "George River",
  "Glaisnock River",
  "Glencoe River",
  "Glenrae River",
  "Glenroy River",
  "Glentui River",
  "Gloster River",
  "Godley River",
  "Goldney River",
  "Gorge River",
  "Goulter River",
  "Gowan River",
  "Graham River",
  "Grantham River",
  "Gray River",
  "Grays River",
  "Grebe River",
  "Greenstone River",
  "Greta River",
  "Grey River",
  "Guide River",
  "Gulliver River",
  "Gunn River",
  "Gunner River",
  "Haast River",
  "Hacket River",
  "Hae Hae Te Moana River",
  "Hakaru River",
  "Hakataramea River",
  "Hall River",
  "Halswell River",
  "Hamilton River",
  "Hangaroa River",
  "Hangatahua (Stony) River, Taranaki",
  "Hanmer River",
  "Haparapara River",
  "Hapuawai River",
  "Hapuka River",
  "Hāpuku River",
  "Harman River",
  "Harper River",
  "Harrison River",
  "Hātea River",
  "Haumi River",
  "Haupiri River",
  "Hautapu River",
  "Havelock River",
  "Hawai River",
  "Hawdon River",
  "Hawea River",
  "Hawkins River",
  "Hay River",
  "Heaphy River",
  "Heathcote River",
  "Hector River",
  "Hemphill River",
  "Henry River",
  "Herekino River",
  "Heron River",
  "Hewson River",
  "Hikurangi River",
  "Hikurua River",
  "Hikutaia River",
  "Hikuwai River",
  "Hinatua River",
  "Hinds River",
  "Hinemaiaia River",
  "Hodder River",
  "Hokitika River",
  "Hook River",
  "Hooker River",
  "Hookhamsnyvy Creek",
  "Hope River (Canterbury)",
  "Hope River (Tasman)",
  "Hope River (West Coast)",
  "Hopkins River",
  "Horahora River",
  "Horomanga River",
  "Hororata River",
  "Hossack River",
  "Hoteo River",
  "Howard River",
  "Huangarua River",
  "Huia River",
  "Hunter River",
  "Huriwai River",
  "Hurunui River",
  "Hurunui River South Branch",
  "Hutt River",
  "Huxley River",
  "Ihungia River",
  "Ihuraua River",
  "Inangahua River",
  "Irene River",
  "Irwell River",
  "Jackson River",
  "Jacobs River",
  "Jed River",
  "Jerry River",
  "Joe River",
  "Joes River",
  "John o'Groats River",
  "Johnson River",
  "Jollie River",
  "Jordan River",
  "Juno River",
  "Kaeo River",
  "Kahurangi River",
  "Kahutara River",
  "Kaiapoi River",
  "Kaihu River",
  "Kaiikanui River",
  "Kaikou River",
  "Kaimarama River",
  "Kaipara River",
  "Kaipo River",
  "Kaituna River",
  "Kaiwaka River",
  "Kaiwakawaka River",
  "Kaiwara River",
  "Kaiwharawhara Stream",
  "Kaiwhata River",
  "Kaka River",
  "Kakanui River",
  "Kakapo River",
  "Kakapotahi River",
  "Kaniere River",
  "Kapowai River",
  "Karakatuwhero River",
  "Karamea River",
  "Karangarua River",
  "Karetu River (Canterbury)",
  "Karetu River (Northland)",
  "Karukaru River",
  "Katikara River",
  "Kauaeranga River",
  "Kaukapakapa River",
  "Kauru River",
  "Kawakawa River",
  "Kawarau River",
  "Kawhatau River",
  "Kedron River",
  "Kekerengu River",
  "Kenana River",
  "Kennet River",
  "Kereu River",
  "Kerikeri River (Northland)",
  "Kerikeri River (Waikato)",
  "Kitchener River",
  "Kiwi River",
  "Kohaihai River",
  "Kokatahi River",
  "Komata River",
  "Kopeka River",
  "Kopuapounamu River",
  "Kopuaranga River",
  "Koranga River",
  "Korimako Stream",
  "Kowai River",
  "Kowhai River",
  "Kuaotunu River",
  "Kumengamatea River",
  "Kumeu River",
  "Kuratau River",
  "Kurow River",
  "L II River",
  "Lambert River",
  "Landsborough River",
  "Lawrence River",
  "Leader River",
  "Leatham River",
  "Lee River",
  "Leslie River",
  "Lewis River (Canterbury)",
  "Lewis River (Tasman)",
  "Light River",
  "Lilburne River",
  "Lindis River",
  "Little Akatarawa River",
  "Little Awakino River",
  "Little Boulder River",
  "Little Crow River",
  "Little Devil River",
  "Little Hohonu River",
  "Little Hope River",
  "Little Kowai River",
  "Little Lottery River",
  "Little Onahau River",
  "Little Opawa River",
  "Little Pokororo River",
  "Little Pomahaka River",
  "Little River",
  "Little Slate River",
  "Little Totara River",
  "Little Waingaro River",
  "Little Wanganui River",
  "Lochy River",
  "Lords River",
  "Lottery River",
  "Lud River",
  "Lyvia River",
  "Macaulay River",
  "Macfarlane River",
  "Mackenzie River",
  "Maclennan River",
  "Maerewhenua River",
  "Mahakirau River",
  "Mahitahi River",
  "Mahurangi River",
  "Maitai River",
  "Makahu River",
  "Makakahi River",
  "Makara River (Chatham Islands)",
  "Makara River (Wellington)",
  "Makarau River",
  "Makaretu River",
  "Makarewa River",
  "Makarora River",
  "Makaroro River",
  "Makatote River",
  "Makerikeri River",
  "Makikihi River",
  "Makino River",
  "Makotuku River",
  "Makuri River",
  "Manaia River",
  "Manakaiaua River",
  "Manawapou River",
  "Manawatu River",
  "Mandamus River",
  "Mangaaruhe River",
  "Mangahao River",
  "Mangahauini River",
  "Mangaheia River",
  "Mangakahia River",
  "Mangakarengorengo River",
  "Mangakuri River",
  "Mangamaire River",
  "Mangamuka River",
  "Manganui o te Ao River",
  "Manganui River (Northland)",
  "Manganui River (Taranaki)",
  "Manganui River (Waikato)",
  "Manganuiohou River",
  "Mangaone River (Hawke's Bay)",
  "Mangaone River (Manawatu-Wanganui)",
  "Mangaoparo River",
  "Mangaorino River",
  "Mangaotaki River",
  "Mangapa River",
  "Mangapai River",
  "Mangapapa River (Bay of Plenty)",
  "Mangapapa River (Manawatu-Wanganui)",
  "Mangapehi River",
  "Mangapoike River",
  "Mangapu River",
  "Mangaroa River",
  "Mangatainoka River",
  "Mangatawhiri River",
  "Mangatera River",
  "Mangatete River",
  "Mangatewai River",
  "Mangatewainui River",
  "Mangatokerau River",
  "Mangatoro River",
  "Mangatu River",
  "Mangaturuturu River",
  "Mangawai River",
  "Mangawharariki River",
  "Mangawhero River",
  "Māngere River",
  "Mangles River",
  "Mangonuiowae River",
  "Mangorewa River",
  "Manuherikia River",
  "Maori River",
  "Maraehara River",
  "Maraekakaho River",
  "Maraetaha River",
  "Maraetotara River",
  "Mārahau River",
  "Maramarua River",
  "Maramataha River",
  "Mararoa River",
  "Marchburn River",
  "Marokopa River",
  "Maropea River",
  "Martyr River",
  "Maruia River",
  "Mason River",
  "Mata River",
  "Matahaka River",
  "Mataikona River",
  "Matakana River",
  "Matakitaki River",
  "Matakohe River",
  "Mataroa River",
  "Mataura River",
  "Mathias River",
  "Matiri River",
  "Matukituki River",
  "Maungakotukutuku Stream",
  "Mawheraiti or Little Grey River",
  "McRae River",
  "Medina River",
  "Medway River",
  "Meola creek",
  "Mike River",
  "Mikonui River",
  "Mimi River",
  "Miner River",
  "Mingha River",
  "Mistake River",
  "Misty River",
  "Moawhango River",
  "Moawhango West River",
  "Moeangiangi River",
  "Moeraki River",
  "Moerangi River",
  "Mohaka River",
  "Mohakatino River",
  "Mokau River",
  "Mōkihinui River",
  "Mokomokonui River",
  "Mokoreta River",
  "Monowai River",
  "Montgomerie River",
  "Morgan River",
  "Morse River",
  "Motatapu River",
  "Motu River",
  "Motueka River",
  "Motukaika River",
  "Motunau River",
  "Motupiko River",
  "Motupipi River",
  "Motuti River",
  "Moutere River",
  "Mowbray River",
  "Mueller River",
  "Mungo River",
  "Murchison River",
  "Murray River",
  "Namu River",
  "Nancy River",
  "Nevis River",
  "Newton River",
  "Newtown River",
  "Ngakawau River",
  "Ngamuwahine River",
  "Ngaruroro River",
  "Ngatau River",
  "Ngatiawa River",
  "Ngunguru River",
  "Nina River",
  "Nokomai River",
  "North Barlow River",
  "North Mathias River",
  "North Ohau River, Canterbury",
  "North Ohau River, Wellington",
  "North Opuha River",
  "North River",
  "Nuhaka River",
  "Nukuhou River",
  "Oakura River",
  "Oamaru River",
  "Oaro River",
  "Ohau River, Canterbury",
  "Ohau River, Wellington",
  "Ohikaiti River",
  "Ohikanui River",
  "Ohinemaka River",
  "Ohinemuri River",
  "Ohinetamatea River",
  "Ōhura River",
  "Ohuri River",
  "Okana River",
  "Okaramio River",
  "Okari River",
  "Okarito River",
  "Okuku River",
  "Okura River",
  "Okuru River",
  "Okuti River",
  "Old Bed Eyre River",
  "Old Bed of Waipawa River",
  "Olivine River",
  "Omaha River",
  "Omaka River",
  "Omanaia River",
  "Omanawa River",
  "Omaru River",
  "Omaumau River",
  "Omoeroa River",
  "Onaero River",
  "Onahau River",
  "Onamalutu River",
  "Onekaka River",
  "Oneone River",
  "Ongarue River",
  "Onyx River (Ross Dependency)",
  "Ōpaoa River",
  "Oparara River",
  "Oparau River",
  "Opatu River",
  "Opihi River",
  "Opitonui River",
  "Opotoru River",
  "Opouawe River",
  "Opouri River",
  "Opouteke River",
  "Opuha River",
  "Opuiaki River",
  "Opurehu River",
  "Orangipuku River",
  "Orari River",
  "Orauea River",
  "Orere River",
  "Oreti River",
  "Orewa River",
  "Orikaka River",
  "Orira River",
  "Orongorongo River",
  "Oroua River",
  "Orowaiti River",
  "Oruaiti River",
  "Oruawharo River",
  "Oruru River",
  "Orutua River",
  "Otahu River",
  "Otaio River",
  "Otaki River",
  "Otama River",
  "Otamatapaio River",
  "Otamatea River (Hawke's Bay)",
  "Otamatea River (Northland)",
  "Otara River",
  "Otaua River",
  "Otehake River",
  "Otekaieke River",
  "Otematata River",
  "Otere River",
  "Oterei River",
  "Otiake River",
  "Otira River",
  "Otoko River",
  "Otorehinaiti River",
  "Otto River",
  "Otututu (Rough) River",
  "Otuwhero River",
  "Ounuora River",
  "Ourauwhare River",
  "Owahanga River",
  "Ōwaka River",
  "Owen River",
  "Pahaoa River",
  "Pahau River",
  "Pahi River",
  "Pahu River",
  "Pairatahi River",
  "Pakarae River",
  "Pakiri River",
  "Pakoka River",
  "Pakowhai River",
  "Pakuratahi River",
  "Pandora River",
  "Papakanui River",
  "Paranui River",
  "Parapara River",
  "Pareora River",
  "Paringa River",
  "Pariwhakaoho River",
  "Park River",
  "Patarau River",
  "Pataua River",
  "Patea River",
  "Paturau River",
  "Patutahi River",
  "Pearse River",
  "Pearson River",
  "Pelorus River",
  "Penk River",
  "Percival River",
  "Peria River",
  "Perth River",
  "Perunui River",
  "Phantom River",
  "Piako River",
  "Pitt River",
  "Pleasant River",
  "Poerua River",
  "Pohangina River",
  "Pohuenui River",
  "Pokororo River",
  "Pomahaka River",
  "Pongaroa River",
  "Porangahau River",
  "Poroporo River",
  "Pororari River",
  "Porter River",
  "Postal River",
  "Potts River",
  "Pouawa River",
  "Poulter River",
  "Pourakino River",
  "Pourangaki River",
  "Price River",
  "Pūerua River",
  "Puhi Puhi River",
  "Puhoi River",
  "Pukaki River",
  "Pūkio Stream",
  "Punakaiki River",
  "Punakitere River",
  "Pungapunga River",
  "Puniu River",
  "Pupuke River",
  "Purakaunui River",
  "Purangi River",
  "Puremahaia River",
  "Puriri River",
  "Pyke River",
  "Racehorse River",
  "Rahu River",
  "Rai River",
  "Rainbow River",
  "Rainy River (Marlborough)",
  "Rainy River (Tasman)",
  "Rakaia River",
  "Rakeahua River",
  "Rangiora River",
  "Rangitaiki River",
  "Rangitane River",
  "Rangitata River",
  "Rangitikei River",
  "Rappahannock River",
  "Raukokore River",
  "Rea River",
  "Red Pyke River",
  "Red River",
  "Rees River",
  "Reikorangi Stream",
  "Rerewhakaaitu River",
  "Retaruke River",
  "Ripia River",
  "Riuwaka River",
  "Roaring Lion River",
  "Robertson River",
  "Robinson River",
  "Rocky River",
  "Roding River",
  "Rogerson River",
  "Rolleston River",
  "Rolling River",
  "Ronga River",
  "Rooney River",
  "Rotokakahi River",
  "Rotokino River",
  "Rotowhenua River",
  "Ruakaka River",
  "Ruakituri River",
  "Ruakokoputuna River",
  "Ruamahanga River",
  "Rubicon River",
  "Ruera River",
  "Rum River",
  "Ryton River",
  "Sabine River",
  "Saxon River",
  "Saxton River",
  "Seaforth River",
  "Seaward River",
  "Selwyn River / Waikirikiri",
  "Serpentine River",
  "Severn River",
  "Shag River (Fiordland)",
  "Shag River (Otago)",
  "Shenandoah River",
  "Sheriff River/Station Creek",
  "Sherry River",
  "Shin River",
  "Shotover River",
  "Sinclair River",
  "Skeet River",
  "Slate River",
  "Smite River",
  "Smoothwater River",
  "Smyth River",
  "Snow River",
  "Snowy River",
  "South Mathias River",
  "South Ohau River, Canterbury",
  "South Ohau River, Wellington",
  "South Opuha River",
  "Southern Waiotauru River",
  "Spey River (Southland)",
  "Spey River (Tasman)",
  "Spoon River",
  "Spray River",
  "Stafford River",
  "Stanley River (Canterbury)",
  "Stanley River (Tasman)",
  "Stanton River",
  "Stillwater River",
  "Stony River",
  "Stour River",
  "Strauchon River",
  "Styx Creek",
  "Styx River (Canterbury)",
  "Styx River (North Canterbury)",
  "Styx River (West Coast)",
  "Swift River",
  "Swin Burn",
  "Swin River",
  "Tadmor River",
  "Tahaenui River",
  "Tahakopa River",
  "Taharua River",
  "Taheke River",
  "Tahekeroa River",
  "Tahoranui River",
  "Taieri River",
  "Taiharuru River",
  "Taihiki River",
  "Taipa River",
  "Taipo River (Buller District)",
  "Taipo River (Westland District)",
  "Taipoiti River",
  "Tairua River",
  "Takahue River",
  "Tākaka River",
  "Takaputahi River",
  "Takiritawai River",
  "Takou River",
  "Talbot River",
  "Tamaki River",
  "Tangahoe River",
  "Tangarakau River",
  "Tapu River",
  "Tapuaeroa River",
  "Tapuwae River",
  "Taramakau River",
  "Tarawera River",
  "Taringamotu River",
  "Taruarau River",
  "Taruheru River",
  "Tasman River",
  "Tass River",
  "Tauanui River",
  "Tauherenikau River",
  "Tauhoa River",
  "Taumona River",
  "Tauranga River",
  "Tauranga Taupo River",
  "Taurangakautuku River",
  "Tauraroa River",
  "Tautuku River",
  "Tauweru River",
  "Tawapuku River",
  "Tawarau River",
  "Tawatahi River",
  "Taylor River",
  "Te Arai River",
  "Te Haumi River",
  "Te Hoe River",
  "Te Kapa River",
  "Te Mata River",
  "Te Naihi River",
  "Te Putaaraukai River",
  "Te Rahotaiepa River",
  "Te Wharau (Stony) River, West Coast",
  "Te Wharau River",
  "Teal River",
  "Tekapo River",
  "Teme River",
  "Temuka River",
  "Tengawai River",
  "Teviot River",
  "Thomas River (Canterbury)",
  "Thomas River (West Coast)",
  "Thurso River",
  "Tīmaru River",
  "Tinline River",
  "Tinui River",
  "Tiraumea River (Manawatū-Whanganui)",
  "Tiraumea River (Tasman)",
  "Toaroha River",
  "Tohoratea River",
  "Toitoi River",
  "Tokanui River",
  "Tokomairaro River",
  "Tokomaru River",
  "Tolson River",
  "Tone River",
  "Tongaporutu River",
  "Tongariro River",
  "Topuni River",
  "Tōrere River",
  "Torrent River",
  "Totara River (Buller District)",
  "Totara River (Westland District)",
  "Totarakaitorea River",
  "Townshend River",
  "Towy River",
  "Transit River",
  "Travers River",
  "Trent River",
  "Troyte River",
  "Tuamarina River",
  "Tuapeka River",
  "Tuke River",
  "Tukipo River",
  "Tukituki River",
  "Tummil River",
  "Tunakino River",
  "Turakina River",
  "Turanganui River (Gisborne)",
  "Turanganui River (Wellington)",
  "Turimawiwi River",
  "Turnbull River",
  "Tūtaekurī River",
  "Tutaki River",
  "Tutoko River",
  "Tweed River",
  "Twizel River",
  "Uawa River",
  "Ugly River",
  "Upper Grey River",
  "Upukerora River",
  "Urenui River",
  "Utakura River",
  "Victoria River",
  "Von River",
  "Wahianoa River",
  "Wai-iti River",
  "Waianakarua River",
  "Waianiwaniwa River",
  "Waiapu River",
  "Waiariki River",
  "Waiaruhe River",
  "Waiatoto River",
  "Waiau River (Canterbury)",
  "Waiau River (Gisborne)",
  "Waiau River (Hawke's Bay)",
  "Waiau River (Southland)",
  "Waiaua River (Bay of Plenty)",
  "Waiaua River (Taranaki)",
  "Waihaha River",
  "Waihao River",
  "Waiheke River",
  "Waihi River",
  "Waiho River",
  "Waihoihoi River",
  "Waihopai River",
  "Waihora River",
  "Waihou River",
  "Waihua River",
  "Waihuka River",
  "Waikaia River",
  "Waikakaho River",
  "Waikakariki River",
  "Waikamaka River",
  "Waikanae River",
  "Waikare River (Bay of Plenty)",
  "Waikare River (Northland)",
  "Waikaretaheke River",
  "Waikari River (Canterbury)",
  "Waikari River (Hawke's Bay)",
  "Waikato River",
  "Waikawa River",
  "Waikawau River (Thames-Coromandel District)",
  "Waikawau River (Waitomo District)",
  "Waikiti River",
  "Waikoau River",
  "Waikohu River",
  "Waikoropupu River",
  "Waikorure River",
  "Waikouaiti River",
  "Waikukupa River",
  "Waikura River (Hangaroa River tributary)",
  "Waikura River (Raukokore River tributary)",
  "Waima River",
  "Waimakariri River",
  "Waimamakau River",
  "Waimamaku River",
  "Waimana River",
  "Waimangarara River",
  "Waimangaroa River",
  "Waimarino River",
  "Waimata River",
  "Waimea River (Southland)",
  "Waimea River (Tasman)",
  "Waimeamea River",
  "Waingaro River (Tasman)",
  "Waingaro River (Waikato)",
  "Waingaromia River",
  "Waingawa River",
  "Waingongoro River",
  "Wainui River (Bay of Plenty)",
  "Wainui River (Hawke's Bay)",
  "Wainui River (Northland)",
  "Wainui River (Tasman)",
  "Wainuiomata River",
  "Wainuiora River",
  "Wainuioru River",
  "Waioeka River",
  "Waiohine River",
  "Waiomoko River",
  "Waionepu River",
  "Waiorongomai River (Gisborne)",
  "Waiorongomai River (Wellington)",
  "Waiotahe River",
  "Waiotaka River",
  "Waiotama River",
  "Waiotauru River",
  "Waiotu River",
  "Waipa River",
  "Waipahi River",
  "Waipakihi River",
  "Waipaoa River",
  "Waipapa River (Bay of Plenty)",
  "Waipapa River (Northland)",
  "Waipapa River (Waikato)",
  "Waipara River (Canterbury)",
  "Waipara River (West Coast)",
  "Waipati (Chaslands) River",
  "Waipekakoura River",
  "Waipori River",
  "Waipoua River (Northland)",
  "Waipoua River (Wellington)",
  "Waipu River",
  "Waipunga River",
  "Wairahi River",
  "Wairakei River",
  "Wairaki River",
  "Wairau River",
  "Wairaurahiri River",
  "Waireia River",
  "Wairere River",
  "Wairoa River (Auckland)",
  "Wairoa River (Bay of Plenty)",
  "Wairoa River (Hawke's Bay)",
  "Wairoa River (Northland)",
  "Wairoa River (Tasman)",
  "Wairongomai River",
  "Wairua River",
  "Waita River",
  "Waitaha River",
  "Waitahaia River",
  "Waitahanui River",
  "Waitahu River",
  "Waitahuna River",
  "Waitakaruru River",
  "Waitakere (Nile) River",
  "Waitakere River",
  "Waitaki River",
  "Waitangi River (Far North District)",
  "Waitangi River (Whangarei District)",
  "Waitangiroto River",
  "Waitangitaona River",
  "Waitara River",
  "Waitatapia Stream",
  "Waitati River",
  "Waitawheta River",
  "Waitekauri River",
  "Waitekuri River",
  "Waitepeka River",
  "Waitetuna River",
  "Waitewaewae River",
  "Waitoa River",
  "Waitoetoe River",
  "Waitohi River",
  "Waitotara River",
  "Waitutu River",
  "Waiuku River",
  "Waiwawa River",
  "Waiwera River",
  "Waiwhakaiho River",
  "Waiwhango River",
  "Wakamarina River",
  "Wakapuaka River",
  "Walker River",
  "Wandle River",
  "Wanganui River",
  "Wangapeka River",
  "Wapiti River",
  "Warwick River",
  "Water of Leith",
  "Weheka (Cook) River",
  "Weiti River",
  "Wentworth River",
  "West Mathias River",
  "Western Hutt River",
  "Whakaikai River",
  "Whakaki River",
  "Whakanekeneke River",
  "Whakapapa River",
  "Whakapara River",
  "Whakapohai River",
  "Whakarapa River",
  "Whakatahine River",
  "Whakataki River",
  "Whakatane River",
  "Whakatikei River",
  "Whakaurekou River",
  "Whanaki River",
  "Whangae River",
  "Whangaehu River",
  "Whangamarino River",
  "Whangamaroro River",
  "Whangamoa River",
  "Whangamōmona River",
  "Whanganui River",
  "Whangaparaoa River",
  "Whareama River",
  "Whareatea River",
  "Wharehine River",
  "Wharekahika River",
  "Wharekawa River",
  "Wharekopae River",
  "Wharemauku Stream",
  "Wharepapa River",
  "Whataroa River",
  "Whau River",
  "Whawanui River",
  "Wheao River",
  "Whenuakite River",
  "Whenuakura River",
  "Whirinaki River (Hawke's Bay)",
  "Whirinaki River (Northland)",
  "Whistler River",
  "Whitbourn River",
  "Whitcombe River",
  "White River",
  "White Rock River",
  "Whitestone River",
  "Whitewater River",
  "Wilberforce River",
  "Wild Natives River",
  "Wilkin River",
  "Wilkinson River",
  "Willberg River",
  "Williamson River",
  "Wills River",
  "Wilmot River",
  "Wilson River",
  "Windley River",
  "Windward River",
  "Winterton River",
  "Wolf River",
  "Woolley River",
  "Worsley Stream",
  "Wye River",
  "Yankee River",
  "Yarra River",
  "Young River",
];

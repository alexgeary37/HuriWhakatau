import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Usernames = new Mongo.Collection("usernames");

Usernames.schema = new SimpleSchema({
  _id: {type: String, optional: true },
  name: String
}).newContext();

Meteor.methods({
  "usernames.removeAll"() {
    Usernames.remove({});
  }
})

export const randomUsernames = [
    'abaloneaccountant',
    'alligatoroptician',
    'abaloneacrobat',
    'anacondacraftsman',
    'abalonegambler',
    'anacondadietician',
    'abalonegirlguide',
    'anacondamillwright',
    'abalonepainter',
    'antelopecandidate',
    'abaloneservant',
    'antelopegirlguide',
    'abalonestriker',
    'archerfishnun',
    'abalonetailor',
    'avocetdean',
    'abalonethief',
    'avocetmagistrate',
    'applesartist',
    'avocetpharmacist',
    'applesdon',
    'baboonannouncer',
    'applesfarmer',
    'baboonpodiatrist',
    'applesglazier',
    'bacteriaexaminer',
    'applesjudge',
    'bacteriageologist',
    'appleslabourer',
    'bacteriasalesman',
    'applesmechanic',
    'badgerbanker',
    'applesmerchant',
    'badgervicar',
    'applesminstrel',
    'barracudamortician',
    'applesnurse',
    'bassmajor',
    'apricotsarchitect',
    'beaverscientist',
    'apricotsbuyer',
    'bisonlawyer',
    'apricotscurator',
    'bisonwriter',
    'apricotsexpert',
    'bitterngoverness',
    'apricotsgirlguide',
    'bitternseamstress',
    'apricotspilot',
    'blackfishjoiner',
    'apricotsresearcher',
    'blackfishmortician',
    'apricotstourist',
    'bloodhoundagent',
    'apricotstraveler',
    'bloodhoundjournalist',
    'bagelsbricklayer',
    'bloodhoundrealtor',
    'bagelsconsultant',
    'bloodhoundundertaker',
    'bagelsdietician',
    'boaeditor',
    'bagelshorseman',
    'bobcatacrobat',
    'bagelslibrarian',
    'bobcatastronomer',
    'bagelsonlooker',
    'bobcattutor',
    'bagelspipelayer',
    'bobolinkcurator',
    'bagelspreacher',
    'bongocandidate',
    'bagelsprogrammer',
    'bongopharmacist',
    'bagelstranslator',
    'buckpoliceman',
    'basmatiassistant',
    'buckscientist',
    'basmatiauditor',
    'buffalochurchgoer',
    'basmatidean',
    'bullfinchedean',
    'basmatideveloper',
    'bullfinchedispatcher',
    'basmatidietician',
    'bullfinchemerchant',
    'basmatilibrarian',
    'bullfinchemillwright',
    'basmatimagician',
    'bullfinchesecretary',
    'basmatimillwright',
    'bullfinchetourist',
    'basmatipipelayer',
    'bullocksplasterer',
    'basmativicar',
    'bullocksworkman',
    'burritosauthor',
    'bustardastronomer',
    'burritosbarber',
    'bustardcapitalist',
    'burritoseconomist',
    'butterflystudent',
    'burritosemployee',
    'buzzardjoiner',
    'burritosoptician',
    'camelauditor',
    'burritospharmacist',
    'camelbrewer',
    'burritospreacher',
    'caponagent',
    'burritosstriker',
    'cardinalcandidate',
    'cakeanalyst',
    'cardinalhermit',
    'cakeappraiser',
    'cardinallecturer',
    'cakearchivist',
    'cardinalmerchant',
    'cakeastronomer',
    'cardinalstonemason',
    'cakemagician',
    'cardinalsurgeon',
    'cakemechanic',
    'cariboudancer',
    'cakeparamedic',
    'cariboumerchant',
    'caketherapist',
    'cattleacademic',
    'cakeundertaker',
    'cattleestimator',
    'caviardrafter',
    'chamoisharpist',
    'caviarfitter',
    'cheetahminstrel',
    'caviarjournalist',
    'chickenanalyst',
    'caviarknight',
    'chickenbaker',
    'caviarlogger',
    'chickenjudge',
    'caviarprisoner',
    'chimpanzeeactor',
    'caviarrealtor',
    'chimpanzeeemployee',
    'caviarsailor',
    'chimpanzeegrammarian',
    'caviartailor',
    'chimpanzeemusician',
    'caviartiler',
    'chimpanzeephysicist',
    'cheeseacademic',
    'chimpanzeepreacher',
    'cheeseagent',
    'chimpanzeethief',
    'cheesecapitalist',
    'choughcanon',
    'cheesegirlguide',
    'choughchemist',
    'cheeselistener',
    'choughminstrel',
    'cheeseonlooker',
    'choughperformer',
    'cheesesecretary',
    'coatifabricator',
    'cheeseshoemaker',
    'coatimachinist',
    'chileactuary',
    'coatimillwright',
    'chileartist',
    'cobrabuyer',
    'chilebureaucrat',
    'cobrapipelayer',
    'chilechurchgoer',
    'cobrastriker',
    'chileexpert',
    'cockatoocanon',
    'chileforester',
    'cockatoohorseman',
    'chilemajor',
    'cockatoopaver',
    'chilenurse',
    'cockroachmagician',
    'chowdercapitalist',
    'cockroachproducer',
    'chowderchurchgoer',
    'cockroachpublisher',
    'chowderdancer',
    'colobusforester',
    'chowderdean',
    'coltlawyer',
    'chowderdoctor',
    'coltscientist',
    'chowderhoodlum',
    'conielecturer',
    'chowderjoiner',
    'cootcandidate',
    'chowdermachinist',
    'cootmechanic',
    'chowdernurse',
    'cootmillwright',
    'clamboyscouts',
    'cormoranttrustee',
    'clamchurchgoer',
    'cormorantwidow',
    'clamdentist',
    'cowplasterer',
    'clamfitter',
    'cowprogrammer',
    'clamgrammarian',
    'crocodilebureaucrat',
    'clamlaborer',
    'crocodilejudge',
    'clamoperator',
    'crocodilepoliceman',
    'clamprogrammer',
    'crocodilethief',
    'clamsecretary',
    'cubbutler',
    'clamtaxidriver',
    'cubdoctor',
    'coconutboyscouts',
    'cubresearcher',
    'coconutcaterer',
    'curbroker',
    'coconutdean',
    'curcobbler',
    'coconuteconomist',
    'curlewagent',
    'coconutjudge',
    'curlewpiper',
    'coconutmechanic',
    'curlewprogrammer',
    'coconutpodiatrist',
    'deerdoctor',
    'coconutpreacher',
    'dinosaureditor',
    'coconutresearcher',
    'dinosaurtaverner',
    'cordialannouncer',
    'dinosaurworkman',
    'cordialarchitect',
    'dogfishshoemaker',
    'cordialbishop',
    'dolphincashier',
    'cordialcarpenter',
    'donkeydietician',
    'cordialdrafter',
    'dottereldon',
    'cordialfarmer',
    'dotterelpoliceman',
    'cordialjournalist',
    'dovemidwife',
    'cordialpiper',
    'doveslogger',
    'cordialshoemaker',
    'dunlinactor',
    'cordialstonemason',
    'dunlinmatron',
    'crackersappraiser',
    'dunlinmourner',
    'crackersfisherman',
    'dunnockmasons',
    'crackershorseman',
    'dunnockoptician',
    'crackershygienist',
    'eaglelaborer',
    'crackersoperator',
    'eaglemagistrate',
    'crackerspharmacist',
    'eaglepoliceman',
    'crackersplumber',
    'elkrobber',
    'crackersprogrammer',
    'falconadvisor',
    'crackersroofer',
    'falconarsonist',
    'crackersvicar',
    'falconbricklayer',
    'doughnutauditor',
    'falconbureaucrat',
    'doughnutfabricator',
    'falconcook',
    'doughnuthoodlum',
    'falconmachinist',
    'doughnutjournalist',
    'falcontechnician',
    'doughnutpreacher',
    'fishtrainer',
    'doughnutrobber',
    'flamingooptician',
    'doughnutsubaltern',
    'flamingotrustee',
    'doughnutsurgeon',
    'gazellebutcher',
    'doughnuttherapist',
    'gazellejudge',
    'doughnutundertaker',
    'geckocameraman',
    'eggsarchivist',
    'geckopharmacist',
    'eggsengineer',
    'geckostriker',
    'eggsgoverness',
    'geckotutor',
    'eggsjournalist',
    'gerbilpaver',
    'eggsmatron',
    'gerbiltourist',
    'eggsmortician',
    'gibbonclerk',
    'eggsmourner',
    'gibbonmagician',
    'eggssinger',
    'gibbonthief',
    'eggsthief',
    'giraffemagician',
    'eggstranslator',
    'gnuannouncer',
    'garlicbuyer',
    'gnugirlguide',
    'garlicdirector',
    'gnupodiatrist',
    'garlicfitter',
    'goldfinchgoverness',
    'garlicjournalist',
    'goldfinchnun',
    'garliclawyer',
    'goosandernurse',
    'garliclecturer',
    'goosanderstriker',
    'garlicminstrel',
    'goosefitter',
    'garlicnun',
    'goosetrainer',
    'garlicrealtor',
    'goshawkassistant',
    'gatoradefarmer',
    'goshawkcameraman',
    'gatoradeharlot',
    'goshawknun',
    'gatoradehermit',
    'greyhoundbuilder',
    'gatoradehygienist',
    'grouseperformer',
    'gatoradelistener',
    'guillemotdancer',
    'gatorademourner',
    'guillemotgrammarian',
    'gatoradeseamstress',
    'guineafowlplumber',
    'gatoradesenator',
    'guineafowlservant',
    'gatoradesinger',
    'guineafowltailor',
    'granolaannouncer',
    'guineafowlthief',
    'granolabaker',
    'gullannouncer',
    'granolaestimator',
    'gullexaminer',
    'granolaexaminer',
    'gullsheriff',
    'granolaforester',
    'gullworshipper',
    'granolaharpist',
    'harebarman',
    'granolalawyer',
    'harebricklayer',
    'granolamerchant',
    'hareknight',
    'granolasurgeon',
    'hartbaker',
    'icecreamacademic',
    'hartebeestassistant',
    'icecreamadvisor',
    'hartebeestdentist',
    'icecreamagent',
    'hartebeestplayer',
    'icecreambarber',
    'hartebeesttiler',
    'icecreambutler',
    'hartservant',
    'icecreamcourier',
    'hawkassistant',
    'icecreamdean',
    'hawkbuyer',
    'icecreammidwife',
    'hawkfitter',
    'icecreamperformer',
    'hawkmatron',
    'icecreamseamstress',
    'hedgehogmerchant',
    'jerkyactuary',
    'herondrafter',
    'jerkyadvisor',
    'hindsperformer',
    'jerkybroker',
    'hogpaver',
    'jerkyeditor',
    'hoopoeactuary',
    'jerkypipelayer',
    'hoopoegeologist',
    'jerkyplumber',
    'hoopoemortician',
    'jerkyranchers',
    'hornbillcaterer',
    'jerkyrobber',
    'hornbilllawyer',
    'jerkysinger',
    'hornbilllistener',
    'jerkytiler',
    'hornbillsenator',
    'lardanalyst',
    'hornetbaker',
    'lardarsonist',
    'horsejournalist',
    'lardbrewer',
    'hyenahoodlum',
    'lardbutcher',
    'hyenasubaltern',
    'lardcobbler',
    'ibexecanon',
    'larddentist',
    'ibexegeologist',
    'larddietician',
    'ibexeglazier',
    'larddispatcher',
    'ibiscandidate',
    'lardjoiner',
    'ibisestimator',
    'lardsoldier',
    'ibisgrammarian',
    'lolliesaccountant',
    'impalacameraman',
    'lolliescarpenter',
    'jackrabbitengineer',
    'lolliesfisherman',
    'jaguarmasons',
    'lolliesgrammarian',
    'jaguaronlooker',
    'lollieshermit',
    'jaytranslator',
    'lollieslecturer',
    'jellyfishaccountant',
    'lolliesrealtor',
    'jellyfishbaron',
    'lolliesresearcher',
    'kangarooprisoner',
    'lolliesshoemaker',
    'kapiranchers',
    'lolliesteacher',
    'kapisubaltern',
    'mayonnaisecritic',
    'kookaburrabuilder',
    'mayonnaisedoctor',
    'kookaburracobbler',
    'mayonnaisefitter',
    'larkfabricator',
    'mayonnaisemidwife',
    'larkpainter',
    'mayonnaiseplasterer',
    'lemurpublisher',
    'mayonnaiseshoemaker',
    'leopardgeologist',
    'mayonnaisesinger',
    'leopardundertaker',
    'mayonnaisestonemason',
    'leveretboyscouts',
    'mayonnaisetourist',
    'licegirlguide',
    'mayonnaisewidow',
    'linnettailor',
    'milkshakesaccountant',
    'lionchurchgoer',
    'milkshakesbroker',
    'lionmajor',
    'milkshakesdean',
    'lionoperator',
    'milkshakeseconomist',
    'lizardadvisor',
    'milkshakesgrammarian',
    'lizardjudge',
    'milkshakesmasons',
    'llamadesigner',
    'milkshakesmortician',
    'locustnun',
    'milkshakestaxidriver',
    'locustprogrammer',
    'milkshakestrustee',
    'locustranchers',
    'milkshakestutor',
    'macawbarber',
    'mueslialderman',
    'macawlistener',
    'mueslibroker',
    'macawpipelayer',
    'mueslidon',
    'mackerelastronomer',
    'mueslihunter',
    'mackerelphysician',
    'muesliperformer',
    'magpiebricklayer',
    'mueslishoemaker',
    'magpiesalesman',
    'mueslitailor',
    'magpietaxidriver',
    'mueslitaxidriver',
    'mallardsinger',
    'muesliyeoman',
    'mandrillcourier',
    'oatmealanalyst',
    'mandrilltraveler',
    'oatmealcapitalist',
    'mareexaminer',
    'oatmealcraftsman',
    'martenparamedic',
    'oatmealhoodlum',
    'meadowlarkcapitalist',
    'oatmealjudge',
    'meerkatappraiser',
    'oatmealmusician',
    'meerkatplumber',
    'oatmealsalesman',
    'minnowoperator',
    'oatmealscientist',
    'moleemployee',
    'oatmealsheriff',
    'moleknight',
    'oilacademic',
    'moleseamstress',
    'oilchurchgoer',
    'mongooseclerk',
    'oilcounselor',
    'mongooselabourer',
    'oilhoodlum',
    'mongoosetranslator',
    'oilmagistrate',
    'mosquitoedentist',
    'oilmerchant',
    'mosquitoedon',
    'oilperformer',
    'mosquitoeminstrel',
    'oilrealtor',
    'mothaccountant',
    'oilsailor',
    'mothmechanic',
    'oiltutor',
    'musselfisherman',
    'orangearsonist',
    'musselgeologist',
    'orangebanker',
    'opossumprogrammer',
    'orangecashier',
    'orangutanarsonist',
    'orangedrafter',
    'orangutanboyscouts',
    'orangeengineer',
    'orangutanoperator',
    'orangelawyer',
    'orangutanpiper',
    'orangephysician',
    'ostrichcraftsman',
    'orangeplasterer',
    'ottermillwright',
    'orangeplayer',
    'otterrobber',
    'orangetranslator',
    'owlcameraman',
    'paellaauthor',
    'oxbirdjudge',
    'paellabarber',
    'oxbirdmidwife',
    'paelladentist',
    'oxbirdpainter',
    'paelladrafter',
    'oxthief',
    'paellagirlguide',
    'pandaactuary',
    'paellaplasterer',
    'pandamusician',
    'paellaranchers',
    'pandapaver',
    'paellatiler',
    'pandasurgeon',
    'paellaworkman',
    'parrotartist',
    'pearbureaucrat',
    'parrotdancer',
    'peardeveloper',
    'parrotfabricator',
    'pearengineer',
    'parrotfarmer',
    'peargirlguide',
    'parrotharlot',
    'pearmajor',
    'partridgeboyscouts',
    'pearphysician',
    'peacockcounselor',
    'pearstriker',
    'peacockreporter',
    'peartrustee',
    'peafowlauthor',
    'pearyeoman',
    'peafowlforester',
    'pepperbanker',
    'peafowlpiper',
    'pepperbarber',
    'peafowltherapist',
    'pepperbuyer',
    'pelicanhoodlum',
    'peppercraftsman',
    'pelicanpedlar',
    'pepperexpert',
    'pelicanpoliceman',
    'pepperlibrarian',
    'peregrinebaron',
    'pepperlogger',
    'peregrinedispatcher',
    'pepperoniastronomer',
    'peregrineservant',
    'pepperoniboyscouts',
    'pheasantadvisor',
    'pepperonicook',
    'pheasantbaker',
    'pepperoniengineer',
    'pigassistant',
    'pepperoniexpert',
    'pigeonbaker',
    'pepperonihermit',
    'pigeonhygienist',
    'pepperonihoodlum',
    'pigglazier',
    'pepperonimasons',
    'pigpoliceman',
    'pepperoniplasterer',
    'pilchardfisherman',
    'pepperoniprisoner',
    'pilchardgoverness',
    'pepperroofer',
    'pilchardlogger',
    'peppervicar',
    'pintailactor',
    'pepperworkman',
    'pintailarsonist',
    'piebuyer',
    'pintailthief',
    'piecameraman',
    'pochardrealtor',
    'piecook',
    'pochardreporter',
    'pieestimator',
    'pochardworkman',
    'pieglazier',
    'polarbearhygienist',
    'piehoodlum',
    'polarbearmachinist',
    'piemasons',
    'polarbearperformer',
    'pieundertaker',
    'polecatsjudge',
    'pistachioactuary',
    'ponieacademic',
    'pistachioarchitect',
    'poniepipelayer',
    'pistachioeditor',
    'ponietaxidriver',
    'pistachiofisherman',
    'ponygoverness',
    'pistachiophysician',
    'ponystriker',
    'pistachioseamstress',
    'porcupinebarber',
    'pistachiostonemason',
    'porcupinehorseman',
    'pistachiotranslator',
    'porpoisefabricator',
    'polentaannouncer',
    'porpoisenurse',
    'polentabureaucrat',
    'poultryfabricator',
    'polentacourier',
    'poultryfisherman',
    'polentadentist',
    'poultrygambler',
    'polentaengineer',
    'poultryplasterer',
    'polentajoiner',
    'prairiedogchurchgoer',
    'polentamessenger',
    'ptarmiganbuilder',
    'polentasinger',
    'pupresearcher',
    'polentasubaltern',
    'pythonsecretary',
    'pretzelsalderman',
    'quailauthor',
    'pretzelsbarber',
    'quaildispatcher',
    'pretzelscandidate',
    'quailforester',
    'pretzelscashier',
    'quaillaborer',
    'pretzelsdoctor',
    'quailmachinist',
    'pretzelsgambler',
    'raccoonassistant',
    'pretzelsmessenger',
    'racehorsebishop',
    'pretzelsproducer',
    'ratacrobat',
    'puddingbaron',
    'ratcarpenter',
    'puddingbutcher',
    'ratsoldier',
    'puddingcaterer',
    'rattlesnakeacademic',
    'puddinggeologist',
    'rattlesnakeeconomist',
    'puddingmillwright',
    'rattlesnakemagician',
    'puddingmourner',
    'rattlesnakenun',
    'puddingpaver',
    'ravenacrobat',
    'puddingpedlar',
    'ravenalderman',
    'puddingvicar',
    'ravenarsonist',
    'quichearchitect',
    'ravenartist',
    'quichebarber',
    'ravenbrewer',
    'quichebricklayer',
    'ravenplayer',
    'quicheconsultant',
    'redwingcounselor',
    'quichegirlguide',
    'redwingemployee',
    'quichehygienist',
    'rhinocerosdon',
    'quichemechanic',
    'rhinodietician',
    'quichepaver',
    'rhinojoiner',
    'quichetaxidriver',
    'rhinolaborer',
    'raisinsacademic',
    'rhinolawyer',
    'raisinsbureaucrat',
    'rhinotutor',
    'raisinscraftsman',
    'robinseamstress',
    'raisinsdietician',
    'robintherapist',
    'raisinsgambler',
    'roedeerphysician',
    'raisinsharlot',
    'ruffsstriker',
    'raisinsoperator',
    'sandpipercraftsman',
    'raisinspainter',
    'sandpipergambler',
    'raisinsperformer',
    'seafowlwidow',
    'relishbuilder',
    'seagullmessenger',
    'relishdirector',
    'seagullnurse',
    'relisheditor',
    'seagullpodiatrist',
    'relishemployee',
    'seagullundertaker',
    'relishgambler',
    'seahorsegoverness',
    'relishmachinist',
    'seahorseroofer',
    'relishmagistrate',
    'sealauditor',
    'relishnun',
    'sealdirector',
    'relishtutor',
    'sealpilot',
    'ricecandidate',
    'shadsacrobat',
    'ricefitter',
    'shadsmessenger',
    'ricegrammarian',
    'shadssheriff',
    'riceharlot',
    'sheepaccountant',
    'ricepaver',
    'sheepjournalist',
    'ricepiper',
    'shrimpexaminer',
    'ricesubaltern',
    'shrimphunter',
    'ricetailor',
    'shrimppharmacist',
    'ricetutor',
    'shrimppilot',
    'riceworshipper',
    'smeltactuary',
    'salamiassistant',
    'smeltdrafter',
    'salamibricklayer',
    'smeltplumber',
    'salamibroker',
    'smeltsailor',
    'salamigoverness',
    'snipepublisher',
    'salamimasons',
    'sparrowtutor',
    'salamiproducer',
    'spoonbillartist',
    'salamireporter',
    'spoonbillbutler',
    'salamitaverner',
    'spoonbillphysician',
    'salamiteacher',
    'squirrelgirlguide',
    'saltcook',
    'squirrellecturer',
    'saltfitter',
    'squirreltechnician',
    'saltgirlguide',
    'stoatdispatcher',
    'saltharlot',
    'stoatfitter',
    'saltmasons',
    'stoatmerchant',
    'saltnun',
    'stoatstonemason',
    'saltperformer',
    'storkassistant',
    'saltpharmacist',
    'storkcameraman',
    'saltresearcher',
    'swallowbureaucrat',
    'sardinesacademic',
    'swallowdoctor',
    'sardinesbanker',
    'swanauditor',
    'sardinescourier',
    'swanhygienist',
    'sardinesdancer',
    'swansurgeon',
    'sardinesmanager',
    'swiftcourier',
    'sardinesprogrammer',
    'swiftdesigner',
    'sardinespublisher',
    'swiftworshipper',
    'sardinesroofer',
    'tamarineditor',
    'sardinesundertaker',
    'tamarinreporter',
    'sausageartist',
    'tamarintechnician',
    'sausagebarman',
    'tapirexaminer',
    'sausagechurchgoer',
    'tapirtiler',
    'sausageexaminer',
    'tapirvicar',
    'sausagehorseman',
    'tealastronomer',
    'sausagemanager',
    'tealsubaltern',
    'sausagemusician',
    'termiteactor',
    'sausagerealtor',
    'termitefitter',
    'sausagescientist',
    'termitegambler',
    'syrupagent',
    'thrushebroker',
    'syrupchemist',
    'thrusheestimator',
    'syrupcritic',
    'thrushejournalist',
    'syrupdietician',
    'thrushmagistrate',
    'syrupgambler',
    'tortoisemanager',
    'syrupmanager',
    'tortoisemasons',
    'syrupmortician',
    'tortoisestudent',
    'syruppaver',
    'tunaannouncer',
    'syruppiper',
    'tunaengineer',
    'syrupsenator',
    'turkeyarsonist',
    'tacosactuary',
    'turkeydon',
    'tacosartiste',
    'turkeypublisher',
    'tacosengineer',
    'turtledovecapitalist',
    'tacoslawyer',
    'turtleseamstress',
    'tacosmajor',
    'unicornpaver',
    'tacosmasons',
    'viperphysician',
    'tacospoliceman',
    'vipervicar',
    'tacosvicar',
    'voledesigner',
    'tomatoeconsultant',
    'voletailor',
    'tomatoegeologist',
    'vultureemployee',
    'tomatoelecturer',
    'vultureperformer',
    'tomatoepiper',
    'wallabyiesauthor',
    'tomatoesecretary',
    'wallabyiesbanker',
    'tomatoesinger',
    'wallabyiesoperator',
    'tomatoetaverner',
    'walrusclerk',
    'tomatoetechnician',
    'walrusconsultant',
    'tomatoetrustee',
    'walrusdrafter',
    'truffleartiste',
    'walrusvicar',
    'trufflecounselor',
    'waspbricklayer',
    'truffleestimator',
    'waspmechanic',
    'trufflegeologist',
    'wasponlooker',
    'truffleglazier',
    'waterfowlartist',
    'trufflerealtor',
    'weaverdean',
    'truffleresearcher',
    'weaverhunter',
    'truffleroofer',
    'weaverlogger',
    'truffleworkman',
    'weaverpedlar',
    'vegetablesappraiser',
    'weavertrustee',
    'vegetablescandidate',
    'weaverworkman',
    'vegetableshorseman',
    'whitingarsonist',
    'vegetableslawyer',
    'whitingmanager',
    'vegetablesoperator',
    'whitingpodiatrist',
    'vegetablesresearcher',
    'widgeontechnician',
    'vegetablesseamstress',
    'wildcatwriter',
    'vegetablestraveler',
    'wildebeestcashier',
    'vegetablestutor',
    'wildebeestcritic',
    'vegetablesworshipper',
    'wildebeestscientist',
    'venisonastronomer',
    'wildfowlexaminer',
    'venisoncaterer',
    'wombatclerk',
    'venisoncobbler',
    'wombatgrammarian',
    'venisondispatcher',
    'wombatpublisher',
    'venisonharlot',
    'woodchuckastronomer',
    'venisonhermit',
    'woodcockboyscouts',
    'venisonlabourer',
    'woodcockdirector',
    'venisonmortician',
    'woodcockpipelayer',
    'venisonsecretary',
    'wrencandidate',
    'venisonsenator',
    'wrenknight',
    'wrenmasons',
    'yakdietician',
    'yakharpist',
    'zebraacademic',
    'zebradoctor'];
export const Maorinames = [
    'aporo',
    'arani',
    'arewhana',
    'harore',
    'heihei',
    'hipi',
    'hoiho',
    'kaihe',
    'kakiroa',
    'kanga',
    'kapiti',
    'kareti',
    'karuwai',
    'kau',
    'kiore',
    'korora',
    'kumara',
    'kuri',
    'kuruwhengu',
    'makimaki',
    'mokopapa',
    'nanenane',
    'painaporo',
    'panana',
    'papango',
    'paukena',
    'pea',
    'pekapeka',
    'pi',
    'pihoihoi',
    'pitoitoi',
    'poaka',
    'pokotiwha',
    'poraka',
    'raiona',
    'rakiraki',
    'rapeti',
    'remana',
    'riki',
    'riwai',
    'ropere',
    'taika',
    'takahe',
    'tetewhero',
    'tia',
    'tieke',
    'titipounamu',
    'warapi',
    'whio'];

if (Meteor.isServer) {
    Meteor.publish("usernames",function () {
        return Usernames.find(
            {},
            {
                fields: {
                    name: 1,
                },
            }
        );
    });
}
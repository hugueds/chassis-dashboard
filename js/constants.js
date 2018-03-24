var LINES = ['ALL', 'BUS', 'ML0', 'ML1', 'ML2', 'QUAL', 'LOG'];
var FUNCTION_AREAS = ['FA0', 'FA1.1', 'FA1.2', 'FA2', 'FA3.1', 'FA3.2', 'FA4', 'FA5', 'FA6', 'MO1', 'MO2', 'MO3', 'MO4', 'N.A'];
var STATIONS = [0,1,2,3,4,5,6,7,8,9,10,11, 'PM', 'N.A'];
var POSITIONS = [1,2,3,4,5,6, 'PM', 'N.A'];

var TYPES = ['ALL', 'PY', 'LTS', 'LBS', 'AGV', 'TORQUE'];

var REQUEST_STATUS = ['N.A', 'DRAFT', 'EM APROVAÇÃO', 'APROVADO', 'ATENDIDA', 'PENDENTE', 'CANCELADA'];

var STATUS = ['ALL', 'ON GOING', 'NOT STARTED', 'STOPPED', 'COMPLETED'];

var INPUTS = ['TQC', 'BQC', 'PROD', 'ECO', 'QAS', 'BRIEFING', 'TAKT RED'];
var NCG = ['OK', 'REWORK', 'STUDY', 'NOT VALID'];

var PHASES_NAMES = ['AD' ,  'SOL. ANALYSES' , 'AD APPROVAL', 'TECH EVAL',  
    'DRAWING' , 'REQ. ESPEC','RS/OS APPROVAL' , 'RFQ APPROVAL', 'TECH LEVELING', 
     'QUOTATION', 'SUP COMPARASION', 'AWARD PROPOSAL','ORDER APPENDIX',
     'KICK OFF' ,'PROJ. DEVELOP','PROJ. APPROVAL','CONSTRUCTION' ,
     'SUP. TRYOUT' ,'INSTALLATION', 'PROD TRYOUT' ,'PROD APPROVAL'    
];

var PHASES = [
    {name: 'AD' , percentage : 0 },{ name : 'SOL. ANALYSES' , percentage : 5},{ name : 'AD APPROVAL', percentage : 10},
    { name : 'TECH EVAL', percentage : 15},{ name : 'DRAWING' , percentage : 20 },{ name : 'REQ. ESPEC', percentage : 25},
    { name : 'RS/OS APPROVAL' , percentage : 30},{ name : 'RFQ APPROVAL', percentage : 35},{ name : 'TECH LEVELING', percentage : 40},
    { name : 'QUOTATION', percentage : 45},{ name : 'SUP COMPARASION', percentage : 50},{ name : 'AWARD PROPOSAL', percentage : 55},
    { name : 'ORDER APPENDIX', percentage : 60},{ name : 'KICK OFF' , percentage : 65},{ name : 'PROJ. DEVELOP' , percentage : 70},
    { name : 'PROJ. APPROVAL', percentage : 75},{ name : 'CONSTRUCTION' , percentage : 80},{ name : 'SUP. TRYOUT' , percentage : 85},
    { name : 'INSTALLATION', percentage : 90},{ name : 'PROD TRYOUT' , percentage : 95},{ name : 'PROD APPROVAL', percentage : 100}    
];

var RESPONSIBLES = ['SSBGOD', 'SSBNGG','SSBHAL','SSBDRA','SSBEXD','SSBVES',
    'SSBFCS','SSBFCI','SSBFPP','SSBHMR','SSBHLA', 'SSBHPE','SSBIGP','SSBJII',
    'SSBJGC','SSBJUA','SSBSFR','SSBUIF','SSBUCD','SSBIOD','SSBODR','SSBRSW',
    'SSBROX','SSBDOO','SSBLED','SSBWEL','SSBWAI'
];




var TABLE_CONTENT = [
    { header: "FUNÇÃO", field: "functionArea" },
    { header: "PROJETO", field: "project" },
    { header: "ATIVIDADE", field: "activity" },
    { header: "STATUS", field: "projectStatus" },
    { header: "HANDOVER", field: "handover" },
    { header: "DETALHES", field: "" },
];

var PRIORITY_TABLE = [
    { header: "FUNÇÃO", field: "functionArea" },
    { header: "PROJETO", field: "project" },     
    { header: "PRIORIDADE", field: "priority" },
    { header: "COMANDOS", field: "" }
];

var OPTION_FIELDS = [
    { value: LINES, type: 'line'},
    { value: FUNCTION_AREAS, type: 'function-area'},
    { value: STATUS, type: 'project-status'},
    { value: TYPES, type: 'type'},
    { value: STATIONS, type: 'station'},
    { value: POSITIONS, type: 'position'},
    { value: INPUTS, type: 'input'},
    { value: NCG, type: 'ncg'},
    { value: PHASES_NAMES, type: 'phase'},
    { value: REQUEST_STATUS, type: 'status-almox-os'},
    { value: REQUEST_STATUS, type: 'rc-status'},
    { value: RESPONSIBLES, type: 'responsible'},    
];

var SERVER = 'http://10.8.66.4/ltsapi/';
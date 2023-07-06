let Cliente_interno = [
    ["Codigo", "Nombre", "celular"],
    ["CI01", "Guillermo", 54535345],
    ["CI02", "Alicia", 77535345],
    ["CI03", "Victor", 70805345],
];

let Cliente_externo = [
    ["Codigo", "Nombre", "celular"],
    ["CE01", "Muebles Cornejo", 60035345],
    ["CE02", "Hipermaxi", 77535345],
    ["CE03", "Serena cotillonesr", 66505345],
];

let Proveedor = [
    ["NOMBRE","leyenda", "Direccion", "Celular", "email"],
    ["DURATEX", "servicios e importaciones", "Av Beni", "75656220", "rogerim@gmail.com"],
    ["MOVITEC", "Soluciones", "Av pagador, entre ecuador y paraguay", "64565620", "soltex@gmail.com"]
    ["BERNECk", "", "Av Circunvalacion", "7565620", "berneck@gmail.com"]
];

let tapacanto = [
    ["CODIGO", "Provedor", "COLOR",	"TAMAÑO",	"MTS X ROLLO",	"UNIDADES",	"NOMBRE DE UNIDAD",	"EMBALAJE",	"PRECIO COMPRA ROLLO", "PRECIO VENTA ROLLO", "PRECIO VENTA Mts",],
    ["T01", "DURATEX", "NOGUEIRA", "0.6 X 22", 200,	10,	"ROLLO", "CAJA", 45, 55, 0.65],
    ["T02", "MOVITEC","NOGUEIRA", "0.6 X 22", 100, 5, "ROLLO", "CAJA", 34, 42, 0.75],
    ["T03", "BERNECk","Barrique", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.75],	
    ["T04", "BERNECk","Carvhallo Hanover", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.85],	
    ["T05", "BERNECk","Carvhallo Berlin", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.85],	
    ["T06", "BERNECk","Negro", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.85],
    ["T07", "BERNECk","Itapua", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.85],
    ["T08", "BERNECk","Wengue Supremo", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 40, 0.65],
    ["T09", "BERNECk","Carvhallo Hanover", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.75],
    ["T10", "BERNECk","Nogueira Caiena", "0,4x22mm", 100, 5, "ROLLO", "CAJA", 34, 42, 0.95],
    ["T11", "BERNECk","Wengue Ravenna", "0,6x22mm", 100, 5, "ROLLO", "CAJA", 34, 50, 0.95]
];

let melamina = [
    ["CODIGO", "Provedor", "COLOR", "TAMAÑO", "UNIDADES", "NOMBRE DE UNIDAD", "EMBALAJE", "PRECIO COMPRA", "PRECIO VENTA"],
    ["M01",	"MOVITEC", "Blanco", "185x275mm", 40, "LAMINA", "PAQUETE", 100, 120],
    ["M02",	"MOVITEC","Carvalho Evora","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M03",	"MOVITEC","Nogueira Caiena","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M04",	"MOVITEC","Alamo","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M05",	"MOVITEC","Cañion","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M07",	"MOVITEC","Italian Noce","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M06",	"MOVITEC", "Negro", "185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M08",	"BERNECk","Wengue Ravena","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
    ["M09",	"BERNECk","Blanco","185x275mm", 42, "LAMINA", "PAQUETE", 100, 125],
];

let pegamento = [
    ["CODIGO", "Provedor", "NOMBRE DE UNIDAD", "EMBALAJE", "PRECIO COMPRA", "PRECIO VENTA"],
    ["P01",	 "MOVITEC", "BOLSA", "BOLSA", 80, 100],
    ["P02",	 "TEX", "BOLSA", "BOLSA", 85, 105],
];


let inventario_tapacanto = [
    ["codigo","existencia(rollos)", "existencia minima", "metraje"],
    ["T01", 22, 20, 4382],
    ["T02", 40, 20, 4000]
];

let ventas_tapacanto = [
    ["codigo", "salida", "timestamp", "comprador" ]
    ["T01", 2, 343455345354, "CI01" ],
    ["T01", 1, 343455366114, "CI02" ],
    ["T01", 10, 343455366114, "CE06" ],
    ["T02", 3, 343455366114, "CI03" ]
]

let inventario_melamina = [
    ["codigo","existencia(laminas)", "existencia minima"],
    ["M06", 500, 40],
    ["M01", 200, 35]
];

let inventario_pegamento = [
    ["codigo","existencia(laminas)", "existencia minima"],
    ["P01", 20, 5],
    ["M01", 10, 5]
];
var melaninaMap = [
   {"nombre":"Blanco","industria":"brasilera", "color": "White"},
   {"nombre":"Noguera Caiena","industria":"brasilera", "color": "Beige"},
   {"nombre":"Carvhallo Evora","industria":"brasilera", "color": "Aquamarine"},
   {"nombre":"Wengue Ravera B","industria":"brasilera", "color": "Blue"},
   {"nombre":"Blanco Berneck","industria":"Argentina", "color": "BlueViolet"},
   {"nombre":"Nogueira","industria":"brasilera", "color": "Brown"},
   {"nombre":"Negro","industria":"brasilera", "color": "Black"},
];
/*
AliceBlue
AntiqueWhite
Aqua
Aquamarine
Azure
Beige
Bisque
Black
BlanchedAlmond
Blue
BlueViolet
Brown
BurlyWood
CadetBlue
Chartreuse
Chocolate
Coral
CornflowerBlue
Cornsilk
Crimson
Cyan
DarkBlue
DarkCyan
DarkGoldenRod
DarkGray
DarkGrey
DarkGreen
DarkKhaki
DarkMagenta
DarkOliveGreen
DarkOrange
DarkOrchid
DarkRed
DarkSalmon
DarkSeaGreen
DarkSlateBlue
DarkSlateGray
DarkSlateGrey
DarkTurquoise
DarkViolet
DeepPink
DeepSkyBlue
DimGray
DimGrey
DodgerBlue
FireBrick
FloralWhite
ForestGreen
Fuchsia
Gainsboro
GhostWhite
Gold
GoldenRod
Gray
Grey
Green
GreenYellow
HoneyDew
HotPink
IndianRed
Indigo
Ivory
Khaki
Lavender
LavenderBlush
LawnGreen
LemonChiffon
LightBlue
LightCoral
LightCyan
LightGoldenRodYellow
LightGray
LightGrey
LightGreen
LightPink
LightSalmon
LightSeaGreen
LightSkyBlue
LightSlateGray
LightSlateGrey
LightSteelBlue
LightYellow
Lime
LimeGreen
Linen
Magenta
Maroon
MediumAquaMarine
MediumBlue
MediumOrchid
MediumPurple
MediumSeaGreen
MediumSlateBlue
MediumSpringGreen
MediumTurquoise
MediumVioletRed
MidnightBlue
MintCream
MistyRose
Moccasin
NavajoWhite
Navy
OldLace
Olive
OliveDrab
Orange
OrangeRed
Orchid
PaleGoldenRod
PaleGreen
PaleTurquoise
PaleVioletRed
PapayaWhip
PeachPuff
Peru
Pink
Plum
PowderBlue
Purple
RebeccaPurple
Red
RosyBrown
RoyalBlue
SaddleBrown
Salmon
SandyBrown
SeaGreen
SeaShell
Sienna
Silver
SkyBlue
SlateBlue
SlateGray
SlateGrey
Snow
SpringGreen
SteelBlue
Tan
Teal
Thistle
Tomato
Turquoise
Violet
Wheat
White
WhiteSmoke
Yellow
YellowGreen
*/
function ShowElement(elem,show) {
    if (show) {
        elem.style.display = 'block';
    } else {
        elem.style.display = 'none';
    }    
}

function DisplayMelaninaForm(show) {
    ShowElement(
        document.getElementById('melanina_add'), 
        show
    );

} 

function DisplayMelaninaEditForm(show) {
    ShowElement(
        document.getElementById('melanina_edit'), 
        show
    );
    getMelaninaToEdit(0);
}

function DisplayMelaninaDeleteForm(show) {
    ShowElement(
        document.getElementById('melanina_delete'), 
        show
    );
    getMelaninaToDelete(0);
}

function getMelaninaToEdit(index) {
    document.getElementById('NombreE').value = melaninaMap[index].nombre;
    document.getElementById('IndustriaE').value = melaninaMap[index].industria;
    document.getElementById('ColorE').value = melaninaMap[index].color;
    document.getElementById('ColorE').style.backgroundColor = melaninaMap[index].color;

    var element = document.getElementById('ColorE');
    var color = element.options[element.selectedIndex].text;
    element.style.backgroundColor = color;
    element.style.color = "Black";
    if (color == "Black") {
        element.style.color = "White";
    }
}

function getMelaninaToEditColor() {
    var element = document.getElementById('ColorE');
    var color = element.options[element.selectedIndex].text;
    element.style.backgroundColor = color;
    element.style.color = "Black";
    if (color == "Black") {
        element.style.color = "White";
    }
}

function getMelaninaToDelete(index) {
    document.getElementById('NombreD').value = melaninaMap[index].nombre;
    document.getElementById('IndustriaD').value = melaninaMap[index].industria;
    document.getElementById('ColorD').value = melaninaMap[index].color;
    document.getElementById('ColorD').style.backgroundColor = melaninaMap[index].color;
    var element = document.getElementById('ColorD');
    var color = element.options[element.selectedIndex].text;
    element.style.backgroundColor = color;
    element.style.color = "Black";
    if (color == "Black") {
        element.style.color = "White";
    }
}

function getMelaninaToDeleteColor() {
    var element = document.getElementById('ColorD');
    var color = element.options[element.selectedIndex].text;
    element.style.backgroundColor = color;
    element.style.color = "Black";
    if (color == "Black") {
        element.style.color = "White";
    }
}

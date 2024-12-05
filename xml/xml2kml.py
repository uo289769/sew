#-------------------------------------------------------------------------------
#
# Autor:      Lucas Castro Antuña
# UO289769
#-------------------------------------------------------------------------------

import xml.etree.ElementTree as ET

expresionXPath = ".//{http://www.uniovi.es}circuito//{http://www.uniovi.es}puntos"
expresionXPathHijoPunto = "{http://www.uniovi.es}punto"
expresionXPathCoordenadasPunto = "{http://www.uniovi.es}coordenadas"

def prologo(archivo, nombre):

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>" + nombre + "</name>\n")
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogo(archivo):

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def procesarCoordenadas(archivo, raiz):

    puntos = raiz.find(expresionXPath)
    if puntos is None:
        print("No se encontraron puntos en el XML.")
        return

    for punto in puntos.findall(expresionXPathHijoPunto):
        coordenadas = ""

        coordenadasPunto = punto.find(expresionXPathCoordenadasPunto)
        if (coordenadasPunto != None):
            longitud = coordenadasPunto.find("{http://www.uniovi.es}longitud").text
            latitud = coordenadasPunto.find("{http://www.uniovi.es}latitud").text
            altitud = coordenadasPunto.find("{http://www.uniovi.es}altitud").text

            coordenadas = f"{longitud},{latitud},{altitud}"

            archivo.write(coordenadas + "\n")

def main():

    nombreArchivo = input("Introduzca el nombre del archivo : ")

    try:
        arbolXML = ET.parse(nombreArchivo)
    except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()
    except ET.ParseError:
        print ('Error parseando el archivo ', nombreArchivo)
        exit()


    nombreSalida  = input("Introduzca el nombre del archivo de salida : ")

    try:
        salida = open(nombreSalida,'w')
    except IOError:
        print ('No se puede crear el archivo ', nombreSalida)
        exit()

    prologo(salida, nombreSalida)

    raiz = arbolXML.getroot()

    procesarCoordenadas(salida, raiz)

    epilogo(salida)
    salida.close()


if __name__ == '__main__':
    main()

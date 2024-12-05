#-------------------------------------------------------------------------------
#
# Autor:      Lucas Castro Antuña
# UO289769
#-------------------------------------------------------------------------------

import xml.etree.ElementTree as ET

expresionXPath = ".//{http://www.uniovi.es}circuito//{http://www.uniovi.es}puntos"
expresionXPathHijoPunto = "{http://www.uniovi.es}punto"
expresionXPathCoordenadasPunto = "{http://www.uniovi.es}coordenadas"
expresionXPathDistancia = "{http://www.uniovi.es}distancia"

# Altura de la línea horizontal
maxAltura = 650

def prologo(archivo, nombre):

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write('<polyline points=\n"')

def epilogo(archivo):

    archivo.write('style="fill:white;stroke:red;stroke-width:4" />\n')
    archivo.write('</svg>\n')

def procesarAlturas(archivo, raiz, multiplicadorAltura, reductorDistancia, distanciaIncrementada, alturaDisminuida):

    puntos = raiz.find(expresionXPath)
    if puntos is None:
        print("No se encontraron puntos en el XML.")
        return

    alturas = [maxAltura]
    distancias = [distanciaIncrementada]

    for punto in puntos.findall(expresionXPathHijoPunto):
        coordenadasPunto = punto.find(expresionXPathCoordenadasPunto)
        distancia = punto.find(expresionXPathDistancia)
        if (coordenadasPunto != None):
            alturas.append(float(coordenadasPunto.find("{http://www.uniovi.es}altitud").text) * multiplicadorAltura - alturaDisminuida)
            distancias.append(float(distancia.text) / reductorDistancia + distanciaIncrementada)

    distanciaAcumulada = 0
    for i in range(1, len(alturas)):
        distanciaAcumulada += distancias[i]
        point = f"{distanciaAcumulada},{alturas[i]}"

        archivo.write(point + "\n")

    # Cerrar la línea y volver al origen
    archivo.write(f'{distanciaAcumulada},{maxAltura}\n')
    archivo.write(f'{distancias[1]},{maxAltura}\n')
    archivo.write(f'{distancias[0]},{alturas[1]}"\n')

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

    # Multiplico la altura y disminuyo la distancia de forma proporcional para que el gráfico se vea mejor
    reductorDistancia = 5
    multiplicadorAltura = 100

    # Reduzco la posición de la altura para que el gráfico se muestre en la parte superior
    alturaDisminuida = 200

    # Aplico una distancia inicial a las distancias para visualizar mejor el gráfico
    distanciaIncrementada = 10

    procesarAlturas(salida, raiz, multiplicadorAltura, reductorDistancia, distanciaIncrementada, alturaDisminuida)

    epilogo(salida)
    salida.close()

    print(f"Archivo {nombreSalida} creado correctamente")


if __name__ == '__main__':
    main()

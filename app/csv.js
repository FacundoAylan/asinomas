export const csvToJson = (csv) => {
  const allLines = csv.split('\n');
  const header = allLines[0];
  const dataLines = allLines.slice(1);
  const fieldNames = header.split(',').map(field => field.toLowerCase().replace(/\\/g, '').replace(/"/g, ''));

  let objList = [];

  for (let i = 0; i < dataLines.length; i++) {
    const data = dataLines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => value.replace(/\\/g, '').replace(/"/g, ''));
    let tempObj = {};

    for (let j = 0; j < fieldNames.length; j++) {
      let item = fieldNames[j];
      let value = data[j];
      if (item === 'nombre artículo' || item === 'usado' || item === 'vendido' || item === 'diferencia' || item === '% diferencia'){
        tempObj[item] = value;
      }
    }

    if (tempObj["nombre artículo"] && tempObj["nombre artículo"].includes('Total')) {
      let totalObj = {
        "categoria": tempObj["nombre artículo"],
        "usado": tempObj["usado"],  // Asegúrate de usar el nombre correcto
        "vendido": tempObj["vendido"],
        "diferencia": tempObj["diferencia"],
        "porcentaje": tempObj["% diferencia"],
        "items": []
      };

      let k = i - 1;
      while (k >= 0) {
        const prevData = dataLines[k].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => value.replace(/\\/g, '').replace(/"/g, ''));
        let prevTempObj = {};

        for (let j = 0; j < fieldNames.length; j++) {
          let item = fieldNames[j];
          let value = prevData[j];

          prevTempObj[item] = value;
        }

        if (!prevTempObj["nombre artículo"].includes('Total')) {
          totalObj.items.push({
            "categoria": prevTempObj["nombre artículo"],
            "usado": prevTempObj["usado"],  // Usando el nombre correcto
            "vendido": prevTempObj["vendido"],
            "diferencia": prevTempObj["diferencia"],
          });
        } else {
          break;
        }

        k--;
      }

      objList.push(totalObj);
    }
  }

  return objList;
};
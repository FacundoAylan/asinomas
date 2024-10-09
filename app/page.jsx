"use client";
import { useState } from "react";
import { csvToJson } from "./csv";

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [info, setInfo] = useState(false);

  const handleFileChange = (event) => {
    event.stopPropagation();
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const jsonResult = csvToJson(text);
      setJsonData(jsonResult);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <main className="principal flex h-screen flex-col justify-center items-center">
      <div className="info relative w-1/2 h-1/2 rounded-lg flex flex-col items-center gap-2 border-2 border-white bg-[#040202] py-2">
        <h1 className="absolute top-16 uppercase text-[#bc302b] font-black tracking-wider text-5xl">
          ¡Informes, afuera!
        </h1>
        <div className="w-full flex flex-col gap-2 justify-center items-center absolute bottom-2">

          <label htmlFor="file-upload" className="border-white border-2 font-black text-black  text-center cursor-pointer inline-block bg-red-500 text-white py-2 px-4 rounded-2xl w-1/2">
            Subir archivo
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute top-0 left-0 w-1/2 h-1/2 opacity-0 cursor-pointer"
          />

            {
              jsonData &&
                <button
                type="button"
                onClick={() => {
                  setInfo(!info);
                }}
                className='w-1/2 bg-green-700 p-2 text-white font-black tracking-wider cursor-pointer rounded-2xl border-2 border-white'
              >
                Ver informe
              </button>
            }
        </div>
      </div>

      {/* Muestra el informe solo si info es true */}
      {info && (
        <div className="absolute z-10 h-1/2 w-1/2 bg-white overflow-y-scroll rounded-lg">
          <button
            onClick={() => setInfo(!info)}
            className="fixed z-10 rounded-full bg-red-600 font-black right-72 top-24 w-8 h-8 border-2 border-white"
          >
            X
          </button>

          {/* Revisa la estructura de jsonData y los nombres de los campos */}
          {jsonData.map((data, index) => {
            const { categoria, diferencia, porcentaje, items } = data;

            // Elimina el signo '+' del porcentaje si es necesario
            const cleanPorcentaje = porcentaje.replace(/^\+/, "");

            // Maneja la visualización de la categoría y los items
            return (
              <div key={index} className="p-4 border-b border-gray-200">
                {!porcentaje || !diferencia ? (
                  <p>{categoria} No tiene diferencia</p>
                ) : (
                  <p>
                    {categoria}{" "}
                    {porcentaje.includes("+")
                      ? `Sobran ${diferencia.replace(
                          /^\+/,
                          ""
                        )} es un ${cleanPorcentaje} positivo.`
                      : `Faltan ${diferencia.replace(
                          /^\-/,
                          ""
                        )} es un ${cleanPorcentaje} negativo.`}
                  </p>
                )}

                {/* Muestra los items si existen */}
                {items && items.length > 0 && (
                  <ul className="list-disc pl-5 mt-2">
                    {[...items].reverse().map((item, idx) =>
                      item["diferencia"] ? (
                        <li key={idx} className="mt-1">
                          {item["diferencia"].includes("+") && !item["vendido"].includes("-")
                            ? `Sobran ${item["diferencia"].replace(/^\+/, "")} de ${item["categoria"]}`
                            : `Faltan ${item["diferencia"].replace(/^\-/, "")} de ${item["categoria"]}`}
                          ,tengo ventas de {item["vendido"]} y se usó {item["usado"]}.
                        </li>
                      ) : (
                        <li key={idx} className="mt-1">
                          {item["categoria"]}: no hubo movimiento de stock
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

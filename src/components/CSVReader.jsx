import { useState } from "react";

const CSVReader = () => {
  const [csvFileData, setCsvFileData] = useState([]);

  const textToCSV = (str, delimiter = ",") => {
    const headers = str.slice(0, str.indexOf("\r")).split(delimiter);
    const rows = str.slice(str.indexOf("\n" + 1)).split("\r");

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    setCsvFileData(arr);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (s) {
      const text = s.target.result;

      textToCSV(text);
    };

    reader.readAsText(file);
  };

  const formatDate = (date) => {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/");
  };

  csvFileData?.forEach((emp) => {
    if (emp.DateTo === "NULL") {
      return (emp.DateTo = formatDate(new Date()));
    }
  });

  const pairData = csvFileData?.reduce((common, item) => {
    const filtredData = csvFileData.filter((item2) => item2 !== item);

    filtredData.map((fil) => {
      if (Number(fil.ProjectID) === Number(item.ProjectID)) {
        let testCommon = {
          ProjectID: item.ProjectID,
          empID1: fil.EmpID,
          empID2: item.EmpID,
          empDate1: fil.DateFrom,
          empDate2: item.DateFrom,
          dateTo: item.DateTo,
        };

        common.push(testCommon);
      }
    });

    return common;
  }, []);

  const uniq = pairData.filter(
    (element, index, array) =>
      array.findIndex((t) => t.ProjectID === element.ProjectID) === index
  );

  const getDaysWorkTogether = (d1, d2, dateTo) => {
    const dates = [];
    dates.push(new Date(d1));
    dates.push(new Date(d2));

    const maxDate = new Date(Math.max(...dates));
    const dateEnd = new Date(dateTo);

    let difference = dateEnd.getTime() - maxDate.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

    return TotalDays;
  };

  return (
    <div>
      <input
        className="w-full text-sm text-grey-500
            file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-green-600
            hover:file:cursor-pointer hover:file:opacity-80"
        type="file"
        name="file"
        accept=".csv"
        onChange={handleChange}
      />

      <div className="w-[680px] h-[auto] border-2 border-solid border-blue-500 mt-5">
        <div className="flex w-full justify-between text-center border-b-2 border-blue-500 border-solid">
          <p className="border-r-blue-600 border-r border-solid w-1/4 font-bold text-lg">
            Project ID
          </p>
          <p className="border-r-blue-600 border-r border-solid w-1/4 font-bold text-lg">
            Employee ID #1
          </p>
          <p className="border-r-blue-600 border-r border-solid w-1/4 font-bold text-lg">
            Employee ID #2
          </p>
          <p className="w-1/4 font-bold text-lg">Days Work Together</p>
        </div>

        {uniq?.map((data, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between text-center border-b border-blue-500 border-solid"
          >
            <p className="border-r-blue-600 border-r  border-solid w-1/4">
              {data.ProjectID}
            </p>
            <p className="border-r-blue-600 border-r border-solid w-1/4">
              {data.empID1}
            </p>
            <p className="border-r-blue-600 border-r border-solid w-1/4">
              {data.empID2}
            </p>
            <p className="w-1/4">
              {getDaysWorkTogether(data.empDate1, data.empDate2, data.dateTo)}{" "}
              days
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSVReader;

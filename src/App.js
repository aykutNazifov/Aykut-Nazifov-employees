import CSVReader from "./components/CSVReader";
import CSVReaderL from "./components/CSVReaderL";

function App() {
  return (
    <div className="w-full py-8 px-10 flex justify-center">
      {/* With Library */}
      <CSVReaderL />

      {/* Without Library */}
      {/* <CSVReader /> */}
    </div>
  );
}

export default App;

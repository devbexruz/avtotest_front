// src/pages/Admin/components/UsersStatisticsManagement.tsx
import { useState, useEffect } from "react";
import server from "../../../utils/Admin";

interface Result {
  id: number;
  name: string;
  trues: number;
  wrong: number;
  all: number;
  percentage: number;
  status: boolean;
  end_time: string;
}

export const EndResults = () => {
  const [results, setResults] = useState<Result[]>([]);

  const res = server.requestGet<Result[]>("/results/");
  
  useEffect(() => {
    res.then((data) => {
      setResults(data);
    }).catch((error) => {
      console.error("Error fetching results:", error);
    });
  }, []);


  return (
      <div className="bg-neutral-800 p-6 border border-neutral-700 bg-neutral-800 rounded-lg">
        {/* Section Title */}
        <div className="text-left mb-6 ">
          <h2 className="text-2xl font-bold text-white mb-1">
            Oxirgi natijalar
          </h2>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-5 gap-2 text-center bg-neutral-700 p-3 mb-4 text-white font-semibold text-sm">
          <div>F.I.O</div>
          <div>To'g'ri/Jami</div>
          <div>Vaqt</div>
          <div>Natija</div>
          <div>Holat</div>
        </div>

        {/* Stats Content */}
        <div className="space-y-2">
          {results.map((result) => (
            <div 
              key={result.id}
              className="grid grid-cols-5 gap-2 text-center hover:bg-neutral-600 text-white p-3 transition-colors duration-200"
            >
              <div className="text-sm font-medium truncate" title={result.name}>
                {result.name}
              </div>
              <div className="text-sm">
                <span className="text-green-400 font-bold">{result.trues}</span> / {result.all}
              </div>
              <div className="text-sm text-neutral-300">
                {result.end_time}
              </div>
              <div className="flex items-center justify-center">
                {result.status ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <div className="text-sm">
                <span className={`px-2 py-1 text-xs font-bold ${
                  result.status 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {result.status ? "O'tdi" : "Yiqildi"}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center py-8 ">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-neutral-400">
              Hali hech qanday natija mavjud emas
            </p>
          </div>
        )}
      </div>
  );
};
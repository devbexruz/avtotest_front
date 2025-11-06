import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../../utils/Backend";

interface Variant {
  id: number;
  value: string;
}

interface TestSheet {
  id: number;
  value: string;
  image: string;
  variants: Variant[];
  status?: boolean;
  current_answer?: Variant;
}

const ExamSolveTest = () => {
  const { result_id } = useParams<{ result_id: string }>();
  const navigate = useNavigate();

  const [tests, setTests] = useState<TestSheet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Testlarni olish
  const fetchTests = async () => {
    try {
      const data = await server.requestGet<TestSheet[]>(`/result/${result_id}/tests/`);
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [result_id]);

  if (loading) return <div className="text-center py-4">Yuklanmoqda...</div>;
  if (!tests.length) return <div className="text-center py-4">Test topilmadi</div>;

  const currentTest = tests[currentIndex];

  const handleSelectVariant = async (variant: Variant) => {
    if (feedback || currentTest.status !== null) return; // Javob berilgan bo'lsa yana bosilmasin

    setSelectedVariant(variant.id);
    try {
      // Serverga javob yuboramiz
      const res = await server.requestPost<{ successful: boolean }>(
        `/solve_tests/${currentTest.id}/answer/`,
        { variant_id: variant.id }
      );

      // Server { correct: true/false } qaytaradi deb faraz qilamiz
      setFeedback(res.successful ? "correct" : "wrong");
      tests[currentIndex].current_answer = variant;
      tests[currentIndex].status = res.successful;
      setTests([...tests]);

      // 1 sekunddan keyin keyingi savolga o‘tamiz
      setTimeout(() => {
        if (currentIndex + 1 < tests.length) {
          setCurrentIndex(currentIndex + 1);
          setSelectedVariant(null);
          setFeedback(null);
        } else {
          // Testni tugatish
          server.requestPost(`/solve_tests/${result_id}/finish/`, {});
          navigate(`/test_result/${result_id}`);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Ortga tugma */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md"
      >
        ⬅ Ortga
      </button>

      {/* Savol */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800">{currentTest.value}</h2>
      </div>

      <div className="flex gap-6">
        {/* Chap: Variantlar */}
        <div className="w-1/2 flex flex-col gap-4">
          {currentTest.variants.map((v) => {
            let bgClass = "bg-white border-gray-300 hover:bg-blue-100";

            if (currentTest.current_answer && v.id === currentTest.current_answer.id) {
              bgClass =
                currentTest.status
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-red-500 text-white border-red-500";
            } else if (selectedVariant === v.id) {
              bgClass = "bg-blue-500 text-white border-blue-500";
            }

            return (
              <button
                key={v.id}
                onClick={() => handleSelectVariant(v)}
                style={{
                    color: "black"
                }}
                className={`cursor-pointer p-4 rounded-xl border text-left transition ${bgClass}`}
                disabled={!!feedback} // Javob berilganidan keyin yana bosilmasin
              >
                {v.value}
              </button>
            );
          })}
        </div>

        {/* O‘ng: Rasm */}
        <div className="w-1/2 flex justify-center items-start">
          {currentTest.image ? (
            <img
              src={currentTest.image}
              alt="Test image"
              className="max-h-[400px] object-contain rounded-xl shadow"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
              Rasm mavjud emas
            </div>
          )}
        </div>
      </div>
      {/* Past: Test progress */}
      <div className="mt-6 space-y-4">
        <div className="text-black text-center md:text-left">
          Test {currentIndex + 1} / {tests.length}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {tests.map((test, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-medium transition-all duration-200 ${
                test.status === true
                  ? "bg-green-600 hover:bg-green-700"
                  : test.status === false
                  ? "bg-red-600 hover:bg-red-700"
                  : test.id === currentTest.id
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamSolveTest;

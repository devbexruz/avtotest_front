import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../utils/Backend";
import c from "../../utils/latinToCyrillic";

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
  correct_answer?: Variant;
}

const SolveTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
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
    containerRef.current?.focus();
    return () => {
        if (autoAdvanceTimeoutRef.current) {
            clearTimeout(autoAdvanceTimeoutRef.current); // Avtomatik o'tishni bekor qiladi
            autoAdvanceTimeoutRef.current = null;
        }
    };
  }, [currentIndex]); // currentIndex o'zgarganda ishlaydi

  
  if (loading) return <div className="text-center py-4">Yuklanmoqda...</div>;
  if (!tests.length) return <div className="text-center py-4">Test topilmadi</div>;

  const currentTest = tests[currentIndex];



  // Controll Test
  // Keys event
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // FAQAT kursor tugmalari va F1-F9 uchun ishlatamiz.
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
        return; // Ortig'cha eventlarni bekor qilish
    }

    console.log(event.key);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setSelectedVariant(null);
        setFeedback(null);
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (currentIndex < tests.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedVariant(null);
        setFeedback(null);
      }
    }
    // F1 dan F9 gacha bo'lgan tugmalar uchun
    else if (event.key.startsWith("F") && event.key.length === 2 && event.key !== "F10" && event.key !== "F11" && event.key !== "F12") {
      event.preventDefault(); // Brauzerning standart F-tugma harakatini bekor qilish
      const fNumber = parseInt(event.key.substring(1)); // "F1" dan 1 ni olish
      
      if (fNumber >= 1 && fNumber <= 9) {
        const index = fNumber - 1; // Variant indeksi 0 dan boshlanadi
        if (currentTest.variants[index]) {
            handleSelectVariant(currentTest.variants[index]);
        }
      }
    }
  };



  const handleSelectVariant = async (variant: Variant) => {
    if (feedback || currentTest.status !== null) return; // Javob berilgan bo'lsa yana bosilmasin
    console.log(variant);
    setSelectedVariant(variant.id);
    try {
      // Serverga javob yuboramiz
      const res = await server.requestPost<{ successful: boolean, correct_answer: Variant, error: string, finished: boolean }>(
        `/solve_tests/${currentTest.id}/answer/`,
        { variant_id: variant.id }
      );
      if(res.finished){
        navigate(`/test_result/${result_id}`);
      }
      // Server { correct: true/false } qaytaradi deb faraz qilamiz
      setFeedback(res.successful ? "correct" : "wrong");
      tests[currentIndex].current_answer = variant;
      tests[currentIndex].correct_answer = res.correct_answer;
      tests[currentIndex].status = res.successful;
      setTests([...tests]);
      const nextIndex = currentIndex + 1;
      setTimeout(() => {
        console.log(nextIndex, currentIndex);
        if (nextIndex - 1 !== currentIndex) return;
        else if (nextIndex < tests.length) {
          setCurrentIndex(nextIndex);
          setSelectedVariant(null);
          setFeedback(null);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };
  const handleFinished = () => {
    const res = server.requestPost(`/solve_tests/${result_id}/finish/`, {});
    res.then(() => {
      navigate(`/test_result/${result_id}`);
    })
  }

  return (
    <div
      id='main_container'
      tabIndex={0}
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blackblue-500 to-neutral-700"
      onKeyDown={handleKeyDown}
    >

      {/* Savol */}
      <div className="bg-neutral-700 p-4 shadow mb-6 w-full">
        <h2 className="text-xl font-semibold text-center text-neutral-100 position-absolute left-[-40px]">{c.t(currentTest.value)}</h2>
      </div>

      <div className="flex flex-col-reverse md:flex-row px-8 max-w-[1400px] justify-between gap-4">
        {/* Chap: Variantlar */}
        <div className="md:w-1/2 flex flex-col gap-1">
          {currentTest.variants.map((v, index) => {
            let bgClass = "bg-neutral-700 hover:text-white text-white hover:bg-[rgba(10,10,10,0.4)]";

            if (currentTest.current_answer && v.id === currentTest.current_answer.id) {
              bgClass =
                currentTest.status
                  ? "bg-green-500 text-black border-green-500"
                  : "bg-red-500 text-white border-red-500";
            } else if (selectedVariant === v.id) {
              bgClass = "bg-blue-500 text-black border-blue-500";
            } else if (currentTest.correct_answer && v.id === currentTest.correct_answer.id && currentTest.current_answer!==null) {
              bgClass = "bg-green-500 text-black border-green-500";
            } else if (currentTest.correct_answer && v.id === currentTest.correct_answer.id) {
              bgClass = "bg-orange-500 text-black border-green-500";
            }

            return (
              <button
                key={v.id}
                onClick={() => handleSelectVariant(v)}
                className={`focus:outline-none focus:ring-0 cursor-pointer p-[3px] text-left transition ${bgClass}`}
                disabled={feedback!==null} // Javob berilganidan keyin yana bosilmasin
              >
                <span className="mr-2 text-white font-semibold bg-blue-600 h-8 w-8 inline-flex items-center justify-center ">F{index + 1}</span>{c.t(v.value)}
              </button>
            );
          })}
        </div>

        {/* O‘ng: Rasm */}
        <div className="md:w-1/2 flex justify-center items-start">
          {currentTest.image ? (
            <img
              src={currentTest.image}
              alt="Test image"
              className="max-h-[400px] object-contain shadow"
            />
          ) : (
            <div className="sm:h-96 bg-[rgb(0,0,20,0.4)] flex items-center justify-center text-neutral-500">
            </div>
          )}
        </div>
      </div>
        <hr />
      {/* Past: Test progress */}
      <div className="mt-6 space-y-4">

        <div className="mx-auto p-10 flex flex-wrap justify-center md:justify-center justify-items-center gap-1">
          <div className="text-white text-center md:text-left p-2 ml-10 mr-10">
            {currentIndex + 1} / {tests.length}
          </div>
          {tests.map((test, index) => (
            <button
              key={index}
              autoFocus
              onClick={() => {
                setCurrentIndex(index);
                setSelectedVariant(null);
                setFeedback(null);
              }}
              className={`cursor-pointer border border-neutral-600 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white font-medium transition-all duration-200 ${
                test.id === currentTest.id
                  ? "bg-blue-600 hover:bg-blue-600 outline outline-4 outline-blue-400 z-10"
                  : test.status === true
                  ? "bg-green-600 hover:bg-green-700 text-black"
                  : test.status === false
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-neutral-600 hover:bg-neutral-400 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
          {/* Ortga tugma */}
          <button
            onClick={() => handleFinished()}
            className="ml-10 bg-green-200 hover:bg-blue-200 text-green-800 font-semibold px-6 py-2 shadow-md cursor-pointer"
          >
            {c.t("Tugatish")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveTest;
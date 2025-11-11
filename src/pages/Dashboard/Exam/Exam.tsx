import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../../utils/Backend";

const ExamAutoStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startExam = async () => {
      try {
        // Examni start qilish, count 20 default
        const response = await server.requestPost<{ id: number, error?: string }>("/start_tests/start_exam/", { count: 20 });
        const resultId = response.id;
        if (response.error) {
          alert(response.error);
          navigate("/");
          return;
        };
        // exam page ga redirect qilamiz
        window.location.href = `/testresult/${resultId}`;
      } catch (error) {
        console.error("Examni boshlashda xatolik:", error);
      }
    };

    startExam();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blackblue-500 to-neutral-700 p-4">
      <p>Exam boshlanmoqda, iltimos kuting...</p>
    </div>
  );
};

export default ExamAutoStart;

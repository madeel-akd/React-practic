import React, { useEffect, useRef, useState } from 'react'

const arrayShuffle = (arr: any[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Btn = ({ title, func }: { title: string; func: () => void }) => (
  <button onClick={func} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
    {title}
  </button>
);

const App = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [shuffled, setShuffled] = useState<string[]>([]);

  const input = useRef<any[]>([]);

  useEffect(() => {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setShuffled(arrayShuffle([...res[0].incorrectAnswers, res[0].correctAnswer]));
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const changeQuestion = () => {
    const selectedOption = input.current.find(item => item && item.checked);
    if (!selectedOption) { alert("Please select an answer!"); return; }

    if (selectedOption.value === data[questionIndex].correctAnswer) {
      setScore(prev => prev + 10);
    }
    input.current.forEach(el => { if (el) el.checked = false; });

    if (questionIndex < 9) {
      const next = questionIndex + 1;
      setQuestionIndex(next);
      setShuffled(arrayShuffle([...data[next].incorrectAnswers, data[next].correctAnswer]));
    } else {
      setResult(true);
    }
  };

  return (
    <>
      <h1>Quiz App</h1>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error occurred</h1>}
      {result && <h1>Score {score} / 100</h1>}

      {!result && data && (
        <div>
          <h1 >Q{questionIndex + 1}. {data[questionIndex].question.text}</h1>
          {shuffled.map((item, index) => (
            <div key={index} className='m-3'>
              <input
                type="radio"
                id={String(index)}
                name='quiz'
                value={item}
                ref={el => (input.current[index] = el)}
              />
              <label htmlFor={String(index)}>{item}</label>
            </div>
          ))}
          <Btn title={questionIndex < 9 ? "Next" : "Submit"} func={changeQuestion} />
        </div>
      )}
    </>
  );
};

export default App;
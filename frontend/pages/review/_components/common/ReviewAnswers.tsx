export interface Props {
  questions: string[];
  answers: string[];
}

export const ReviewAnswers = ({ questions, answers }: Props) => {
  return (
    <div className="flex flex-col gap-10 w-full">
      {questions.map((question, idx) => (
        <div
          key={`${question}-${idx}`}
          className="flex flex-col items-start gap-4"
        >
          <h5 className="font-poppins text-base font-medium leading-[1.4] text-[#252525]">
            {question}
          </h5>
          <div className="flex w-full">
            <div className="rounded-r border-l-4 border-l-[#C4C4C4] px-4 py-3 w-full font-source">
              <p className="text-base font-normal leading-[1.4] text-[#252525]">
                {answers[idx]}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

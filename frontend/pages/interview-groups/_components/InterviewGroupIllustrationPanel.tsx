const InterviewGroupIllustrationPanel = () => (
  <div className="flex h-full items-center justify-center overflow-hidden border-r border-semantic-border-light bg-charcoal-100">
    <div
      className="relative [container-type:inline-size]"
      style={{ width: "63%", aspectRatio: "441 / 537" }}
    >
      <img
        src="/common/review-page-banner.svg"
        alt="blueprint"
        className="absolute"
        style={{ left: "0%", top: "0%", width: "99.77%" }}
      />
      <p
        className="absolute whitespace-nowrap font-poppins font-medium leading-[1.4] text-semantic-text-primary"
        style={{ left: "56.46%", top: "18.07%", fontSize: "4.535cqi" }}
      >
        Interview Scheduling
      </p>
      <img
        src="/common/review-page-people.svg"
        alt=""
        className="absolute"
        style={{ left: "16.33%", top: "42.85%", width: "75.05%" }}
      />
    </div>
  </div>
);

export default InterviewGroupIllustrationPanel;

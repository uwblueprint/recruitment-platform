import Image from "next/image";

const IllustrationPanel = ({ title }: { title: string }) => (
  <div className="flex h-full items-center justify-center overflow-hidden border-r border-neutral-200 bg-surface-muted">
    <div className="relative aspect-[441/537] w-[63%] [container-type:inline-size]">
      <Image
        src="/common/review-page-banner.svg"
        alt="blueprint"
        width={440}
        height={87}
        className="absolute left-0 top-0 h-auto w-[99.77%]"
      />
      <p className="absolute left-[56.46%] top-[18.07%] whitespace-nowrap font-poppins text-[4.535cqi] font-medium leading-[1.4] text-black">
        {title}
      </p>
      <Image
        src="/common/review-page-people.svg"
        alt=""
        width={331}
        height={304}
        className="absolute left-[16.33%] top-[42.85%] h-auto w-[75.05%]"
      />
    </div>
  </div>
);

export default IllustrationPanel;

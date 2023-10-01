import { ReactNode } from "react";

export type StatisticType = {
  id: number | string;
  title: string;
  slug?: string;
  count: number;
};

export default function Statistics({
  data,
  showInfo,
}: {
  data: StatisticType[];
  showInfo?: (data: StatisticType[]) => ReactNode;
}) {
  let total = 0;
  data.map((item) => (total += item.count));

  return (
    <div>
      {showInfo && <div>{showInfo(data)}</div>}

      <div className="flex h-1 min-w-[80px] overflow-hidden rounded-full">
        {data.map((item) => (
          <div
            key={item.id}
            className={`bg-${item.slug}`}
            style={{ width: `${Math.round((item.count / total) * 100)}%` }}
          >
            {/* {Math.round((item.count / total) * 100)} */}
          </div>
        ))}
      </div>
    </div>
  );
  return <div>{data.length}</div>;
}

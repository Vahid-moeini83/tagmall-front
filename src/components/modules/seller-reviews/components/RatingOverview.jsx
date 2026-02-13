import { StarIcon } from "@/icons";

export default function RatingOverview({ ratingDistribution }) {
  return (
    <div className="flex items-start justify-between gap-8">
      {/* Progress bars section */}
      <div className="flex-1 flex flex-col gap-3">
        {ratingDistribution.map((item) => (
          <div key={item.stars} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs lg:text-sm">
              <span className="text-gray-600">
                <span className="text-gray-700 font-semibold">آرا</span>{" "}
                {item.count} ({item.percentage}%)
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs lg:text-sm">
                  {item.stars}
                  <span className="text-xs text-gray-600/70">/5</span>
                </span>
                <StarIcon className="text-yellow-600" size={20} />
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-600 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

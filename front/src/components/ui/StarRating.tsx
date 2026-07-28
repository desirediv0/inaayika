import { useState } from "react";

export function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const extraFull = rating % 1 >= 0.75 ? 1 : 0;
  const totalFull = fullStars + extraFull;
  const emptyStars = 5 - totalFull - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(totalFull)].map((_, i) => (
        <svg key={`f${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path fill="#B08D57" stroke="#B08D57" strokeWidth="0.5" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <defs>
            <linearGradient id={`half-${rating}`}>
              <stop offset="50%" stopColor="#B08D57" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${rating})`}
            stroke="#B08D57"
            strokeWidth="0.5"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <svg key={`e${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path fill="#d1d5db" stroke="#d1d5db" strokeWidth="0.5" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const activeVal = hover || value;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {ratings.map((r) => {
          const isFilled = r <= activeVal;
          const isHalfFilled = !isFilled && r - 0.5 <= activeVal;

          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(0)}
              className="relative cursor-pointer p-0 border-0 bg-transparent"
              style={{ lineHeight: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                {(isFilled || isHalfFilled) ? (
                  <defs>
                    <linearGradient id={`input-${r}-${activeVal}`}>
                      <stop
                        offset={isFilled ? "100%" : "50%"}
                        stopColor="#B08D57"
                      />
                      <stop
                        offset={isFilled ? "100%" : "50%"}
                        stopColor="#d1d5db"
                      />
                    </linearGradient>
                  </defs>
                ) : null}
                <path
                  fill={isFilled ? "#B08D57" : isHalfFilled ? `url(#input-${r}-${activeVal})` : "#d1d5db"}
                  stroke={isFilled || isHalfFilled ? "#B08D57" : "#d1d5db"}
                  strokeWidth="0.5"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </button>
          );
        })}
      </div>
      <span className="ml-2 text-sm text-muted-foreground font-medium">{value} / 5</span>
    </div>
  );
}

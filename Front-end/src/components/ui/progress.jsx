export function Progress({ value, color }) {
    return (
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="h-2 rounded"
          style={{
            width: `${value}%`,
            backgroundColor: color || '#60A5FA',
          }}
        />
      </div>
    );
  }
  
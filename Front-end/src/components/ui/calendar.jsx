export function Calendar() {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-center font-semibold">Tháng 2, 2025</p>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {[...Array(30)].map((_, index) => (
            <div
              key={index}
              className={`p-2 text-center ${
                index === 12 ? "bg-purple-500 text-white rounded-md" : "bg-gray-100 rounded-md"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
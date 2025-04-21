export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="join mt-3">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`join-item btn ${
            currentPage === index + 1 ? "btn-active" : ""
          }`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

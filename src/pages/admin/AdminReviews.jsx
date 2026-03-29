import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../service/admin.service";

export default function AdminReviews() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: reviewService.getReviews,
  });

  const deleteMutation = useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
    },
  });

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-gray-500">Manage customer reviews</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-medium">
                        {review.reviewerName?.[0]?.toUpperCase() || review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{review.reviewerName || review.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">{getRatingStars(review.rating || 0)}</div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt?.slice(0, 10) || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3">{review.comment || review.text || review.content}</p>
                    {review.product && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <img 
                          src={review.product.image} 
                          alt="" 
                          className="w-6 h-6 object-cover rounded"
                          onError={(e) => e.target.style.display = "none"}
                        />
                        <span>Product:</span>
                        <span className="font-medium text-gray-700">{review.product.name}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this review?")) {
                        deleteMutation.mutate(review.id);
                      }
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}

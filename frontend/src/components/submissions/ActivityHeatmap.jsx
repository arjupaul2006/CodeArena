import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

export default function ActivityHeatmap() {
  const matrixRows = 7;
  const matrixCols = 46;

  const [submissionEachDay, setSubmissionEachDay] = useState([]);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // --------------------------------
  // Fetch submission data
  // --------------------------------

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/getSubmissionEachDay`,
          {
            data: {
              searchUserId: null, 
            },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        console.log("Submission in Each Day Heatmap:", response.data);

        setSubmissionEachDay(response.data.submissions || []);
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchSubmissionData();
  }, [backendUrl]);

  // --------------------------------
  // Convert API data into a Map
  // --------------------------------

  const submissionMap = useMemo(() => {
    const map = new Map();

    submissionEachDay.forEach((submission) => {
      map.set(submission._id, submission.count);
    });

    return map;
  }, [submissionEachDay]);

  // --------------------------------
  // Generate dates for heatmap
  // --------------------------------

  const dates = useMemo(() => {
    const result = [];

    const today = new Date();

    // Start approximately 46 weeks ago
    const startDate = new Date(today);

    startDate.setDate(today.getDate() - matrixCols * 7 + 1);

    for (let i = 0; i < matrixCols * matrixRows; i++) {
      const date = new Date(startDate);

      date.setDate(startDate.getDate() + i);

      result.push(date);
    }

    return result;
  }, []);

  // --------------------------------
  // Get YYYY-MM-DD
  // --------------------------------

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------
  // Get color based on submissions
  // --------------------------------

  const getColor = (count) => {
    if (count === 0) {
      return "bg-[#dcecdf] hover:bg-[#c9e1cc]";
    }

    if (count <= 2) {
      return "bg-[#a6cbaa] hover:bg-[#90b895]";
    }

    if (count <= 4) {
      return "bg-[#64a478] hover:bg-[#4d8f61]";
    }

    if (count <= 7) {
      return "bg-[#3f7d55] hover:bg-[#326844]";
    }

    return "bg-[#244333] hover:bg-[#183226]";
  };

  // --------------------------------
  // Total submissions
  // --------------------------------

  const totalSubmissions = useMemo(() => {
    return submissionEachDay.reduce(
      (total, submission) => total + Number(submission.count || 0),
      0,
    );
  }, [submissionEachDay]);

  // --------------------------------
  // Find last active date
  // --------------------------------

  const lastActiveDate = useMemo(() => {
    if (!submissionEachDay.length) {
      return null;
    }

    const sorted = [...submissionEachDay].sort(
      (a, b) => new Date(b._id) - new Date(a._id),
    );

    return sorted[0]?._id || null;
  }, [submissionEachDay]);

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-[#183226] tracking-tight">
          Activity Heatmap
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#547060] font-medium">
          <span>Less</span>

          <div className="w-2.5 h-2.5 bg-[#dcecdf] rounded-xs" />

          <div className="w-2.5 h-2.5 bg-[#a6cbaa] rounded-xs" />

          <div className="w-2.5 h-2.5 bg-[#64a478] rounded-xs" />

          <div className="w-2.5 h-2.5 bg-[#3f7d55] rounded-xs" />

          <div className="w-2.5 h-2.5 bg-[#244333] rounded-xs" />

          <span>More</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#a6cbaa]">
        <div className="flex flex-col gap-1 min-w-[720px]">
          {Array.from({
            length: matrixRows,
          }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {Array.from({
                length: matrixCols,
              }).map((_, colIndex) => {

                const dateIndex = colIndex * matrixRows + rowIndex;

                const date = dates[dateIndex];

                if (!date) {
                  return <div key={colIndex} className="w-3 h-3" />;
                }

                const dateString = formatDate(date);

                const count = submissionMap.get(dateString) || 0;

                return (
                  <div
                    key={colIndex}
                    className={`w-3 h-3 rounded-[2px] transition-all cursor-pointer ${getColor(
                      count,
                    )}`}
                    title={`${count} submission${
                      count !== 1 ? "s" : ""
                    } on ${dateString}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 text-xs font-medium text-[#547060]">
        <span>
          Yearly Submissions:{" "}
          <strong className="text-[#183226] font-mono">
            {totalSubmissions}
          </strong>
        </span>

        <span>
          Last active:{" "}
          <strong className="text-[#385a43]">
            {lastActiveDate || "No activity"}
          </strong>
        </span>
      </div>
    </div>
  );
}

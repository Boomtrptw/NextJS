"use client";

import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
);

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/dashboard");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  const grades = data ? data.grades : [];

  const processData = (data: any) => {
    return data.map((item: any) => ({
      ...item,
      credit: parseFloat(item.credit),
      grade_point: parseFloat(item.grade_point),
    }));
  };

  const processedData = processData(grades);

  const calculateGPA = (year: number) => {
    const yearData = processedData.filter((item: any) => item.year === year);
    const totalCredits = yearData.reduce(
      (sum: number, item: any) => sum + item.credit,
      0
    );
    const totalGradePoints = yearData.reduce(
      (sum: number, item: any) => sum + item.grade_point * item.credit,
      0
    );

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const calculatePercentage = (gpa: number) => (gpa / 4.0) * 100;

  const barChartData = {
    labels: ["ปี 2563", "ปี 2564", "ปี 2565", "ปี 2566"],
    datasets: [
      {
        data: [
          calculatePercentage(calculateGPA(2563)),
          calculatePercentage(calculateGPA(2564)),
          calculatePercentage(calculateGPA(2565)),
          calculatePercentage(calculateGPA(2566)),
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "กราฟแสดงคะแนนเฉลี่ยในแต่ละปี (%)",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          min: 0,
          max: 100,
        },
      },
    },
  };

  const bestYear = [2563, 2564, 2565, 2566].reduce((bestYear, year) => {
    return calculateGPA(year) > calculateGPA(bestYear) ? year : bestYear;
  }, 2563);

  const bestYearData = processedData.filter(
    (item: any) => item.year === bestYear
  );

  const randomColors = Array.from({ length: 9 }, getRandomColor);

  const bestYearChartData = {
    labels: bestYearData.map((item: any) => item.subject_code),
    datasets: [
      {
        label: "คะแนนในปีที่ดีที่สุด",
        data: bestYearData.map((item: any) => item.grade_point),
        backgroundColor: randomColors,
        borderColor: randomColors,
        borderWidth: 2,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `กราฟแสดงคะแนนเฉลี่ยในปี ${bestYear}`,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.raw;
              const subjectName = bestYearData[context.dataIndex].subject_name;
              return `${subjectName}: ${label}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: true,
          },
        },
        y: {
          grid: {
            display: false,
          },
          min: 0,
          max: 4,
        },
      },
    },
  };

  const calculateTermGPA = (term: number, year: number) => {
    const termData = processedData.filter(
      (item: any) => item.term === term && item.year === year
    );
    const totalCredits = termData.reduce(
      (sum: number, item: any) => sum + item.credit,
      0
    );
    const totalGradePoints = termData.reduce(
      (sum: number, item: any) => sum + item.grade_point * item.credit,
      0
    );

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const termLabels = [
    "1 / 2563",
    "2 / 2563",
    "1 / 2564",
    "2 / 2564",
    "1 / 2565",
    "2 / 2565",
    "1 / 2566",
    "2 / 2566",
  ];

  const chartData = {
    labels: termLabels, // แสดงชื่อเทอม
    datasets: [
      {
        label: "GPA: ",
        data: [
          calculateTermGPA(1, 2563), // GPA เทอม 1 ปี 2563
          calculateTermGPA(2, 2563), // GPA เทอม 2 ปี 2563
          calculateTermGPA(1, 2564), // GPA เทอม 1 ปี 2564
          calculateTermGPA(2, 2564), // GPA เทอม 2 ปี 2564
          calculateTermGPA(1, 2565), // GPA เทอม 1 ปี 2565
          calculateTermGPA(2, 2565), // GPA เทอม 2 ปี 2565
          calculateTermGPA(1, 2566), // GPA เทอม 1 ปี 2566
          calculateTermGPA(2, 2566), // GPA เทอม 2 ปี 2566
        ], // ข้อมูลคะแนน
        fill: false, // ไม่เติมสีใต้เส้น
        borderColor: "#36A2EB", // สีเส้น
        tension: 0.1, // ความตึงของเส้น
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "กราฟแสดงคะแนนเฉลี่ยในแต่ละเทอม",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          min: 0,
          max: 4,
        },
      },
    },
  };

  const techStackData = data ? data.tech_stack : [];

  const frontendTechStack = techStackData.filter(
    (tech: any) => tech.type === "Frontend"
  );
  const backendTechStack = techStackData.filter(
    (tech: any) => tech.type === "Backend"
  );
  const databaseTechStack = techStackData.filter(
    (tech: any) => tech.type === "Database"
  );

  const randomColorsFrontend = Array.from({ length: 5 }, getRandomColor);
  const frontendChartData = {
    labels: frontendTechStack.map((tech: any) => tech.name),
    datasets: [
      {
        data: frontendTechStack.map((tech: any) => tech.expertise_level),
        backgroundColor: randomColorsFrontend,
        borderColor: randomColorsFrontend,
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const subjectName = frontendTechStack[context.dataIndex].name;
              const level =
                frontendTechStack[context.dataIndex].expertise_level;
              return `${subjectName}: ความชำนาญ ${level}`;
            },
          },
        },
      },
    },
  };

  const randomColorsBackend = Array.from({ length: 3 }, getRandomColor);
  const backendChartData = {
    labels: backendTechStack.map((tech: any) => tech.name),
    datasets: [
      {
        data: backendTechStack.map((tech: any) => tech.expertise_level),
        backgroundColor: randomColorsBackend,
        borderColor: randomColorsBackend,
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const subjectName = backendTechStack[context.dataIndex].name;
              const level = backendTechStack[context.dataIndex].expertise_level;
              return `${subjectName}: ความชำนาญ ${level}`;
            },
          },
        },
      },
    },
  };

  const randomColorsDatabase = Array.from({ length: 3 }, getRandomColor);
  const databaseChartData = {
    labels: databaseTechStack.map((tech: any) => tech.name),
    datasets: [
      {
        data: databaseTechStack.map((tech: any) => tech.expertise_level),
        backgroundColor: randomColorsDatabase,
        borderColor: randomColorsDatabase,
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const subjectName = databaseTechStack[context.dataIndex].name;
              const level =
                databaseTechStack[context.dataIndex].expertise_level;
              return `${subjectName}: ความชำนาญ ${level}`;
            },
          },
        },
      },
    },
  };

  return (
    <div className="p-8 bg-gray-100" style={{ height: "90vh" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ height: "100%" }}
      >
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">คะแนนในแต่ละปี (%)</h2>
          <div className="h-64 rounded flex items-center justify-center">
            {data ? (
              <Bar
                data={barChartData}
                options={barChartData.options}
                height={"100%"}
                width={null}
              />
            ) : (
              "กำลังโหลด..."
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">ปีการศึกษาที่ดีที่สุด</h2>
          <div className="h-64 rounded flex items-center justify-center">
            {data ? (
              <Bar
                data={bestYearChartData}
                options={bestYearChartData.options}
                height={"100%"}
                width={null}
              />
            ) : (
              "กำลังโหลด..."
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">ภาพรวม 8 เทอม</h2>
          <div className="h-64 rounded flex items-center justify-center">
            {data ? (
              <Line
                data={chartData}
                options={chartData.options}
                height={"100%"}
                width={null}
              />
            ) : (
              "กำลังโหลด..."
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <div className="grid grid-cols-3 gap-4 h-64">
            {/* Frontend Doughnut */}
            <div className="flex justify-center items-center">
              {data ? (
                <Doughnut
                  data={frontendChartData}
                  options={frontendChartData.options}
                />
              ) : (
                "กำลังโหลด..."
              )}
            </div>

            {/* Backend Doughnut */}
            <div className="flex justify-center items-center">
              {data ? (
                <Doughnut
                  data={backendChartData}
                  options={backendChartData.options}
                />
              ) : (
                "กำลังโหลด..."
              )}
            </div>

            {/* Database Doughnut */}
            <div className="flex justify-center items-center">
              {data ? (
                <Doughnut
                  data={databaseChartData}
                  options={databaseChartData.options}
                />
              ) : (
                "กำลังโหลด..."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

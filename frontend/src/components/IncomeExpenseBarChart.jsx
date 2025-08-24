// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const IncomeExpenseBarChart = ({ data }) => {
//   const hasData = data && (data.income > 0 || data.expenses > 0);
  
//   const chartData = {
//     labels: ['Income', 'Expenses'],
//     datasets: [
//       {
//         label: 'Amount',
//         data: hasData ? [data.income, data.expenses] : [0, 0],
//         backgroundColor: [
//           'rgba(74, 222, 128, 0.7)',
//           'rgba(248, 113, 113, 0.7)',
//         ],
//         borderColor: [
//           'rgba(74, 222, 128, 1)',
//           'rgba(248, 113, 113, 1)',
//         ],
//         borderWidth: 1,
//         borderRadius: 6,
//       },
//     ],
//   };

//  // IncomeExpenseBarChart.jsx - Update the tooltip callback
// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//       labels: {
//         color: '#e2e8f0',
//         font: {
//           size: 14
//         }
//       }
//     },
//     title: {
//       display: true,
//       text: 'Income vs Expenses',
//       color: '#e2e8f0',
//       font: {
//         size: 16,
//         weight: 'bold'
//       }
//     },
//     tooltip: {
//       callbacks: {
//         label: function(context) {
//           return `₹${context.raw.toLocaleString('en-IN')}`;
//         }
//       }
//     }
//   },
//   scales: {
//     x: {
//       grid: {
//         color: 'rgba(255, 255, 255, 0.1)'
//       },
//       ticks: {
//         color: '#cbd5e1'
//       }
//     },
//     y: {
//       grid: {
//         color: 'rgba(255, 255, 255, 0.1)'
//       },
//       ticks: {
//         color: '#cbd5e1',
//         callback: function(value) {
//           return '₹' + value.toLocaleString('en-IN');
//         }
//       }
//     },
//   },
//   maintainAspectRatio: false
// };

//   return (
//     <div className="h-80">
//       {hasData ? (
//         <Bar data={chartData} options={options} />
//       ) : (
//         <div className="h-full flex flex-col items-center justify-center text-gray-400">
//           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2极速飞艇 v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//           <p className="text-lg">No financial data yet</p>
//           <p className="text-sm">Add income and expenses to get started</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IncomeExpenseBarChart;

















































import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Constants for better maintainability
const CHART_CONFIG = {
  colors: {
    income: {
      background: 'rgba(74, 222, 128, 0.7)',
      border: 'rgba(74, 222, 128, 1)'
    },
    expenses: {
      background: 'rgba(248, 113, 113, 0.7)',
      border: 'rgba(248, 113, 113, 1)'
    }
  },
  layout: {
    borderRadius: 6,
    borderWidth: 1
  }
};

const EMPTY_STATE_CONFIG = {
  icon: (
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  ),
  title: "No financial data yet",
  description: "Add income and expenses to get started"
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#e2e8f0',
        font: {
          size: 14
        }
      }
    },
    title: {
      display: true,
      text: 'Income vs Expenses',
      color: '#e2e8f0',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `₹${context.raw.toLocaleString('en-IN')}`;
        }
      },
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#e2e8f0',
      bodyColor: '#e2e8f0',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#cbd5e1',
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#cbd5e1',
        callback: function(value) {
          return '₹' + value.toLocaleString('en-IN');
        },
        font: {
          size: 11
        }
      }
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  }
};

// Utility functions
const hasValidData = (data) => {
  return data && typeof data === 'object' && (data.income > 0 || data.expenses > 0);
};

const prepareChartData = (rawData) => {
  const labels = ['Income', 'Expenses'];
  
  return {
    labels,
    datasets: [
      {
        label: 'Amount',
        data: hasValidData(rawData) ? [rawData.income, rawData.expenses] : [0, 0],
        backgroundColor: [
          CHART_CONFIG.colors.income.background,
          CHART_CONFIG.colors.expenses.background,
        ],
        borderColor: [
          CHART_CONFIG.colors.income.border,
          CHART_CONFIG.colors.expenses.border,
        ],
        borderWidth: CHART_CONFIG.layout.borderWidth,
        borderRadius: CHART_CONFIG.layout.borderRadius,
        hoverBackgroundColor: [
          CHART_CONFIG.colors.income.border,
          CHART_CONFIG.colors.expenses.border,
        ],
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
    ],
  };
};

// Components
const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
    {EMPTY_STATE_CONFIG.icon}
    <p className="text-lg font-medium mb-1">{EMPTY_STATE_CONFIG.title}</p>
    <p className="text-sm text-gray-500">{EMPTY_STATE_CONFIG.description}</p>
  </div>
);

const ChartContainer = ({ children }) => (
  <div className="h-80 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
    {children}
  </div>
);

// Main component
const IncomeExpenseBarChart = ({ data }) => {
  console.log("Income vs Expenses Data:", data);

  // Memoized calculations for better performance
  const isValidData = useMemo(() => hasValidData(data), [data]);
  const chartData = useMemo(() => prepareChartData(data), [data]);
  
  // Enhanced options with conditional title
  const chartOptions = useMemo(() => ({
    ...CHART_OPTIONS,
    plugins: {
      ...CHART_OPTIONS.plugins,
      title: {
        ...CHART_OPTIONS.plugins.title,
        text: isValidData ? 'Income vs Expenses' : 'No Data Available'
      }
    }
  }), [isValidData]);

  return (
    <ChartContainer>
      {isValidData ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <EmptyState />
      )}
    </ChartContainer>
  );
};

export default React.memo(IncomeExpenseBarChart);
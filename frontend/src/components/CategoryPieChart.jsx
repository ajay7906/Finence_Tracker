// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const CategoryPieChart = ({ data }) => {
//     console.log("Category Pie Chart Data:", data);
//   const hasData = data && data.length > 0 && data.some(item => item.total > 0);
  
//   // Prepare data for chart
//   const chartData = {
//     labels: hasData ? data.map(d => d.category) : ['No data'],
//     datasets: [
//       {
//         data: hasData ? data.map(d => d.total) : [100],
//         backgroundColor: hasData ? [
//           '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
//           '#ef4444', '#6366f1', '#ec4899', '#6b7280',
//           '#84cc16', '#f97316', '#06b6d4', '#a855f7'
//         ] : ['#4B5563'],
//         borderWidth: 0,
//         borderColor: '#1f2937',
//       },
//     ],
//   };

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'right',
//       labels: {
//         color: '#e2e8f0',
//         font: {
//           size: 12
//         },
//         padding: 20
//       }
//     },
//     tooltip: {
//       enabled: hasData,
//       callbacks: {
//         label: function(context) {
//           const label = context.label || '';
//           const value = context.raw || 0;
//           const total = context.dataset.data.reduce((a, b) => a + b, 0);
//           const percentage = Math.round((value / total) * 100);
//           return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
//         }
//       },
//       backgroundColor: '#1f2937',
//       titleColor: '#e2e8f0',
//       bodyColor: '#e2e8f0',
//       borderColor: '#374151',
//       borderWidth: 1
//     }
//   }
// };

//   return (
//     <div className="h-80">
//       {hasData ? (
//         <Pie data={chartData} options={options} />
//       ) : (
//         <div className="h-full flex flex-col items-center justify-center text-gray-400">
//           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 极速飞艇 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//           <p className="text-lg">No category data</p>
//           <p className="text-sm">Add expenses to see breakdown</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryPieChart;
























import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js registration
ChartJS.register(ArcElement, Tooltip, Legend);

// Constants for better maintainability
const CHART_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
  '#ef4444', '#6366f1', '#ec4899', '#6b7280',
  '#84cc16', '#f97316', '#06b6d4', '#a855f7'
];

const EMPTY_STATE_CONFIG = {
  color: '#4B5563',
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
  title: "No category data",
  description: "Add expenses to see breakdown"
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#e2e8f0',
        font: {
          size: 12
        },
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
        }
      },
      backgroundColor: '#1f2937',
      titleColor: '#e2e8f0',
      bodyColor: '#e2e8f0',
      borderColor: '#374151',
      borderWidth: 1
    }
  }
};

// Utility functions
const hasValidData = (data) => {
  return data && Array.isArray(data) && data.length > 0 && data.some(item => item.total > 0);
};

const prepareChartData = (rawData) => {
  if (!hasValidData(rawData)) {
    return {
      labels: ['No data'],
      datasets: [{
        data: [100],
        backgroundColor: [EMPTY_STATE_CONFIG.color],
        borderWidth: 0,
      }]
    };
  }

  return {
    labels: rawData.map(d => d.category),
    datasets: [{
      data: rawData.map(d => d.total),
      backgroundColor: CHART_COLORS.slice(0, rawData.length),
      borderWidth: 0,
      borderColor: '#1f2937',
    }]
  };
};

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400">
    {EMPTY_STATE_CONFIG.icon}
    <p className="text-lg">{EMPTY_STATE_CONFIG.title}</p>
    <p className="text-sm">{EMPTY_STATE_CONFIG.description}</p>
  </div>
);

const CategoryPieChart = ({ data }) => {
  console.log("Category Pie Chart Data:", data);

  // Memoized calculations for better performance
  const chartData = useMemo(() => prepareChartData(data), [data]);
  const isValidData = useMemo(() => hasValidData(data), [data]);
  
  // Memoize options to prevent unnecessary re-renders
  const chartOptions = useMemo(() => ({
    ...CHART_OPTIONS,
    plugins: {
      ...CHART_OPTIONS.plugins,
      tooltip: {
        ...CHART_OPTIONS.plugins.tooltip,
        enabled: isValidData
      }
    }
  }), [isValidData]);

  return (
    <div className="h-80">
      {isValidData ? (
        <Pie data={chartData} options={chartOptions} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default React.memo(CategoryPieChart);